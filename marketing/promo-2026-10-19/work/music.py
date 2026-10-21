import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
SR=48000; DUR=20.5; N=int(SR*DUR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(40)
def f(m): return 440*2**((m-69)/12)
def flt(x,kind,c,o=2): return sosfilt(butter(o,c,kind,fs=SR,output='sos'),x)
def add(s,t,g=1,pan=0):
    i=int(t*SR)
    if i>=N: return
    s=s[:N-i]; L[i:i+len(s)]+=s*g*np.sqrt((1-pan)/2); R[i:i+len(s)]+=s*g*np.sqrt((1+pan)/2)
def env(n,a,d):
    t=np.arange(n)/SR; return np.minimum(1,t/max(a,1e-4))*np.exp(-t/d)
def kick(g=1):
    n=int(.4*SR); t=np.arange(n)/SR; ph=2*np.pi*np.cumsum(45+140*np.exp(-t/.03))/SR
    return np.tanh(2*np.sin(ph)*np.exp(-t/.22))*g
def clap():
    n=int(.35*SR); x=flt(rng.standard_normal(n),'band',[900,6000]); e=np.zeros(n)
    for o in (0,.011,.022): k=int(o*SR); e[k:]+=env(n-k,.001,.06 if o<.02 else .14)
    return x*e
def hat(): n=int(.06*SR); return flt(rng.standard_normal(n),'high',7000)*env(n,.001,.015)
def boom(m=26,d=1.8):
    n=int(d*SR); t=np.arange(n)/SR; return np.tanh(1.6*np.sin(2*np.pi*f(m)*t*(1+.5*np.exp(-t/.05))))*np.exp(-t/(d/3))
def hit(m=50):
    n=int(1.2*SR); t=np.arange(n)/SR
    body=sum(np.sin(2*np.pi*f(m+k)*t)*a for k,a in [(0,1),(7,.5),(12,.6),(15,.3)])
    return np.tanh(1.5*body*np.exp(-t/.35))*.5 + flt(rng.standard_normal(n),'band',[2000,9000])*env(n,.001,.05)*.6
def whoosh(d,lo=300,hi=4000):
    n=int(d*SR); t=np.arange(n)/SR; return flt(flt(rng.standard_normal(n),'band',[lo,hi]),'low',5000)*np.sin(np.pi*t/d)**2
def saw_pad(ms,d):
    n=int(d*SR); t=np.arange(n)/SR; s=0
    for m in ms:
        for det in (-.07,.07): s=s+2*((t*f(m)*(1+det/100))%1)-1
    s=flt(s,'low',1400)/len(ms)/2; e=np.minimum(1,t/.15)*np.minimum(1,(d-t)/.3).clip(0,1); return s*e
CH=[[50,53,57,60],[46,50,53,57],[43,46,50,53],[45,49,52,55]]   # Dm Bb Gm A
BASS=[38,34,31,33]
# S1 hook hits on word slams + low boom
add(boom(26,2.6),0.0,.55)
for i,t in enumerate([.12,.37,.62]): add(hit(50+[0,3,7][i]),t,.32,pan=[-.3,0,.3][i])
add(whoosh(.5,500,5000),1.2,.18); add(saw_pad(CH[0],1.4),1.5,.10)
# groove from 2.9 to 16.6
bar0=2.9
for b in range(7):
    t0=bar0+b*2
    if t0>=16.6: break
    c=b%4
    add(saw_pad(CH[c],2.0),t0,.11,pan=0)
    for bt in range(4):
        tb=t0+bt*.5
        if tb>=16.6: break
        add(kick(),tb,.5)
        if bt in (1,3): add(clap(),tb,.22,pan=.1)
        for h in (0,.25): add(hat(),tb+h,.06 if h else .035,pan=.4)
        n=int(.45*SR); tt=np.arange(n)/SR; m=BASS[c]+(12 if bt==3 else 0)
        s=np.tanh(2.2*np.sin(2*np.pi*f(m)*tt))*env(n,.005,.25); add(flt(s,'low',700),tb,.26)
# S2 tap, S3 stamps, S4 counter ticks, S5 tap+flip, transitions
def tick(fr=2400):
    n=int(.04*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*fr*tt)*env(n,.001,.008)
add(tick(1800),4.0,.25); add(whoosh(.45),2.85,.14); add(whoosh(.4),5.95,.12)
for i in range(6): add(hit(50+[0,3,5,7,10,12][i]),6.5+i*.5,.22,pan=-.4+i*.16)
for k in range(16): add(tick(2000+k*60),10.8+k*.12,.08)
add(hit(62),12.7,.25); add(whoosh(.45),10.05,.12); add(whoosh(.4),13.35,.12)
add(tick(1800),14.4,.25); add(whoosh(.7,200,3000),15.1,.2)
# S6 final hit, drums out
add(boom(26,3.5),16.7,.6); add(hit(50),16.72,.4); add(saw_pad([38,50,53,57,62],3.6),16.7,.13)
add(hit(57),17.75,.18)
# room
def verb(x):
    y=np.zeros_like(x)
    for d,g in [(.029,.45),(.043,.4),(.067,.35),(.101,.3),(.157,.24),(.233,.18)]:
        k=int(d*SR); y[k:]+=x[:-k]*g
    return flt(y,'low',5000)
L2=L+verb(L)*.25; R2=R+verb(np.roll(R,150))*.25
st=np.stack([flt(L2,'high',28),flt(R2,'high',28)],1)
fo=int(.8*SR); st[-fo:]*=np.linspace(1,0,fo)[:,None]
st/=np.max(np.abs(st)); st=np.tanh(st*1.6)/np.tanh(1.6)*.89
wavfile.write('music_raw.wav',SR,(st*32767).astype(np.int16)); print('ok')
