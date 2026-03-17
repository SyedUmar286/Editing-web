const canvas = new fabric.Canvas('canvas');

canvas.setWidth(1920); // YouTube Video Width
canvas.setHeight(1080); // YouTube Video Height


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

function toggleDownloadMenu() {
    let menu = document.getElementById("downloadMenu");
    menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
}



document.getElementById("textColor").oninput=function(){

let obj = canvas.getActiveObject();

if(obj && obj.type==="textbox"){

obj.set("fill", this.value);

canvas.renderAll();

}

}

function deleteObject(){

let obj = canvas.getActiveObject();

if(obj){

canvas.remove(obj);

}

}

function bringFront() {
    let obj = canvas.getActiveObject();
    if (obj) {
        let index = canvas.getObjects().indexOf(obj);
        // Object ko ek index upar bhej do
        canvas.moveTo(obj, index + 1);
        canvas.renderAll();
    }
}

function sendBack() {
    let obj = canvas.getActiveObject();
    if (obj) {
        let index = canvas.getObjects().indexOf(obj);
        // Object ko ek index neeche bhej do (par 0 se neeche nahi)
        if (index > 0) {
            canvas.moveTo(obj, index - 1);
            canvas.renderAll();
        }
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

// 1. Jab kisi text pe click karein, toh dropdown apne aap sahi font dikhaye
canvas.on('selection:created', updateInputs);
canvas.on('selection:updated', updateInputs);

function updateInputs() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text")) {
        document.getElementById("fontFamily").value = obj.fontFamily || "Arial";
        document.getElementById("fontSize").value = obj.fontSize || 40;
        let colorInput = document.getElementById("textColor");
        if (obj.fill && obj.fill.charAt(0) === '#') {
            colorInput.value = obj.fill;
        }
    }
}

// 1. Text select karte hi dropdown auto update hoga
canvas.on('selection:created', updateInputs);
canvas.on('selection:updated', updateInputs);

function updateInputs() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text")) {
        if (obj.fontFamily) document.getElementById("fontFamily").value = obj.fontFamily;
        document.getElementById("fontSize").value = obj.fontSize || 40;
    }
}

// 2. Font style badalne ka function
function updateTextProperties() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text")) {
        let font = document.getElementById("fontFamily").value;
        let size = document.getElementById("fontSize").value;
        
        // Font load hone ka wait karein phir apply karein
        document.fonts.load(`10px "${font}"`).then(function() {
            obj.set({ 
                fontFamily: font, 
                fontSize: parseInt(size) || obj.fontSize 
            });
            canvas.requestRenderAll();
            saveHistory();
        });
    }
}

// 3. Events: Bina button dabaye kaam karne ke liye
document.getElementById("fontFamily").onchange = updateTextProperties;
document.getElementById("fontSize").oninput = updateTextProperties;

// Text Color Fix (Sabhi text types ke liye)
document.getElementById("textColor").oninput = function() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text")) {
        obj.set("fill", this.value);
        canvas.requestRenderAll();
    }
};

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

function addOutline() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text")) {
        // Picker aur Width input se value uthayein
        let color = document.getElementById("outlineColor").value;
        let width = parseInt(document.getElementById("outlineWidth").value) || 2;

        // Agar outline pehle se hai to band karein (Toggle), warna naye settings lagayein
        if (obj.strokeWidth > 0) {
            obj.set({
                stroke: null,
                strokeWidth: 0
            });
        } else {
            obj.set({
                stroke: color,
                strokeWidth: width,
                paintFirst: 'stroke', // Isse outline bahar ki taraf dikhti hai
                strokeLineCap: 'round',
                strokeLineJoin: 'round'
            });
        }
        canvas.requestRenderAll();
        saveHistory();
    }
}

// Live color change ke liye (Jab picker ghumayein to foran change ho)
document.getElementById("outlineColor").oninput = function() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text") && obj.strokeWidth > 0) {
        obj.set("stroke", this.value);
        canvas.requestRenderAll();
    }
};

// Live width change ke liye
document.getElementById("outlineWidth").oninput = function() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text") && obj.strokeWidth > 0) {
        obj.set("strokeWidth", parseInt(this.value) || 0);
        canvas.requestRenderAll();
    }
};

function addShadow(){

let obj = canvas.getActiveObject();

if(obj){

obj.set("shadow","5px 5px 10px rgba(0,0,0,0.5)");
canvas.renderAll();

}

}

function toggleMixMenu() {
    let menu = document.getElementById("mixMenu");
    let btn = document.getElementById("mixBtn");

    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
        setTimeout(() => {
            menu.style.opacity = "1";
            menu.style.transform = "translateX(-50%) translateY(0)";
        }, 10);
    } else {
        menu.style.opacity = "0";
        menu.style.transform = "translateX(-50%) translateY(-10px)";
        setTimeout(() => {
            menu.style.display = "none";
        }, 300);
    }
}


// 2. Powerful Gradient Logic (1 se 5 colors mix karne ke liye)
function addGradient() {
    let obj = canvas.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "text")) {
        
        // Saare pickers se colors uthana
        let colors = [
            document.getElementById("clr1").value,
            document.getElementById("clr2").value,
            document.getElementById("clr3").value,
            document.getElementById("clr4").value,
            document.getElementById("clr5").value
        ];

        // Logic: Agar user ne koi color change nahi kiya to bhi wo mix karega
        let colorStops = [];
        let totalColors = colors.length;

        colors.forEach((clr, index) => {
            colorStops.push({
                offset: index / (totalColors - 1),
                color: clr
            });
        });

        obj.set("fill", new fabric.Gradient({
            type: "linear",
            coords: {
                x1: 0,
                y1: 0,
                x2: obj.width, // Left to Right Mixing
                y2: 0
            },
            colorStops: colorStops
        }));

        canvas.renderAll();
        saveHistory();
        
        // Apply karne ke baad menu band kar do
        toggleMixMenu();
    } else {
        alert("Bhai, pehle kisi text ko select toh karo!");
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
