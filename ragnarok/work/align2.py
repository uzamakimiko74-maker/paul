import json, re, unicodedata, difflib
def norm(w):
    w = unicodedata.normalize('NFKD', w.lower()); w = ''.join(c for c in w if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', w)
def align(stt, items):
    """stt: [{w,a,b}], items: [{id,text,para}] -> per-sentence (id, first_word_idx, last_word_idx)"""
    A = []; sidx = []
    for si, it in enumerate(items):
        for tok in it['text'].split():
            n = norm(tok)
            if n: A.append(n); sidx.append(si)
    B = [norm(w['w']) for w in stt]
    sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
    amap = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): amap[blk.a + k] = blk.b + k
    first = [None] * len(items); last = [None] * len(items)
    for ai, si in enumerate(sidx):
        if ai in amap:
            j = amap[ai]
            if first[si] is None: first[si] = j
            last[si] = j
    # fill gaps by interpolation on script-token position
    n = len(items)
    for si in range(n):
        if first[si] is None:
            # estimate from neighbours
            prev = next((last[k] for k in range(si - 1, -1, -1) if last[k] is not None), -1)
            nxt = next((first[k] for k in range(si + 1, n) if first[k] is not None), len(stt))
            first[si] = min(len(stt) - 1, prev + 1); last[si] = max(first[si], min(len(stt) - 1, nxt - 1))
    # make monotone and contiguous
    for si in range(1, n):
        if first[si] <= last[si - 1]: first[si] = last[si - 1] + 1
        if last[si] < first[si]: last[si] = first[si]
    first[0] = 0 if first[0] > 2 else first[0]; last[-1] = len(stt) - 1
    cov = sum(1 for k in amap) / max(1, len(A))
    return [(items[i]['id'], first[i], last[i]) for i in range(n)], cov
