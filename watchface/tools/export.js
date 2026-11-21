// Renders the Clockology layer PNGs from preview.html. Usage: node tools/export.js
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:1100}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+root+'/preview.html');
await p.evaluate(()=>document.fonts.load('700 30px Oxanium').catch(()=>{}));await p.waitForTimeout(800);
console.log('font loaded:',await p.evaluate(()=>document.fonts.check('700 30px Oxanium')));
const out=await p.evaluate(()=>{const F=window.__face,S=2,TAU=Math.PI*2,res={};
 const mk=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w*S;c.height=h*S;const g=c.getContext('2d');g.scale(S,S);fn(g);return c.toDataURL('image/png');};
 const full=fn=>mk(F.W,F.H,fn);
 const sq=(r,fn)=>{const d=Math.ceil(r)*2;return mk(d,d,g=>{g.translate(d/2,d/2);fn(g);});};
 for(const id of ['carbon','rose']){const T=F.TH[id],o={};
  o['01_base']=full(g=>{F.drawBase(g,T);g.translate(F.TB.x,F.TB.y);F.drawBed(g);});
  o['02_gear_barrel']=sq(48,g=>F.gear(g,0,0,46,64,0,T.gear3,6));
  o['03_gear_centre']=sq(32,g=>F.gear(g,0,0,30,48,0,T.gear,5));
  o['04_gear_third']=sq(29,g=>F.gear(g,0,0,27,42,0,T.gear2,5));
  o['05_gear_fourth']=sq(25,g=>F.gear(g,0,0,23,36,0,T.gear,4));
  o['06_balance']=sq(30,g=>F.drawBalance(g,T));
  o['07_cage']=sq(46,g=>F.drawCage(g,T,0));
  o['08_overlay']=full(g=>F.drawOver(g,T));
  o['09_hand_hour']=full(g=>F.hand(g,T,0,82,17));
  o['10_hand_minute']=full(g=>F.hand(g,T,0,124,13));
  o['11_hand_second']=full(g=>F.secHand(g,T,0));
  o['simple_background']=full(g=>{F.drawBase(g,T);g.save();F.drawTrain(g,T,0);F.drawTourb(g,T,0,0);g.restore();F.drawOver(g,T);});
  o['reference_1010']=full(g=>{F.drawBase(g,T);F.drawTrain(g,T,35);F.drawTourb(g,T,35,0);F.drawOver(g,T);
    F.hand(g,T,(10+10/60)/12*TAU,82,17);F.hand(g,T,10/60*TAU,124,13);F.secHand(g,T,35/60*TAU);});
  res[id]=o;}
 return res;});
for(const id in out){const d=path.join(root,'clockology',id);fs.mkdirSync(d,{recursive:true});
 for(const k in out[id])fs.writeFileSync(path.join(d,k+'.png'),Buffer.from(out[id][k].split(',')[1],'base64'));}
await b.close();})();
