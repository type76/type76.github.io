// global vars/settings
var tyspeed = 80;
var mute = false;
var audiobtn = document.getElementById('audiobtn');
audiobtn.setAttribute("onclick", 'audioonoff()');
var settings = document.getElementById('settings');
var settingsbtn = document.getElementById('settingsbtn');
settingsbtn.setAttribute("onclick", 'settingsonoff()');
var synth = window.speechSynthesis;
var voiceSelect = document.getElementById('voices');
var voices = [];
var pitch = document.querySelector('#pitch');
var rate = document.querySelector('#rate');
var botface = document.getElementById('botface');
var mouth = document.getElementById('botmouth');
var oldmouth = mouth.innerHTML;
var eyeL = document.getElementById('botLeye');
var eyeR = document.getElementById('botReye');
var oldeye = eyeL.innerHTML;

// cleanup regex
var txtregex = /[^a-z 0-9 ?@!.,+*]/gi;
var textfield = document.getElementById('message');

//picker
var j = document.getElementById('brightness');
var bgcol = document.getElementById('bgcolour');
var b = document.getElementById('picker');
var c = document.getElementById('col');
var a = c.getContext('2d');
document.body.clientWidth;

// set character in center
onWindowResize();
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  botface.style.left = (ww/2)-(botface.clientWidth/2)+'px';
  botface.style.top = (wh/2)-(botface.clientHeight/2)+'px';
// output.style.left = (ww/2)-(output.clientWidth)+'px';
}

// starting text on page load
output = 'hello';
textfield.focus();


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
    picker.classList = 'hidden';
    picker.setAttribute('aria-hidden', 'true');
    bgcol.classList = '';
  } else {
    settings.classList = 'on';
    if (!mute) {spk('settings')}
  }
}


// starting text
typereset();
setTimeout(function() {
// document.getElementById("output").style.width = 'auto';
typeWriter();}, 800);


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
function cleanbf(){
  if(textfield.value.search(txtregex) > -1) {
    textfield.value = textfield.value.replace(txtregex, "");
  }
}


// bot output
function sendMessage() {
  try {
    var text  = textfield.value; 
// check text is only a number
    var ifnum = !isNaN(parseFloat(text)) && isFinite(text);
    if (ifnum == true) { 
      text=num2str(text);
      if (!mute) { command(text); spk(text); botoutput(text);} 
      else {command(text); botoutput(text);}
      return;
    }
// check text includes a number, replace number with word
var numb = text.match(/\d+/g);
if (numb!=null) {
  numb = numb.join("");
  var xnumb=num2str(numb);
  numb = xnumb;
// replace??
var res = text.replace(numb, xnumb);
if (!mute) { mouthshape('. '+numb);}
}

if (!mute) { command(text); spk(text); botoutput(text);}
else {command(text);   botoutput(text);}
} catch (e) {
  alert("Something went horribly wrong:\n" + e);
}
};


// bot text command / output
function botoutput(text) {
output = '';
output = text;
typereset();
setTimeout(function() { typeWriter();
textfield.value = '';
 }, 100);
}

