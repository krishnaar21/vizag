import json, os
_D=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'illus.json')))
DEFS='''<svg class="hvdefs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<linearGradient id="hvg-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="hs-ink" stop-opacity=".62"/><stop offset="1" class="hs-ink" stop-opacity=".16"/></linearGradient>
<linearGradient id="hvg-sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5A65B" stop-opacity=".75"/><stop offset=".55" stop-color="#C46A7A" stop-opacity=".55"/><stop offset="1" class="hs-ink" stop-opacity=".35"/></linearGradient>
<linearGradient id="hvg-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FA8DC" stop-opacity=".7"/><stop offset="1" stop-color="#2E6F9E" stop-opacity=".55"/></linearGradient>
<pattern id="hvp-dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.15" class="hs-inkf" fill-opacity=".55"/></pattern>
<pattern id="hvp-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="5" class="hs-inkf" fill-opacity=".5"/></pattern>
<filter id="hvf-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.25" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter>
</defs></svg>'''
SHADES=[('flat','Flat'),('fade','Gradient'),('sunset','Sunset'),('dots','Halftone'),('hatch','Lines'),('grain','Grain'),('duo','Duotone')]
_E=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'illus2.json')))
def carousel():
    W,H=_E['w'],_E['h']; sc=''
    for i,s in enumerate(_E['scenes']):
        sunc='hvm' if s['k']=='0a27' else 'hvs'
        sc+=(f'<g class="hvsc{" on" if i==0 else ""}"><path class="hvc" d="{s["cloud"]}"/><path class="{sunc}" d="{s["sun"]}"/><path class="hvcut" d="{s.get("cut","")}"/><path class="hvw" d="{s.get("warm","")}"/>'
             f'<path class="hvkb" d="{s["ink"]}"/><path class="hvk" d="{s["ink"]}"/></g>')
    svg=(f'<svg class="hvone" viewBox="0 0 {W} {H}" aria-hidden="true"><g transform="translate(168 229) scale(.8) translate(-168 -229)">{sc}<path class="hvkb" d="{_E["palms"]}"/><path class="hvk" d="{_E["palms"]}"/></g>'
         f'<path class="hvkb" d="{_E["ground"]}"/><path class="hvk" d="{_E["ground"]}"/></svg>')
    pls=''.join(f'<svg class="hvpl" viewBox="0 0 {o["w"]} {o["h"]}" aria-hidden="true"><use href="#sc-{n}" width="{o["w"]}" height="{o["h"]}"/></svg>' for n,o in enumerate(_P_()))
    return DEFS+f'<div class="hvstage" id="hvstage" data-shade="dots" role="img" aria-label="Holiday illustration">{svg}'+more()+'</div>'

def _P_(): return _P
_P=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'illus3.json')))
SCENE_KEYS=[o['n'] for o in _P]
def scenes():
    E=_E; N={s['n']:s for s in _N['scenes']}; mom={s['k']:s for s in E['scenes']}
    kb='fill:color-mix(in srgb,var(--ink) 10%,var(--bg))'
    def isl(m):
        return (f'<g transform="translate(168 229) scale(.8) translate(-168 -229)"><path style="fill:var(--muted);fill-opacity:.22" d="{m["cloud"]}"/><path style="fill:#F8D66D;fill-opacity:.85" d="{m["sun"]}"/><path style="fill:var(--bg)" d="{m.get('cut','')}"/>'
                f'<path fill-rule="evenodd" style="{kb}" d="{E["palms"]}"/><path fill-rule="evenodd" fill="url(#hvp-dots)" d="{E["palms"]}"/>'
                f'<path fill-rule="evenodd" style="{kb}" d="{m["ink"]}"/><path fill-rule="evenodd" fill="url(#hvp-dots)" d="{m["ink"]}"/></g>'
                f'<path fill-rule="evenodd" style="{kb}" d="{E["ground"]}"/><path fill-rule="evenodd" fill="url(#hvp-dots)" d="{E["ground"]}"/>')
    def nn(s):
        return (f'<path fill-rule="evenodd" style="fill:var(--muted);fill-opacity:.22" d="{s["mid"]}"/><path fill-rule="evenodd" style="fill:#F8D66D;fill-opacity:.85" d="{s["sun"]}"/>'
                f'<path fill-rule="evenodd" style="{kb}" d="{s["ink"]}"/><path fill-rule="evenodd" fill="url(#hvp-dots)" d="{s["ink"]}"/>')
    order=[isl(mom['6258']),isl(mom['cea3']),nn(N['mountain hiker']),nn(N['trek couple']),nn(N['hammock']),nn(N['road trip']),nn(N['kayak']),nn(N['trek couple']),nn(N['trek couple'])]
    sy=''.join(f'<symbol id="sc-{i}" viewBox="0 0 337 346" preserveAspectRatio="xMinYMax meet">{c}</symbol>' for i,c in enumerate(order))
    return f'<svg class="hvdefs" width="0" height="0" aria-hidden="true" focusable="false">{sy}</svg>'

