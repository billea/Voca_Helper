
import argparse, time, json
import pandas as pd, requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def make_session(timeout):
    s = requests.Session()
    retry = Retry(total=3, backoff_factor=0.3, status_forcelist=(429,500,502,503,504))
    s.mount("https://", HTTPAdapter(max_retries=retry))
    s.mount("http://", HTTPAdapter(max_retries=retry))
    s.request = lambda *a, **k: requests.Session.request(s, *a, timeout=timeout, **k)
    return s

def pick_def_and_example(payload):
    try:
        entry = payload[0]
        meanings = entry.get("meanings", [])
        for m in meanings:
            defs = m.get("definitions", [])
            if defs:
                d = defs[0].get("definition", "")
                ex = defs[0].get("example", "")
                if d:
                    return d, ex
        return "", ""
    except Exception:
        return "", ""

def fetch_definition(session, word):
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{requests.utils.quote(word)}"
    try:
        r = session.get(url)
        r.raise_for_status()
        return pick_def_and_example(r.json())
    except Exception:
        return "", ""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input",  nargs="?", default="vocab_with_syn_ant.xlsx", help="input Excel path")
    ap.add_argument("output", nargs="?", default="vocab_with_defs.xlsx",   help="output Excel path")
    ap.add_argument("--limit", type=int, default=0, help="limit number of rows for a quick run (0=all)")
    ap.add_argument("--max-workers", type=int, default=6)
    ap.add_argument("--timeout", type=int, default=4)
    ap.add_argument("--checkpoint-every", type=int, default=25)
    args = ap.parse_args()

    df = pd.read_excel(args.input).fillna("")
    if "word" not in df.columns:
        raise SystemExit("Expected a 'word' column in the input file.")

    if "definition" not in df.columns:
        df["definition"] = ""
    if "example" not in df.columns:
        df["example"] = ""

    rows = list(range(len(df)))
    if args.limit and args.limit > 0:
        rows = rows[:args.limit]

    targets = [i for i in rows if not str(df.loc[i, "definition"]).strip()]

    session = make_session(args.timeout)

    results = {}
    total = len(targets)
    if total == 0:
        print("Nothing to fetch — all rows already have definitions.")
        df.to_excel(args.output, index=False)
        print(f"Saved {args.output}")
        return

    print(f"Fetching definitions for {total} word(s)...")

    def task(i):
        w = str(df.loc[i, "word"]).strip()
        time.sleep(0.05)
        d, ex = fetch_definition(session, w)
        return i, d, ex

    with ThreadPoolExecutor(max_workers=args.max_workers) as ex:
        futs = {ex.submit(task, i): i for i in targets}
        for n, fut in enumerate(as_completed(futs), 1):
            i, d, ex = fut.result()
            results[i] = (d, ex)
            if n % args.checkpoint_every == 0 or n == total:
                print(f"[{n}/{total}] processed — writing checkpoint...", flush=True)
                for row_idx, (dd, ee) in results.items():
                    if dd and not str(df.loc[row_idx, "definition"]).strip():
                        df.loc[row_idx, "definition"] = dd
                    if ee and not str(df.loc[row_idx, "example"]).strip():
                        df.loc[row_idx, "example"] = ee
                df.to_excel(args.output, index=False)

    print(f"Saved {args.output}")

if __name__ == "__main__":
    main()
