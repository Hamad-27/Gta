import * as THREE from 'three';

// Original browser-game prototype inspired by Kerala hill-town roads.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ed7f2);
scene.fog = new THREE.Fog(0x9ed7f2, 100, 420);
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 900);
const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe0f5ff, 0x526b3b, 2.0));
const sun = new THREE.DirectionalLight(0xfff0d3, 3.1); sun.position.set(-80,130,45); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-150; sun.shadow.camera.right=150; sun.shadow.camera.top=150; sun.shadow.camera.bottom=-150; scene.add(sun);
const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
const grassMat=mat(0x4f8751), roadMat=mat(0x343b3d), lineMat=mat(0xe8d9a2), concreteMat=mat(0xaaa99d), white=mat(0xf2f0df), dark=mat(0x182127), leafMats=[mat(0x276b42),mat(0x3c8245),mat(0x5a9048)], trunkMat=mat(0x68462e);
const boxGeo=new THREE.BoxGeometry(1,1,1);
function box(w,h,d,material,x,y,z,parent=scene){const m=new THREE.Mesh(boxGeo,material);m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000),grassMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
// Distant green hills create a recognizable Kerala landscape silhouette.
for(let i=0;i<34;i++){const a=i/34*Math.PI*2;const r=270+(i%4)*18;const h=28+(i%7)*7;const hill=new THREE.Mesh(new THREE.ConeGeometry(34+(i%5)*9,h,7),mat(i%3===0?0x477d58:i%3===1?0x58885d:0x729466));hill.position.set(Math.cos(a)*r,h/2-2,Math.sin(a)*r);hill.scale.z=1.25;hill.rotation.y=a;scene.add(hill);}
// Town layout: cross roads and side lanes.
function road(w,d,x,z){box(w,.12,d,roadMat,x,.01,z);if(w>d){for(let p=-w/2+3;p<w/2-2;p+=7)box(2,.015,.13,lineMat,x+p,.079,z);}else{for(let p=-d/2+3;p<d/2-2;p+=7)box(.13,.015,2,lineMat,x,.079,z);}}
road(300,12,0,0);road(12,280,0,0);road(220,9,0,68);road(9,210,-72,0);road(9,180,72,0);road(170,8,0,-72);
// Sidewalks and storefronts, each with varied roof and awning.
const wallColors=[0xe5c69b,0xd8d9c7,0xd7a58a,0x9fc5bd,0xe9dfc7,0xb8c4d7,0xd6c58d];
function makeBuilding(x,z){const w=8+Math.random()*9,d=7+Math.random()*8,h=5+Math.random()*10;const wall=mat(wallColors[Math.floor(Math.random()*wallColors.length)]);box(w,h,d,wall,x,h/2,z);box(w+0.5,.45,d+0.5,mat([0x7c4235,0x35434a,0x8a6a3d,0x6b7a72][Math.floor(Math.random()*4)]),x,h+.18,z);const front=z>0?z-d/2-.04:z+d/2+.04;for(let wx=x-w/2+1.4;wx<x+w/2-1;wx+=2.8){box(1.15,1.5,.12,mat(0x3d6e7a),wx,Math.min(h-1.4,2.6),front);box(1.35,.12,.22,mat(0xf0e3cb),wx,Math.min(h-.55,4),front);}}
for(let x=-125;x<=125;x+=15){if(Math.abs(x)<17)continue;makeBuilding(x,14+Math.random()*5);makeBuilding(x,-14-Math.random()*5);}
for(let z=-115;z<=115;z+=17){if(Math.abs(z)<16)continue;makeBuilding(15+Math.random()*4,z);makeBuilding(-15-Math.random()*4,z);}
// Small roadside trees.
function tree(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22,.36,3,7),trunkMat);trunk.position.y=1.5;trunk.castShadow=true;g.add(trunk);for(let j=0;j<3;j++){const crown=new THREE.Mesh(new THREE.SphereGeometry(1.4-j*.15,8,7),leafMats[(j+Math.floor(Math.random()*3))%3]);crown.position.set((Math.random()-.5)*.5,2.9+j*.65,(Math.random()-.5)*.5);crown.scale.set(1.1,.85,1);crown.castShadow=true;g.add(crown);}scene.add(g);}
for(let i=0;i<100;i++){let x=(Math.random()-.5)*260,z=(Math.random()-.5)*260;if(Math.abs(x)<11||Math.abs(z)<11)continue;tree(x,z,.7+Math.random()*.8);}
// Signboard at town entrance.
box(1,.2,1,mat(0x555c55),-18,3.2,-24);box(13,2.2,.35,mat(0x174d43),-18,5,-24);box(12.6,1.8,.08,mat(0x246b58),-18,5,-23.78);
// Text canvas for readable landmark sign.
const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=128;const ctx=signCanvas.getContext('2d');ctx.fillStyle='#164b40';ctx.fillRect(0,0,512,128);ctx.fillStyle='#f3f6e9';ctx.font='bold 45px Arial';ctx.textAlign='center';ctx.fillText('THAMARASSERY',256,78);const signTex=new THREE.CanvasTexture(signCanvas);const sign=new THREE.Mesh(new THREE.PlaneGeometry(12.3,1.8),new THREE.MeshBasicMaterial({map:signTex}));sign.position.set(-18,5,-23.72);scene.add(sign);
// Character with simple body parts, kept as a group for third-person movement.
const player=new THREE.Group();scene.add(player);
const skin=mat(0xb98260), shirt=mat(0x222f32), pants=mat(0x344d72), shoes=mat(0x171b1e);
const torso=new THREE.Mesh(new THREE.BoxGeometry(.9,1.15,.42),shirt);torso.position.y=1.55;torso.castShadow=true;player.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.31,12,10),skin);head.position.y=2.38;head.castShadow=true;player.add(head);
const legL=box(.28,.8,.3,pants,-.23,.55,0,player),legR=box(.28,.8,.3,pants,.23,.55,0,player);const armL=box(.23,.82,.25,shirt,-.58,1.52,0,player),armR=box(.23,.82,.25,shirt,.58,1.52,0,player);box(.34,.15,.42,shoes,-.23,.13,.02,player);box(.34,.15,.42,shoes,.23,.13,.02,player);
// Drivable hatchback built from original geometric parts.
const car=new THREE.Group();scene.add(car);car.position.set(3,0,7);car.rotation.y=Math.PI;
box(2.1,.62,4.1,mat(0xc6322c),0,.72,0,car);box(1.62,.72,2.1,mat(0x9ec6d2,.25),0,1.32,-.12,car);box(1.75,.15,1.5,mat(0x9e2924),0,1.72,.65,car);
for(const x of [-1.08,1.08])for(const z of [-1.28,1.28]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.22,12),dark);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.42,z);wheel.castShadow=true;car.add(wheel);}
for(const x of [-.7,.7]){box(.38,.18,.08,mat(0xfff0c1),x,.78,-2.06,car);box(.4,.18,.08,mat(0xf04435),x,.78,2.06,car);}
// Mission checkpoint ring.
const checkpoint=new THREE.Group();scene.add(checkpoint);checkpoint.position.set(0,0,-90);const ring=new THREE.Mesh(new THREE.TorusGeometry(2.4,.22,10,28),new THREE.MeshStandardMaterial({color:0x58ffab,emissive:0x14aa6a,emissiveIntensity:2}));ring.position.y=2.5;checkpoint.add(ring);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.1,.6,4,12,1,true),new THREE.MeshBasicMaterial({color:0x42fca0,transparent:true,opacity:.22,side:THREE.DoubleSide}));beam.position.y=2;checkpoint.add(beam);
const keys=new Set();let inCar=false,carSpeed=0,heading=0,cameraYaw=0,cameraPitch=.23,run=false,brake=false,lookPointer=null,lookLastX=0,lookLastY=0,missionDone=false,clockSeconds=8*3600+30*60;
const message=document.querySelector('#message');let messageTimer;function say(t){message.textContent=t;message.style.opacity='1';clearTimeout(messageTimer);messageTimer=setTimeout(()=>message.style.opacity='.65',3500)}
function interact(){if(inCar){inCar=false;player.position.copy(car.position);player.position.x+=Math.sin(car.rotation.y)*2;player.position.z+=Math.cos(car.rotation.y)*2;player.visible=true;carSpeed=0;say('You left the car. Explore the town!');}else{const dist=player.position.distanceTo(car.position);if(dist<5){inCar=true;player.visible=false;say('Driving mode. WASD to drive, E to exit.');}else say('Move closer to the red car to enter it.');}}
function resetCar(){car.position.set(3,0,7);car.rotation.y=Math.PI;carSpeed=0;say('Car reset.');}
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys.add(k);if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(k==='e'&&!e.repeat)interact();if(k==='r'&&!e.repeat)resetCar();if(k==='shift')run=true;});window.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());if(e.key.toLowerCase()==='shift')run=false;});
// Mobile controls map touch buttons to the same key/action state.
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;const down=e=>{e.preventDefault();keys.add(k);};const up=e=>{e.preventDefault();keys.delete(k);};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up);});
document.querySelector('[data-action="interact"]').addEventListener('pointerdown',e=>{e.preventDefault();interact()});document.querySelector('[data-action="run"]').addEventListener('pointerdown',e=>{e.preventDefault();run=true});['pointerup','pointercancel','pointerleave'].forEach(ev=>document.querySelector('[data-action="run"]').addEventListener(ev,()=>run=false));document.querySelector('[data-action="brake"]').addEventListener('pointerdown',e=>{e.preventDefault();brake=true});['pointerup','pointercancel','pointerleave'].forEach(ev=>document.querySelector('[data-action="brake"]').addEventListener(ev,()=>brake=false));
// Drag to look. On desktop use right mouse button; on touch drag the open right half.
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==2)return;if(e.pointerType!=='mouse'&&e.clientX<innerWidth*.42)return;lookPointer=e.pointerId;lookLastX=e.clientX;lookLastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(lookPointer!==e.pointerId)return;cameraYaw-=(e.clientX-lookLastX)*.006;cameraPitch=THREE.MathUtils.clamp(cameraPitch+(e.clientY-lookLastY)*.003,-.08,.72);lookLastX=e.clientX;lookLastY=e.clientY;});renderer.domElement.addEventListener('pointerup',e=>{if(lookPointer===e.pointerId)lookPointer=null;});
function updatePlayer(dt){if(inCar){const forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0);const steer=(keys.has('a')||keys.has('arrowleft')?1:0)-(keys.has('d')||keys.has('arrowright')?1:0);carSpeed+=forward*dt*11;carSpeed*=Math.pow(brake||keys.has(' ')?0.06:0.986,dt*60);carSpeed=THREE.MathUtils.clamp(carSpeed,-7,23);car.rotation.y+=steer*dt*(.8+Math.abs(carSpeed)*.045)*Math.sign(carSpeed||1);car.position.x+=Math.sin(car.rotation.y)*carSpeed*dt;car.position.z+=Math.cos(car.rotation.y)*carSpeed*dt;car.position.x=THREE.MathUtils.clamp(car.position.x,-145,145);car.position.z=THREE.MathUtils.clamp(car.position.z,-140,140);player.position.copy(car.position);player.rotation.y=car.rotation.y;document.querySelector('#mode').textContent='DRIVING';document.querySelector('[data-action="interact"]').textContent='E · EXIT';}
else{const f=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0);const s=(keys.has('a')||keys.has('arrowleft')?1:0)-(keys.has('d')||keys.has('arrowright')?1:0);const moveSpeed=run?10:5.2;if(f||s){heading=Math.atan2(Math.sin(cameraYaw)*f+Math.cos(cameraYaw)*s,Math.cos(cameraYaw)*f-Math.sin(cameraYaw)*s);const dx=Math.sin(cameraYaw)*f+Math.cos(cameraYaw)*s;const dz=Math.cos(cameraYaw)*f-Math.sin(cameraYaw)*s;const len=Math.hypot(dx,dz)||1;player.position.x+=dx/len*moveSpeed*dt;player.position.z+=dz/len*moveSpeed*dt;player.rotation.y=heading;const swing=Math.sin(performance.now()*.012*(run?1.5:1))*.32;legL.rotation.x=swing;legR.rotation.x=-swing;armL.rotation.x=-swing;armR.rotation.x=swing;}player.position.x=THREE.MathUtils.clamp(player.position.x,-145,145);player.position.z=THREE.MathUtils.clamp(player.position.z,-140,140);document.querySelector('#mode').textContent=run?'RUNNING':'ON FOOT';document.querySelector('[data-action="interact"]').textContent='E · ENTER';}}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);updatePlayer(dt);clockSeconds=(clockSeconds+dt*20)%(24*3600);const hh=String(Math.floor(clockSeconds/3600)).padStart(2,'0'),mm=String(Math.floor(clockSeconds%3600/60)).padStart(2,'0');document.querySelector('#clock').textContent=hh+':'+mm;
const target=inCar?car.position:player.position;const dist=target.distanceTo(checkpoint.position);document.querySelector('#distance').textContent=missionDone?'MISSION COMPLETE':'CHECKPOINT: '+Math.round(dist)+' m';if(!missionDone&&dist<5){missionDone=true;document.querySelector('#missionText').textContent='Checkpoint reached! Free roam unlocked.';say('MISSION COMPLETE · You reached the checkpoint!');checkpoint.visible=false;}
ring.rotation.y+=dt*.7;beam.material.opacity=.15+Math.sin(performance.now()*.003)*.07;
const followDistance=inCar?9:7.5;const pitch=cameraPitch;const camX=target.x+Math.sin(cameraYaw)*Math.cos(pitch)*followDistance;const camZ=target.z+Math.cos(cameraYaw)*Math.cos(pitch)*followDistance;const camY=target.y+(inCar?3.2:2.8)+Math.sin(pitch)*followDistance;camera.position.lerp(new THREE.Vector3(camX,camY,camZ),1-Math.pow(.001,dt));camera.lookAt(target.x,target.y+(inCar?1.2:1.5),target.z);renderer.render(scene,camera);}
const clock=new THREE.Clock();window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
setTimeout(()=>{const l=document.querySelector('#loading');l.style.opacity='0';setTimeout(()=>l.remove(),750);},1000);animate();
