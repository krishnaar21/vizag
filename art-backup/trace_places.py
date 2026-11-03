import cv2, numpy as np, json
im=cv2.imread('/mnt/user-data/attachments/83b50684-6ec3-5d9d-8d04-1995ea2ef8bb/d09d1f08-image.png')
H,W=im.shape[:2]; print(W,H)
def chaikin(pts,it=2):
    for _ in range(it):
        n=len(pts); q=[]
        for i in range(n):
            p0=pts[i]; p1=pts[(i+1)%n]; q.append(0.75*p0+0.25*p1); q.append(0.25*p0+0.75*p1)
        pts=np.array(q)
    return pts
def paths(mask,S=2,minA=20):
    m=cv2.resize(mask*255,(mask.shape[1]*S,mask.shape[0]*S),interpolation=cv2.INTER_CUBIC); m=cv2.GaussianBlur(m,(5,5),0); m=(m>127).astype(np.uint8)*255
    cs,h=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE); d=''
    for c in cs:
        if cv2.contourArea(c)<minA*S*S: continue
        a=cv2.approxPolyDP(c,0.7*S,True).reshape(-1,2).astype(float)
        if len(a)<3: continue
        a=chaikin(a,2)/S; d+='M'+' '.join(f'{x:.1f} {y:.1f}' for x,y in a)+'Z'
    return d
names=['beach couple','beach friends','mountain hiker','trek couple','hammock','road trip','kayak','viewpoint','cave waterfall']
out=[]
cw,ch=W/3,H/3
for r in range(3):
    for c in range(3):
        cell=im[int(r*ch):int((r+1)*ch), int(c*cw):int((c+1)*cw)]
        hsv=cv2.cvtColor(cell,cv2.COLOR_BGR2HSV); h=hsv[:,:,0].astype(int); s=hsv[:,:,1].astype(int); v=hsv[:,:,2].astype(int)
        bg=(v>232)&(s<30)
        sun=(h>=8)&(h<=32)&(s>70)&(v>150)
        dark=(v<128)&(~sun)
        mid=(~bg)&(~sun)&(~dark)
        k=np.ones((3,3),np.uint8)
        sm=sun.astype(np.uint8); n_,lab,st,cen=cv2.connectedComponentsWithStats(sm); keep=np.zeros_like(sm)
        for i in range(1,n_):
            if cen[i][1]<0.62*sm.shape[0] and st[i,4]>40 and names[len(out)]!='cave waterfall': keep[lab==i]=1
        mid=mid|((sm>0)&(keep==0)); sun=keep>0
        masks=[cv2.morphologyEx(x.astype(np.uint8),cv2.MORPH_OPEN,k) for x in (dark,mid,sun)]
        ys,xs=np.where(~bg); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
        masks=[m[y0:y1+1,x0:x1+1] for m in masks]
        out.append({'n':names[len(out)],'w':int(x1-x0+1),'h':int(y1-y0+1),'ink':paths(masks[0]),'mid':paths(masks[1],minA=30),'sun':paths(masks[2])})
json.dump(out,open('/home/claude/illus3.json','w'))
css=":root{--ink:#141416;--bg:#efeff2;--muted:#666}.hs-inkf{fill:var(--ink)} path{fill-rule:evenodd}.m{fill:var(--muted);fill-opacity:.2}.s{fill:#F8D66D;fill-opacity:.85}.kb{fill:color-mix(in srgb,var(--ink) 10%,var(--bg))}.k{fill:url(#d)} svg.c{width:240px;height:170px;margin:6px}"
defs='<svg width="0" height="0"><defs><pattern id="d" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.15" fill="#141416" fill-opacity=".55"/></pattern></defs></svg>'
svgs=''.join(f'<svg class="c" viewBox="0 0 {o["w"]} {o["h"]}"><path class="m" d="{o["mid"]}"/><path class="s" d="{o["sun"]}"/><path class="kb" d="{o["ink"]}"/><path class="k" d="{o["ink"]}"/></svg>' for o in out)
open('p.html','w').write('<html><body style="background:#efeff2;margin:0;width:780px;display:flex;flex-wrap:wrap">'+defs+svgs+'<style>'+css+'</style></body></html>')
print([len(o['ink'])//1000 for o in out])
