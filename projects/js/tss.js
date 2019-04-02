// ---------------------------------------------------------------------------
//
//    tss.js -- Tiny Speech Synthesizer in JavaScript
//
//    Original code: stan_1901 (Andrey Stephanov)
//    http://pouet.net/prod.php?which=50530
//
//    JavaScript port: losso/code red (Alexander Grupe)
//    http://heckmeck.de/demoscene/tiny-speech-synth-js/
//
// ---------------------------------------------------------------------------

var SAMPLE_FREQUENCY = 44100;
var PI               = Math.PI;
var PI_2             = 2*PI;

// Auxiliary functions
function CutLevel ( x,  lvl ) {
	if ( x > lvl )
		return lvl;
	if ( x < -lvl )
		return -lvl;
	return x;
}
function Sawtooth ( x ) {
	return ( 0.5 - ( x - Math.floor ( x / PI_2 ) * PI_2 ) / PI_2 );
}
var g_phonemes = {
	'o': { f:[12,  15,  0], w:[ 10,  10,  0], len:3, amp: 6, osc:0, plosive:0 },
	'i': { f:[ 5,  56,  0], w:[ 10,  10,  0], len:3, amp: 3, osc:0, plosive:0 },
	'j': { f:[ 5,  56,  0], w:[ 10,  10,  0], len:1, amp: 3, osc:0, plosive:0 },
	'u': { f:[ 5,  14,  0], w:[ 10,  10,  0], len:3, amp: 3, osc:0, plosive:0 },
	'a': { f:[18,  30,  0], w:[ 10,  10,  0], len:3, amp:15, osc:0, plosive:0 },
	'e': { f:[14,  50,  0], w:[ 10,  10,  0], len:3, amp:15, osc:0, plosive:0 },
	'E': { f:[20,  40,  0], w:[ 10,  10,  0], len:3, amp:12, osc:0, plosive:0 },
	'w': { f:[ 3,  14,  0], w:[ 10,  10,  0], len:3, amp: 1, osc:0, plosive:0 },
	'v': { f:[ 2,  20,  0], w:[ 20,  10,  0], len:3, amp: 3, osc:0, plosive:0 },
	'T': { f:[ 2,  20,  0], w:[ 40,   1,  0], len:3, amp: 5, osc:0, plosive:0 },
	'z': { f:[ 5,  28, 80], w:[ 10,   5, 10], len:3, amp: 3, osc:0, plosive:0 },
	'Z': { f:[ 4,  30, 60], w:[ 50,   1,  5], len:3, amp: 5, osc:0, plosive:0 },
	'b': { f:[ 4,   0,  0], w:[ 10,   0,  0], len:1, amp: 2, osc:0, plosive:0 },
	'd': { f:[ 4,  40, 80], w:[ 10,  10, 10], len:1, amp: 2, osc:0, plosive:0 },
	'm': { f:[ 4,  20,  0], w:[ 10,  10,  0], len:3, amp: 2, osc:0, plosive:0 },
	'n': { f:[ 4,  40,  0], w:[ 10,  10,  0], len:3, amp: 2, osc:0, plosive:0 },
	'r': { f:[ 3,  10, 20], w:[ 30,   8,  1], len:3, amp: 3, osc:0, plosive:0 },
	'l': { f:[ 8,  20,  0], w:[ 10,  10,  0], len:3, amp: 5, osc:0, plosive:0 },
	'g': { f:[ 2,  10, 26], w:[ 15,   5,  2], len:2, amp: 1, osc:0, plosive:0 },
	'f': { f:[ 8,  20, 34], w:[ 10,  10, 10], len:3, amp: 4, osc:1, plosive:0 },
	'h': { f:[22,  26, 32], w:[ 30,  10, 30], len:1, amp:10, osc:1, plosive:0 },
	's': { f:[80, 110,  0], w:[ 80,  40,  0], len:3, amp: 5, osc:1, plosive:0 },
	'S': { f:[20,  30,  0], w:[100, 100,  0], len:3, amp:10, osc:1, plosive:0 },
	'p': { f:[ 4,  10, 20], w:[  5,  10, 10], len:1, amp: 2, osc:1, plosive:1 },
	't': { f:[ 4,  20, 40], w:[ 10,  20,  5], len:1, amp: 3, osc:1, plosive:1 },
	'k': { f:[20,  80,  0], w:[ 10,  10,  0], len:1, amp: 3, osc:1, plosive:1 }
};


// Synthesizes speech and adds it to specified buffer
function SynthSpeech ( buf, text, f0, speed, bufPos ) {
	var startBuf = bufPos;
	// Debug
	var minBuf = 0,maxBuf = 0;
	// Loop through all phonemes
	for (var textPos=0; textPos<text.length; textPos++) {
		var l = text.charAt(textPos);
		// Find phoneme description
		var p = g_phonemes[l];
		if (!p) {
			if (l == " " || l == "\n") {
				bufPos += Math.floor(SAMPLE_FREQUENCY * 0.9 * speed); 
			}
			continue;
		}
		var v = p.amp;
		// Generate sound
		var sl = p.len * (SAMPLE_FREQUENCY / 15) * speed;
		for ( var f = 0; f < 3; f++ ) {
			var ff = p.f[f];
			var freq = ff*(50/SAMPLE_FREQUENCY);
			if ( !ff )
				continue;
			var buf1Res = 0, buf2Res = 0;
			var q = 1.0 - p.w[f] * (PI * 10 / SAMPLE_FREQUENCY);
			//var b = buf; <-- store current bufPos?
			var thisBufPos = bufPos;
			var xp = 0;
			for ( var s = 0; s < sl; s++ ) {
				var n = Math.random()-0.5;
				var x = n;
				if ( !p.osc ) {
					x = Sawtooth ( s * (f0 * PI_2 / SAMPLE_FREQUENCY) );
					xp = 0;
				}
				// Apply formant filter
				x = x + 2 * Math.cos ( PI_2 * freq ) * buf1Res * q - buf2Res * q * q;
				buf2Res = buf1Res;
				buf1Res = x;
				x = 0.75 * xp + x * v;
				xp = x;
				// Anticlick function
				x *= CutLevel ( Math.sin ( PI * s / sl ) * 5, 1 ) * 10;
				buf[thisBufPos++] = buf[thisBufPos]/2+x;
				buf[thisBufPos++] = buf[thisBufPos]/2+x;
				if (buf[thisBufPos-1] < minBuf) minBuf = buf[thisBufPos-1]; 
				if (buf[thisBufPos-1] > maxBuf) maxBuf = buf[thisBufPos-1]; 
			}
		}
		// Overlap neighbour phonemes
		bufPos += ((3*sl/4)<<1);
		if ( p.plosive )
			bufPos += (sl&0xfffffe);
	}

	// if (window.console) {
	// 	console.log("min/max buf = " + minBuf + "/" + maxBuf)
	// }
}
