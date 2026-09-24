const canvas = document.getElementById("characterCanvas");
const ctx = canvas.getContext("2d", { alpha: true });
const hero = document.getElementById("hero");
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");

const FRAME_COUNT = 64;
const FRAME_PATH = i => `public/frames/frame-${String(i).padStart(3,"0")}.webp`;
const CENTER_PATH = "public/center.webp";

let frames = [];
let centerFrame = null;
let loaded = 0;
let targetAngle = -Math.PI / 2;
let currentAngle = targetAngle;
let currentFrame = 0;
let mouseX = innerWidth * .5;
let mouseY = innerHeight * .5;
let raf;

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
addEventListener("resize", resize);
resize();

function loadImage(src) {
  return new Promise((resolve,reject) => {
    const img = new Image();
    img.onload = () => { loaded++; resolve(img); };
    img.onerror = reject;
    img.src = src;
  });
}

async function preload() {
  frames = await Promise.all(
    Array.from({length: FRAME_COUNT}, (_, i) => loadImage(FRAME_PATH(i)))
  );
  centerFrame = await loadImage(CENTER_PATH);
  requestAnimationFrame(render);
}

function lerpAngle(a,b,t) {
  const diff = Math.atan2(Math.sin(b-a), Math.cos(b-a));
  return a + diff * t;
}

function angleToFrame(angle) {
  // Our source video moves around the head in a circular sequence.
  // Adjust OFFSET if your generated video starts on a different direction.
  let normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const offset = Math.PI / 2;
  normalized = (normalized + offset) % (Math.PI * 2);
  return Math.round((normalized / (Math.PI * 2)) * (FRAME_COUNT - 1));
}

function drawCover(img) {
  const cw = innerWidth, ch = innerHeight;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const scale = Math.max(cw/iw, ch/ih);
  const w = iw * scale, h = ih * scale;
  const x = (cw-w)/2, y = (ch-h)/2;
  ctx.drawImage(img,x,y,w,h);
}

function render() {
  currentAngle = lerpAngle(currentAngle, targetAngle, .26);

  const faceX = innerWidth * .67;
  const faceY = innerHeight * .43;
  const dx = mouseX - faceX;
  const dy = mouseY - faceY;
  const distance = Math.hypot(dx,dy);
  const deadzone = Math.min(innerWidth,innerHeight) * .12;

  ctx.clearRect(0,0,innerWidth,innerHeight);

  if (centerFrame && distance < deadzone) {
    drawCover(centerFrame);
  } else if (frames.length) {
    currentFrame = angleToFrame(currentAngle);
    drawCover(frames[currentFrame]);
  }

  raf = requestAnimationFrame(render);
}

function pointerMove(x,y) {
  mouseX=x; mouseY=y;
  targetAngle = Math.atan2(y - innerHeight*.43, x - innerWidth*.67);
  dot.style.left = x+"px";
  dot.style.top = y+"px";
  ring.style.left = x+"px";
  ring.style.top = y+"px";
}

addEventListener("pointermove", e => pointerMove(e.clientX,e.clientY), {passive:true});

preload().catch(err => {
  console.error(err);
  document.body.insertAdjacentHTML("beforeend", '<div class="loading">NO SE PUDIERON CARGAR LOS FRAMES</div>');
});
