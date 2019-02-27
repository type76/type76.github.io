// global consts/settings
const tyspeed = 80;
let mute = false;
const audiobtn = document.getElementById('audiobtn');
audiobtn.setAttribute("onclick", 'audioonoff()');
const settings = document.getElementById('settings');
const settingsbtn = document.getElementById('settingsbtn');
settingsbtn.setAttribute("onclick", 'settingsonoff()');
const synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voices');
const voices = [];
const pitch = document.querySelector('#pitch');
const rate = document.querySelector('#rate');

// create botface
document.body.onload = addFace;


function addFace () { 
  const xheader = document.getElementById('xheader');
  botface = document.createElement("div"); 
  botface.id = 'botface';
  botface.style.left = (window.innerWidth/2)-(botface.clientWidth/2)+'px';
  botface.style.top = (window.innerHeight/2)-(botface.clientHeight/2)+'px';

  const botLside = document.createElement("div");
  botLside.id = 'botLside';
  botLside.innerHTML = '(';
  botface.appendChild(botLside);  

  botLeye = document.createElement("div");
  botLeye.id = 'botLeye';
  botLeye.innerHTML = 'o';
  botface.appendChild(botLeye);  

  botmouth = document.createElement("div");
  botmouth.id = 'botmouth';
  botmouth.innerHTML = ')';
  botface.appendChild(botmouth);  

  botReye = document.createElement("div");
  botReye.id = 'botReye';
  botReye.innerHTML = 'o';
  botface.appendChild(botReye);  

  botRside = document.createElement("div");
  botRside.id = 'botRside';
  botRside.innerHTML = ')';
  botface.appendChild(botRside);  

  // add botface
  document.body.insertBefore(botface, xheader); 

  oldmouth = botmouth.innerHTML;
  oldeye = botLeye.innerHTML;
}// end addFace


// cleanup regex
const txtregex = /[^a-z 0-9 ?@!.,+*]/gi;
const textfield = document.getElementById('message');

//picker
const j = document.getElementById('brightness');
const bgcol = document.getElementById('bgcolour');
const b = document.getElementById('picker');
const c = document.getElementById('col');
const a = c.getContext('2d');
document.body.clientWidth;

// set character in center
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  botface.style.left = (ww/2)-(botface.clientWidth/2)+'px';
  botface.style.top = (wh/2)-(botface.clientHeight/2)+'px';
output.style.left = (ww/2)-(output.clientWidth)+'px';
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
    const text  = textfield.value; 
// check text is only a number
    const ifnum = !isNaN(parseFloat(text)) && isFinite(text);
    if (ifnum == true) { 
      text=num2str(text);
      if (!mute) { command(text); spk(text); botoutput(text);} 
      else {command(text); botoutput(text);}
      return;
    }
// check text includes a number, replace number with word
const numb = text.match(/\d+/g);
if (numb!=null) {
  numb = numb.join("");
  const xnumb=num2str(numb);
  numb = xnumb;
// replace??
const res = text.replace(numb, xnumb);
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
  const utterThis = new SpeechSynthesisUtterance(text);
  const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
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
  const xvoices = window.speechSynthesis.getVoices();
};


