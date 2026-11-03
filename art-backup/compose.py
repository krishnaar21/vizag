import cv2, numpy as np, json
import os; os.chdir('/tmp/claude-0/trace'); exec(open('comp3.py').read().split('def masks')[0]); os.chdir('/tmp/claude-0/trace2')  # chaikin, paths, load, files
base=np.load('base.npy'); H,W=base.shape
ys=np.arange(H)[:,None]
isl=(base&(ys>=226)).astype(np.uint8); waves=(base&(ys>=252)).astype(np.uint8); palms=(base&(ys<226)).astype(np.uint8)
SC=[('mountain hiker','hiker',(20,45,410,282),372,252,None),('trek couple','trek',(75,55,492,296),372,252,None),
    ('hammock','hammock',(50,30,452,284),262,247,isl),('road trip','van',(10,50,440,268),268,241,isl),
    ('kayak','kayak',(73,38,493,222),310,252,waves),('viewpoint','view',(36,28,476,290),290,252,None)]
rng=np.random.default_rng(7)
yy0,xx0=np.mgrid[0:H,0:W]
top=250+np.round(3*np.sin(np.arange(W)/7.0)+2*rng.standard_normal(W).cumsum()/12).astype(int)
ROCK=((((xx0-167)**2+(yy0-195)**2)<=148**2)&(yy0>=top[None,:])).astype(np.uint8)
cr=np.zeros((H,W),np.uint8)
for y0 in (272,294,316):   # jagged strata cracks
    x=20; pts=[]
    while x<320:
        pts.append((x,int(y0+rng.integers(-5,6)))); x+=int(rng.integers(14,30))
    cv2.polylines(cr,[np.array(pts,np.int32)],False,1,2)
for i in range(14):        # short vertical fractures between strata
    x=int(rng.integers(40,300)); y=int(rng.choice([258,280,302])); cv2.line(cr,(x,y),(x+int(rng.integers(-4,5)),y+int(rng.integers(8,16))),1,2)
ROCK[cr>0]=0
np.save('rock.npy',ROCK)
out=[]; prev=[]
for name,cell,(x0,y0,x1,y1),tw,bot,b in SC:
    L=np.load(cell+'.npy')[:,y0:y1,x0:x1]
    s=tw/(x1-x0); nw=int(round((x1-x0)*s)); nh=int(round((y1-y0)*s))
    lay=[cv2.resize(l.astype(np.float32),(nw,nh),interpolation=cv2.INTER_AREA) for l in L]
    if name=='road trip':
        sand=lay[2].copy(); sand[:int(nh*0.8),:]=0; lay[2][int(nh*0.8):,:]=0; lay[1]=np.maximum(lay[1],sand)
    canv=[np.zeros((H,W),np.float32) for _ in range(3)]
    ox=(W-nw)//2; oy=bot-nh
    for c,l in zip(canv,lay):
        yA=max(0,oy); yB=min(H,oy+nh); xA=max(0,ox); xB=min(W,ox+nw)
        c[yA:yB,xA:xB]=l[yA-oy:yB-oy,xA-ox:xB-ox]
    dark,mid,sun=[(c>0.5).astype(np.uint8) for c in canv]
    if b is None:
        yy,xx=np.mgrid[0:H,0:W]
        CX,CY,RR=183,182,150
        R=lambda r:((((xx-CX)**2+(yy-CY)**2)<=r**2)).astype(np.uint8)
        # shift artwork so it centres on the island's centre line
        sh=np.float32([[1,0,CX-168],[0,1,0]])
        dark,mid,sun=[(cv2.warpAffine(m.astype(np.float32),sh,(W,H))>0.5).astype(np.uint8) for m in (dark,mid,sun)]
        # people and trees: keep only pieces that sit wholly inside the island width / circle
        keepd=np.zeros_like(dark)
        n_,lab,st,_=cv2.connectedComponentsWithStats((dark&(yy<232)).astype(np.uint8))
        for k in range(1,n_):
            x,y,w,h,a=st[k]; comp=(lab==k)
            if a>15 and x>=58 and x+w<=308 and (comp&(R(RR-8)==0)).sum()==0: keepd[comp]=1
            elif a>1500: keepd[comp&(R(RR-8)>0)&(xx>=58)&(xx<=308)]=1
        dark=keepd
        mid=np.zeros((H,W),np.uint8)
        far=np.array([[80,232],[118,200],[140,214],[176,176],[214,208],[244,186],[276,214],[296,232]],np.int32)
        near=np.array([[68,234],[100,216],[132,228],[164,210],[220,232],[258,214],[288,228],[302,234]],np.int32)
        cv2.fillPoly(mid,[far],1); cv2.fillPoly(mid,[near],1)
        for cx,cy,k in ((104,132,.9),(250,150,.75)):
            for dx,dy,r in ((0,0,9),(12,-5,11),(25,0,8)): cv2.circle(mid,(int(cx+dx*k),int(cy+dy*k)),int(r*k),1,-1)
            cv2.rectangle(mid,(int(cx-9*k),int(cy-1*k)),(int(cx+34*k),int(cy+9*k)),1,-1)
        SUNC={'mountain hiker':(176,104,42),'trek couple':(196,100,42),'viewpoint':(196,110,40)}[name]
        sun=np.zeros((H,W),np.uint8); cv2.circle(sun,(SUNC[0],SUNC[1]),SUNC[2],1,-1); sun[mid>0]=0
        # ground: same island slab and same row widths as the wave scenes, as rough rock ledges
        g=np.load('base.npy').copy(); g[:226]=0
        n2,l2,s2,_=cv2.connectedComponentsWithStats(g); rock=np.zeros((H,W),np.uint8); rng2=np.random.default_rng(11)
        for k in range(1,n2):
            x,y,w,h,a=s2[k]
            if a<200: continue
            if y<240: rock|=(l2==k).astype(np.uint8); continue
            t=y+2; bt=y+h-2; tops=t+np.round(rng2.normal(0,1.1,W)).astype(int)
            band=((yy>=tops[None,:])&(yy<bt)&(xx>=x+6)&(xx<=x+w-6)).astype(np.uint8)
            cv2.ellipse(band,(int(x+7),int((t+bt)/2)),(7,int((bt-t)/2)),0,0,360,1,-1); cv2.ellipse(band,(int(x+w-7),int((t+bt)/2)),(7,int((bt-t)/2)),0,0,360,1,-1)
            rock|=band
        mid[rock>0]=0; mid[yy>=232]=0
        dark=(dark|rock).astype(np.uint8)
    ink=((dark|(b if b is not None else 0))>0).astype(np.uint8)
    mid=(mid&(1-ink)).astype(np.uint8)
    out.append({'n':name,'ink':paths(ink,minA=6),'mid':paths(mid,minA=20),'sun':paths(sun,minA=10)})
    v=np.full((H,W,3),239,np.uint8); v[mid>0]=(205,205,205); v[sun>0]=(110,214,248); v[ink>0]=(120,120,120); prev.append(v)
json.dump({'w':W,'h':H,'scenes':out},open('/home/claude/illus4.json','w'))
cv2.imwrite('comp.png',np.hstack(prev)); print('ok')
