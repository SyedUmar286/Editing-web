// ----- TAB SWITCH -----
function showTab(tab){
  document.querySelectorAll('.editor-tab').forEach(t => t.style.display='none');
  document.getElementById(tab).style.display='block';
}

// ----- IMAGE EDITOR -----
const imgCanvas = new fabric.Canvas('imgCanvas');

document.getElementById('imgUpload').addEventListener('change', function(e){
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(f){
    fabric.Image.fromURL(f.target.result, function(img){
      imgCanvas.clear();
      imgCanvas.add(img);
      img.scaleToWidth(800);
    });
  };
  reader.readAsDataURL(file);
});

function addText(){
  const text = new fabric.Textbox('Hello', { left:100, top:100, fill:'red', fontSize:30 });
  imgCanvas.add(text);
}

function rotateImage(){
  const objs = imgCanvas.getObjects('image');
  if(objs.length>0){
    objs[0].rotate((objs[0].angle + 90) % 360);
    imgCanvas.renderAll();
  }
}

function applyFilter(){
  const objs = imgCanvas.getObjects('image');
  if(objs.length>0){
    objs[0].filters.push(new fabric.Image.filters.Grayscale());
    objs[0].applyFilters();
    imgCanvas.renderAll();
  }
}

function downloadImage(){
  const link = document.createElement('a');
  link.href = imgCanvas.toDataURL({format:'png'});
  link.download = 'edited-image.png';
  link.click();
}

// ----- VIDEO EDITOR -----
let videoPlayer = videojs('videoPlayer');

document.getElementById('videoUpload').addEventListener('change', function(e){
  const file = URL.createObjectURL(e.target.files[0]);
  videoPlayer.src({ type: 'video/mp4', src: file });
  videoPlayer.load();
});

function trimVideo(){
  alert("Trimming feature requires server-side ffmpeg or advanced JS. Placeholder for demo.");
}

function addTextToVideo(){
  alert("Adding text overlay to video requires canvas + ffmpeg. Placeholder for demo.");
}

// ----- AUDIO EDITOR -----
let wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#4a90e2',
  progressColor: '#f50',
  height:100
});

document.getElementById('audioUpload').addEventListener('change', function(e){
  const file = e.target.files[0];
  wavesurfer.load(URL.createObjectURL(file));
});

function playAudio(){ wavesurfer.play(); }
function stopAudio(){ wavesurfer.stop(); }
function downloadAudio(){
  alert("Downloading edited audio requires server-side processing. Placeholder for demo.");
}