// get voices
function populateVoiceList() {
  let voices = synth.getVoices();

  for(i = 0; i < voices.length ; i++) {
    const option = document.createElement('option');
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
  for (let i = 0, len = text.length; i < len; i++) {
    setTimeout( (function( i ) {
      return function() {
        lipsync(text[i]);
      };
    }( i )), (80 * i) );
} //for

setTimeout(function() { 
document.getElementById('botmouth').innerHTML = oldmouth;
}, text.length*90);
} // end mouthshape




function lipsync(arg) {
  if (arg == ' ' || arg == '.') { botmouth.innerHTML = oldmouth;}
  if (arg == 'a') { botmouth.innerHTML = 'D';}
  if (arg == 'b') { botmouth.innerHTML = '|';}
  if (arg == 'c') { botmouth.innerHTML = 'D';}
  if (arg == 'd') { botmouth.innerHTML = '|';}
  if (arg == 'e') { botmouth.innerHTML = 'D';}
  if (arg == 'f') { botmouth.innerHTML = '|';}
  if (arg == 'g') { botmouth.innerHTML = '|';}
  if (arg == 'h') { botmouth.innerHTML = '|';}
  if (arg == 'i') { botmouth.innerHTML = 'D';}
  if (arg == 'j') { botmouth.innerHTML = 'I';}
  if (arg == 'k') { botmouth.innerHTML = 'I';}
  if (arg == 'l') { botmouth.innerHTML = 'P';}
  if (arg == 'm') { botmouth.innerHTML = '(';}
  if (arg == 'n') { botmouth.innerHTML = ')';}
  if (arg == 'o') { botmouth.innerHTML = 'o';}
  if (arg == 'p') { botmouth.innerHTML = '|';}
  if (arg == 'q') { botmouth.innerHTML = 'D';}
  if (arg == 'r') { botmouth.innerHTML = 'o';}
  if (arg == 's') { botmouth.innerHTML = ')';}
  if (arg == 't') { botmouth.innerHTML = '|';}
  if (arg == 'u') { botmouth.innerHTML = 'o';}
  if (arg == 'v') { botmouth.innerHTML = '/';}
  if (arg == 'w') { botmouth.innerHTML = 'o';}
  if (arg == 'x') { botmouth.innerHTML = 'x';}
  if (arg == 'y') { botmouth.innerHTML = 'D';}
  if (arg == 'z') { botmouth.innerHTML = '/';}

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


function m(item) {
  f = item.pageX - c.offsetLeft - n || f;
  e = item.pageY - c.offsetTop - n || e;
  item = s(e, f);
  t = f * f + e * e;
  if (t > w) {
    f = g * l.cos(item);
    e = g * l.sin(item);
    item = s(e, f);
    t = f * f + e * e;
  }

document.body.style.background = A((item + u) / B, C(t) / g, j.value / D)[3];
bgcol.style.background = A((item + u) / B, C(t) / g, j.value / D)[3];

    a.putImageData(E, 0, 0);
    a.beginPath();
    a.arc(f + n, e + n, 5, 0, 2 * Math.PI);
    a.stroke();
    a.beginPath();
    a.arc(200, 200, 190, 0, 2 * Math.PI);
    a.lineWidth = 2;
    a.stroke();
}


function A(xa, xb, xc) {
  xa = 6 * xa;
  var widthHalf = ~~xa;
  var x2 = xa - widthHalf;
  xa = xc * (1 - xb);
  var pdfdfd = xc * (1 - x2 * xb);
  xb = xc * (1 - (1 - x2) * xb);
  var mod = widthHalf % 6;
  widthHalf = [xc, pdfdfd, xa, xa, xb, xc][mod] * o;
  x2 = [xb, xc, xc, pdfdfd, xa, xa][mod] * o;
  xc = [xa, xa, xb, xc, xc, pdfdfd][mod] * o;
  return [widthHalf, x2, xc, "rgb(" + ~~widthHalf + "," + ~~x2 + "," + ~~xc + ")"];
}

kx = document;
kx.c = kx.createElement;
b.a = b.appendChild;
p = c.width = c.height = 400, z = b.a(kx.c("p")), E = a.createImageData(p, p), q = E.data, D = j.value = j.max = 10, g = 190, n = 200, w = g * g, o = 255, e = D, f = -e, r = 16040, l = Math, u = l.PI, B = 2 * u, C = l.sqrt, s = l.atan2;
b.style.textAlign = "center";
z.style.font = "2em courier";
j.value = 2;
y = j.min = 0;
for (; y < p; y++) {
  x = 0;
  for (; x < p; x++) {
    i = x - g;
    v = y - g;
    F = i * i + v * v;
    i = A((s(v, i) + u) / B, C(F) / g, 1);
    q[r++] = i[0];
    q[r++] = i[1];
    q[r++] = i[2];
    q[r++] = F > w ? 0 : o;
  }
}
j.onchange = m;
c.onmousedown = kx.onmouseup = function(e) {
  k.onmousemove = /p/.test(e.type) ? 0 : (m(e), m);
};
m(0);