// speak text
function spk(text) {
  mouthshape(text);
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


// botspeak
// close console
function consoleClose() {
  console.log('close');
  esctoggle();
}


// lip sync 
function mouthshape(text) {
  for (var i = 0, len = text.length; i < len; i++) {
    setTimeout( (function( i ) {
      return function() {
        lipsync(text[i]);
      };
    }( i )), (80 * i) );
} //for


setTimeout(function() { document.getElementById('botmouth').innerHTML = oldmouth;
}, text.length*90);

// set class on start speaking
textfield.classList = 'speaking';
botface.classList = 'speaking';
// remove class on stop speaking
setTimeout(function() { 
  textfield.classList = '';
  botface.classList = '';
  // blink();
}, text.length*100);
}




function lipsync(arg) {
  if (arg == ' ' || arg == '.') { mouth.innerHTML = oldmouth;}
  if (arg == 'a') { mouth.innerHTML = 'D';}
  if (arg == 'b') { mouth.innerHTML = '|';}
  if (arg == 'c') { mouth.innerHTML = 'D';}
  if (arg == 'd') { mouth.innerHTML = '|';}
  if (arg == 'e') { mouth.innerHTML = 'D';}
  if (arg == 'f') { mouth.innerHTML = '|';}
  if (arg == 'g') { mouth.innerHTML = '|';}
  if (arg == 'h') { mouth.innerHTML = '|';}
  if (arg == 'i') { mouth.innerHTML = 'D';}
  if (arg == 'j') { mouth.innerHTML = 'I';}
  if (arg == 'k') { mouth.innerHTML = 'I';}
  if (arg == 'l') { mouth.innerHTML = 'P';}
  if (arg == 'm') { mouth.innerHTML = '(';}
  if (arg == 'n') { mouth.innerHTML = ')';}
  if (arg == 'o') { mouth.innerHTML = 'o';}
  if (arg == 'p') { mouth.innerHTML = '|';}
  if (arg == 'q') { mouth.innerHTML = 'D';}
  if (arg == 'r') { mouth.innerHTML = 'o';}
  if (arg == 's') { mouth.innerHTML = ')';}
  if (arg == 't') { mouth.innerHTML = '|';}
  if (arg == 'u') { mouth.innerHTML = 'o';}
  if (arg == 'v') { mouth.innerHTML = '/';}
  if (arg == 'w') { mouth.innerHTML = 'o';}
  if (arg == 'x') { mouth.innerHTML = 'x';}
  if (arg == 'y') { mouth.innerHTML = 'D';}
  if (arg == 'z') { mouth.innerHTML = '/';}

// console.log(arg)
}


// edit bot faces
function editface(ev) {
// console.log(ev.value)
if (ev.value=='cat') {
  botLeye.innerHTML = '^';
  botLeye.style.left = '20px';
  botReye.style.right = '20px';
  botReye.innerHTML = '^';
  botLside.innerHTML = '(=';
  botRside.innerHTML = '=)';
  oldeye = botLeye.innerHTML;
  return;
}

botLeye.innerHTML = ev.value;
botReye.innerHTML = ev.value;
oldeye = botLeye.innerHTML;
botLside.innerHTML = '(';
botRside.innerHTML = ')';
botLeye.style.left = '12px';
botReye.style.right = '12px';
}


// bot expressions
// blink
function blink() {
  eyeR.innerHTML = '-'; eyeL.innerHTML = '-';
  setTimeout(function () {
    eyeR.innerHTML = oldeye; eyeL.innerHTML = oldeye;
  }, 200);
}


//
// check if number
window.num2str = function (num) {
  return window.num2str.convert(num);
}

window.num2str.ones=['','one','two','three','four','five','six','seven','eight','nine'];
window.num2str.tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
window.num2str.teens=['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];


window.num2str.convert_millions = function(num) {
  if (num >= 1000000) {
    return this.convert_millions(Math.floor(num / 1000000)) + " million " + this.convert_thousands(num % 1000000);
  }
  else {
    return this.convert_thousands(num);
  }
}

window.num2str.convert_thousands = function(num) {
  if (num >= 1000) {
    return this.convert_hundreds(Math.floor(num / 1000)) + " thousand " + this.convert_hundreds(num % 1000);
  }
  else {
    return this.convert_hundreds(num);
  }
}

window.num2str.convert_hundreds = function(num) {
  if (num > 99) {
    return this.ones[Math.floor(num / 100)] + " hundred " + this.convert_tens(num % 100);
  }
  else {
    return this.convert_tens(num);
  }
}

window.num2str.convert_tens = function(num) {
  if (num < 10) return this.ones[num];
  else if (num >= 10 && num < 20) return this.teens[num - 10];
  else {
    return this.tens[Math.floor(num / 10)] + " " + this.ones[num % 10];
  }
}

window.num2str.convert = function(num) {
  if (num == 0) return "zero";
  else return this.convert_millions(num);
}


// commands
function command(argument) {
  if (argument=="blink") {blink();}

}

// bg colour
function setbgcol() {
  bgcol.classList.toggle('on');
  if (bgcol.classList != "on") {
    if (!mute) {spk('off');}
    picker.setAttribute('aria-hidden', 'true');
    picker.classList='hidden';

  } else {
    if (!mute) {spk('colour');}
    picker.setAttribute('aria-hidden', 'false');
    picker.classList='visible';  
  }
}





