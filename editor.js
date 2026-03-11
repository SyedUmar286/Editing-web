const canvas = new fabric.Canvas('canvas');

canvas.setWidth(1080);
canvas.setHeight(1920);

let centerX = canvas.getWidth()/2;
let centerY = canvas.getHeight()/2;

let history = [];
let redoStack = [];

document.getElementById("bg").oninput=function(){
canvas.setBackgroundColor(this.value,canvas.renderAll.bind(canvas));
};

canvas.on("object:added", saveHistory);
canvas.on("object:modified", saveHistory);
canvas.on("object:removed", saveHistory);

function saveHistory(){
redoStack = [];
history.push(JSON.stringify(canvas));
}

document.getElementById("upload").addEventListener("change",function(e){

let reader=new FileReader();

reader.onload=function(f){

fabric.Image.fromURL(f.target.result,function(img){

img.set({
left:200,
top:200,
scaleX:0.5,
scaleY:0.5
});

canvas.add(img);

});

};

reader.readAsDataURL(e.target.files[0]);

});

function addText(){

let text=new fabric.Textbox("Guess the Word",{

left:100,
top:100,
fontSize:40,
fill:"black"

});

canvas.add(text);

}

function addEmoji(){

let emoji=new fabric.Text("😀",{

left:300,
top:200,
fontSize:80

});

canvas.add(emoji);

}

function addTimer(){

let timer=new fabric.Text("10",{

left:420,
top:40,
fontSize:80,
fill:"red"

});

canvas.add(timer);

let count=10;

let interval=setInterval(function(){

count--;

timer.text=count.toString();

canvas.renderAll();

if(count<=0){
clearInterval(interval);
}

},1000);

}

function download(){

let link=document.createElement("a");

link.href=canvas.toDataURL();

link.download="quiz.png";

link.click();

}

document.getElementById("textColor").oninput=function(){

let obj = canvas.getActiveObject();

if(obj && obj.type==="textbox"){

obj.set("fill", this.value);

canvas.renderAll();

}

}

function changeFont(){

let obj = canvas.getActiveObject();

let size = document.getElementById("fontSize").value;

if(obj){

obj.set("fontSize", size);

canvas.renderAll();

}

}

function deleteObject(){

let obj = canvas.getActiveObject();

if(obj){

canvas.remove(obj);

}

}

function bringFront(){

let obj = canvas.getActiveObject();

if(obj){

canvas.bringToFront(obj);

canvas.renderAll();

}

}

function sendBack(){

let obj = canvas.getActiveObject();

if(obj){

canvas.sendToBack(obj);

canvas.renderAll();

}

}

function duplicate(){

let obj = canvas.getActiveObject();

if(obj){

obj.clone(function(clone){

clone.set({
left: obj.left + 20,
top: obj.top + 20
});

canvas.add(clone);

});

}

}

function lockLayer(){

let obj = canvas.getActiveObject();

if(obj){

obj.selectable = false;
canvas.discardActiveObject();
canvas.renderAll();

}

}

function centerText(){

let obj = canvas.getActiveObject();

if(obj){

obj.center();

canvas.renderAll();

}

  }

function changeFontFamily(){

let obj = canvas.getActiveObject();
let font = document.getElementById("fontFamily").value;

if(obj){

obj.set({
fontFamily: font
});

canvas.renderAll();

}

}

function addEmojiPicker(){

let emoji = document.getElementById("emojiPicker").value;

let emojiText = new fabric.Text(emoji,{
left:200,
top:200,
fontSize:60
});

canvas.add(emojiText);
canvas.renderAll();

}

function addOutline(){

let obj = canvas.getActiveObject();

if(obj){

obj.set({
stroke:"black",
strokeWidth:2
});

canvas.renderAll();

}

}

function addShadow(){

let obj = canvas.getActiveObject();

if(obj){

obj.set("shadow","5px 5px 10px rgba(0,0,0,0.5)");
canvas.renderAll();

}

}

function addGradient(){

let obj = canvas.getActiveObject();

if(obj){

obj.set("fill", new fabric.Gradient({

type:"linear",
coords:{
x1:0,
y1:0,
x2:200,
y2:0
},

colorStops:[
{offset:0,color:"red"},
{offset:1,color:"yellow"}
]

}));

canvas.renderAll();

}

}

function undo(){

if(history.length > 0){

redoStack.push(JSON.stringify(canvas));

let state = history.pop();

canvas.loadFromJSON(state,function(){

canvas.renderAll();

});

}

}

function redo(){

if(redoStack.length > 0){

history.push(JSON.stringify(canvas));

let state = redoStack.pop();

canvas.loadFromJSON(state,function(){

canvas.renderAll();

});

}

}

document.addEventListener("keydown", function(e){

// DELETE KEY
if(e.key === "Delete"){

let obj = canvas.getActiveObject();
if(obj){
canvas.remove(obj);
canvas.renderAll();
}

}

// CTRL + D (duplicate)
if(e.ctrlKey && e.key === "d"){

e.preventDefault();

let obj = canvas.getActiveObject();

if(obj){

obj.clone(function(clone){

clone.set({
left: obj.left + 20,
top: obj.top + 20
});

canvas.add(clone);

});

}

}

// CTRL + Z (undo)
if(e.ctrlKey && e.key === "z"){

e.preventDefault();
undo();

}

});

canvas.on('object:moving', function(e){

let obj = e.target;

if(Math.abs(obj.left - centerX) < 10){
obj.left = centerX;
}

if(Math.abs(obj.top - centerY) < 10){
obj.top = centerY;
}

});

async function removeBackground(){

let obj = canvas.getActiveObject();

if(!obj || obj.type !== "image"){
alert("Select image first");
return;
}

let imgElement = obj._element;

const net = await bodyPix.load();

const segmentation = await net.segmentPerson(imgElement);

const canvasTemp = document.createElement("canvas");
canvasTemp.width = imgElement.width;
canvasTemp.height = imgElement.height;

const ctx = canvasTemp.getContext("2d");
ctx.drawImage(imgElement,0,0);

let imageData = ctx.getImageData(0,0,canvasTemp.width,canvasTemp.height);

for(let i=0;i<segmentation.data.length;i++){

if(segmentation.data[i] === 0){
imageData.data[i*4+3] = 0;
}

}

ctx.putImageData(imageData,0,0);

fabric.Image.fromURL(canvasTemp.toDataURL(),function(newImg){

newImg.set({
left: obj.left,
top: obj.top,
scaleX: obj.scaleX,
scaleY: obj.scaleY
});

canvas.remove(obj);
canvas.add(newImg);

});

}

async function removeBackgroundSmart() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') {
        alert("please image select!");
        return;
    }

    alert("AI background remove please wait...");
    
    // Image ka source nikalein
    const imgElement = activeObject._element;

    // AI Process shuru karein
    const blob = await imgRemoveBackground(imgElement);
    
    // Nayi image canvas par load karein
    const url = URL.createObjectURL(blob);
    fabric.Image.fromURL(url, function(newImg) {
        newImg.set({
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY
        });
        canvas.remove(activeObject);
        canvas.add(newImg);
        canvas.renderAll();
        alert("Done! Background is remove.");
    });
}

