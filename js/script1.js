var tyspeed = 80;
var mute = false;

output = 'hello';

var audiobtn = document.getElementById('audiobtn');
audiobtn.setAttribute("onclick", 'audioonoff()');
var settings = document.getElementById('settings');
var settingsbtn = document.getElementById('settingsbtn');
settingsbtn.setAttribute("onclick", 'settingsonoff()');

var synth = window.speechSynthesis;
var voiceSelect = document.querySelector('select');
var voices = [];
var pitch = document.querySelector('#pitch');
var rate = document.querySelector('#rate');


// audio on/off
function audioonoff() {
  audiobtn.classList.toggle('on');
  if (audiobtn.classList != "on") {
      mute=true;
      spk('off');
     } else {
      mute=false;
      if (!mute) {spk('audio');}
  }
}

// settings on/off
function settingsonoff() {
  settingsbtn.classList.toggle('on');
  if (settingsbtn.classList != "on") {
      settings.classList = 'off';
      if (!mute) {spk('off');}
     } else {
      settings.classList = 'on';
      if (!mute) {spk('settings');}
  }
}


// starting text
  typereset();
  setTimeout(function() {typeWriter();}, 800);


// reset title
function typereset() {
  document.getElementById("output").innerHTML = '';
  k = 0;
}


// type writer effect
function typeWriter() {
  if (k < output.length) {
    document.getElementById("output").innerHTML += output.charAt(k);
    k++;
    setTimeout(typeWriter, tyspeed);
  }
}



// bot input
// field regex cleanup
var txtregex = /[^a-z 0-9 ?@!.,+*]/gi;
var textfield = document.getElementById('message');

function cleanbf(){
  if(textfield.value.search(txtregex) > -1) {
    textfield.value = textfield.value.replace(txtregex, "");
  }
}


// bot output
function sendMessage() {
    try {
      var text  = document.getElementById("message").value; 
    if (!mute) {spk(text);}
  output = '';
  output = text;
  typereset();
  setTimeout(function() { typeWriter(); }, 100);

} catch (e) {
  alert("Something went horribly wrong:\n" + e);
}
};


// speak text
function spk(text) {
  var utterThis = new SpeechSynthesisUtterance(text);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.pitch = pitch.value*(text.length * 0.3);
  utterThis.rate = rate.value;
  synth.speak(utterThis);
}

// wait for voices to be loaded before fetching list
window.speechSynthesis.onvoiceschanged = function() {
    var xvoices = window.speechSynthesis.getVoices();
};


// get voices
function populateVoiceList() {
  voices = synth.getVoices();

  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