_N=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'illus4.json')))
def more():
    W,H=_N['w'],_N['h']
    return ''.join(f'<svg class="hvpl" viewBox="0 0 {W} {H}" aria-hidden="true"><path class="hvc" d="{s["mid"]}"/><path class="hvs" d="{s["sun"]}"/><path class="hvkb" d="{s["ink"]}"/><path class="hvk" d="{s["ink"]}"/></svg>' for s in _N['scenes'] if s['n']!='viewpoint')

def esyms():
    W,H=_N['w'],_N['h']; o=''
    for i,s in enumerate(_N['scenes']):
        o+=(f'<symbol id="es-{i}" viewBox="0 0 {W} {H}"><path fill-rule="evenodd" style="fill:var(--muted);fill-opacity:.22" d="{s["mid"]}"/>'
            f'<path fill-rule="evenodd" style="fill:#F8D66D;fill-opacity:.85" d="{s["sun"]}"/>'
            f'<path fill-rule="evenodd" style="fill:color-mix(in srgb,var(--ink) 10%,var(--bg))" d="{s["ink"]}"/>'
            f'<path fill-rule="evenodd" fill="url(#esdots)" d="{s["ink"]}"/></symbol>')
    return (f'<svg class="hvdefs" width="0" height="0" aria-hidden="true"><defs><pattern id="esdots" width="4" height="4" patternUnits="userSpaceOnUse">'
            f'<circle cx="2" cy="2" r="1.15" style="fill:var(--ink);fill-opacity:.55"/></pattern></defs>{o}</svg>')

_M=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'illus5.json')))
def emptysyms():
    o=''
    for k,s in _M['scenes'].items():
        kb='fill:color-mix(in srgb,var(--ink) 10%,var(--bg))'
        import re as _re
        sc=float(_re.search(r'scale\(([\d.]+)\)',s["tf"]).group(1)); pw=4/sc; pr=1.15/sc
        o+=(f'<symbol id="em-{k}" viewBox="0 0 337 346"><defs><pattern id="esd-{k}" width="{pw:.3f}" height="{pw:.3f}" patternUnits="userSpaceOnUse"><circle cx="{pw/2:.3f}" cy="{pw/2:.3f}" r="{pr:.3f}" style="fill:var(--ink);fill-opacity:.55"/></pattern></defs><path style="fill:var(--muted);fill-opacity:.22" d="{s["cl"]}"/><path style="fill:#F8D66D;fill-opacity:.85" d="{s["sky"]}"/>'
            f'<path fill-rule="evenodd" style="{kb}" d="{_M["bases_home"]}"/><path fill-rule="evenodd" fill="url(#esdots)" d="{_M["bases_home"]}"/>'
            f'<g transform="{s["tf"]}"><path style="fill:#F8D66D;fill-opacity:.85" d="{s["sun"]}"/><path fill-rule="evenodd" style="{kb}" d="{s["ink"]}"/><path fill-rule="evenodd" fill="url(#esd-{k})" d="{s["ink"]}"/></g></symbol>')
    return f'<svg class="hvdefs" width="0" height="0" aria-hidden="true">{o}</svg>'
