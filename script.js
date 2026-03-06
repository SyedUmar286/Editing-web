// Initialize Fabric.js canvas
const canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true });
let isDrawing = false;
let undoStack = [], redoStack = [];

// ----- IMAGE UPLOAD -----
document.getElementById('uploadImage').addEventListener('change', function(e){
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(f){
    fabric.Image.fromURL(f.target.result, function(img){
      img.set({ left: 100, top: 50, selectable:true });
      canvas.add(img);
      canvas.setActiveObject(img);
      saveState();
    });
  };
  reader.readAsDataURL(file);
});

// ----- TEXT -----
function addText(){
  const text = new fabric.Textbox('Sample Text', { left:150, top:100, fill:'red', fontSize:30 });
  canvas.add(text);
  canvas.setActiveObject(text);
  saveState();
}

// ----- DRAWING -----
function draw(){
  isDrawing = !isDrawing;
  canvas.isDrawingMode = isDrawing;
  canvas.freeDrawingBrush.color = "blue";
  canvas.freeDrawingBrush.width = 5;
}

// ----- ERASER -----
function erase(){
  isDrawing = true;
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = "#fff";
  canvas.freeDrawingBrush.width = 20;
}

// ----- STICKER -----
function addSticker(){
  const url = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; // example sticker
  fabric.Image.fromURL(url, function(img){
    img.set({ left:200, top:200, scaleX:0.5, scaleY:0.5 });
    canvas.add(img);
    canvas.setActiveObject(img);
    saveState();
  });
}

// ----- ROTATE & FLIP -----
function rotate(angle){
  const obj = canvas.getActiveObject();
  if(obj) { obj.rotate((obj.angle + angle) % 360); canvas.renderAll(); saveState(); }
}
function flip(dir){
  const obj = canvas.getActiveObject();
  if(obj){
    if(dir==='horizontal') obj.flipX = !obj.flipX;
    if(dir==='vertical') obj.flipY = !obj.flipY;
    canvas.renderAll(); saveState();
  }
}

// ----- ZOOM -----
function zoom(factor){
  canvas.setZoom(canvas.getZoom()*factor);
}

// ----- BRING / SEND -----
function bringForward(){ const obj = canvas.getActiveObject(); if(obj) obj.bringForward(); canvas.renderAll(); saveState(); }
function sendBackward(){ const obj = canvas.getActiveObject(); if(obj) obj.sendBackwards(); canvas.renderAll(); saveState(); }

// ----- BACKGROUND -----
function changeBG(){
  canvas.setBackgroundColor('#'+Math.floor(Math.random()*16777215).toString(16), canvas.renderAll.bind(canvas));
  saveState();
}

// ----- FILTERS -----
function applyFilter(type){
  const obj = canvas.getActiveObject();
  if(!obj || obj.type!=='image') return;
  switch(type){
    case 'grayscale': obj.filters.push(new fabric.Image.filters.Grayscale()); break;
    case 'sepia': obj.filters.push(new fabric.Image.filters.Sepia()); break;
    case 'invert': obj.filters.push(new fabric.Image.filters.Invert()); break;
    case 'brightness': obj.filters.push(new fabric.Image.filters.Brightness({brightness:0.3})); break;
    case 'contrast': obj.filters.push(new fabric.Image.filters.Contrast({contrast:0.5})); break;
    case 'saturation': obj.filters.push(new fabric.Image.filters.Saturation({saturation:0.5})); break;
    case 'blur': obj.filters.push(new fabric.Image.filters.Blur({blur:0.5})); break;
  }
  obj.applyFilters();
  canvas.renderAll();
  saveState();
}

// ----- UNDO / REDO -----
function saveState(){
  const json = canvas.toJSON();
  undoStack.push(json);
  if(undoStack.length>50) undoStack.shift();
}

function undo(){
  if(undoStack.length>1){
    redoStack.push(undoStack.pop());
    canvas.loadFromJSON(undoStack[undoStack.length-1], canvas.renderAll.bind(canvas));
  }
}
function redo(){
  if(redoStack.length>0){
    const state = redoStack.pop();
    undoStack.push(state);
    canvas.loadFromJSON(state, canvas.renderAll.bind(canvas));
  }
}

// ----- CROP / RESIZE -----
function crop(){
  const obj = canvas.getActiveObject();
  if(obj && obj.type==='image'){
    obj.set({ scaleX: 0.8*obj.scaleX, scaleY: 0.8*obj.scaleY });
    canvas.renderAll(); saveState();
  }
}
function resize(){
  const obj = canvas.getActiveObject();
  if(obj && obj.type==='image'){
    obj.scaleX = obj.scaleX*1.2;
    obj.scaleY = obj.scaleY*1.2;
    canvas.renderAll(); saveState();
  }
}

// ----- DOWNLOAD -----
function downloadImage(){
  const link = document.createElement('a');
  link.href = canvas.toDataURL({format:'png', quality:1});
  link.download = 'edited-image.png';
  link.click();
}
