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
