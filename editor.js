const canvas = new fabric.Canvas('canvas');

document.getElementById("bg").oninput=function(){
canvas.setBackgroundColor(this.value,canvas.renderAll.bind(canvas));
};

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

if(obj && obj.type==="textbox"){

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

obj.set("fontFamily",font);
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
