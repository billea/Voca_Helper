
import sys, time, requests, pandas as pd

IN = sys.argv[1] if len(sys.argv) > 1 else "vocab_from_images_batch.xlsx"
OUT = sys.argv[2] if len(sys.argv) > 2 else "vocab_with_syn_ant.xlsx"

df = pd.read_excel(IN)

def fetch_words(endpoint, w, maxn=10):
    url = f"https://api.datamuse.com/words?{endpoint}={requests.utils.quote(w)}&max={maxn}"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    data = r.json()
    return [x["word"] for x in data]

syn_cache, ant_cache = {}, {}

syns_col, ants_col = [], []
for i, row in df.iterrows():
    w = str(row.get("word","")).strip()
    if not w:
        syns_col.append("")
        ants_col.append("")
        continue
    if w not in syn_cache:
        try:
            syn_cache[w] = fetch_words("rel_syn", w, 12)
            time.sleep(0.1)
        except Exception:
            syn_cache[w] = []
    if w not in ant_cache:
        try:
            ant_cache[w] = fetch_words("rel_ant", w, 12)
            time.sleep(0.1)
        except Exception:
            ant_cache[w] = []
    syns_col.append(", ".join(syn_cache[w]))
    ants_col.append(", ".join(ant_cache[w]))

df["synonyms"] = syns_col
df["antonyms"] = ants_col
df.to_excel(OUT, index=False)
print(f"Saved {OUT}")
