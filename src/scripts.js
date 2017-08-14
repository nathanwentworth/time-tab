
var options = {
	'military': false,
	'secondsOn': false,
	'flashSep': false,
	'textColor': '#fff',
	'background': '#555',
	'font': 'Rubik:500'
};

var hEl;
var mEl;
var sEl;

var hmSep;
var msSep;

var lastSecond;
var flashVis = false;

window.addEventListener('load', function () {
	init();
});

function init() {

	hEl = document.getElementById("minute");
	mEl = document.getElementById("hour");
	sEl = document.getElementById("seconds");

	hmSep = document.getElementById('hm-sep');
	msSep = document.getElementById('ms-sep');

	loadOptions();

	setInterval(time, 1000);
	time();

	document.body.classList.add('fade-in');
}

function loadOptions() {
	color();
	textColor();
	getFont();
	seconds();
	military();
	getSeparators();
}

function time() {
	var d = new Date();
	var hr = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();

	if (!options.military) {
		if (hr > 12) {
			hr = hr - 12;
		}
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}

	if (lastSecond != sec && options.flashSep) {
		flashSeparators();
		lastSecond = sec;
	} else {
		hmSep.classList.add('visible');
		hmSep.classList.remove('invisible');
		msSep.classList.add('visible');
		msSep.classList.remove('invisible');
	}

	hEl.textContent = "" + min;
	mEl.textContent = "" + hr;
	sEl.textContent = "" + sec;
}

function color() {
	chrome.storage.sync.get('color', function(items){
		if (items.color != undefined) {
			options.background = items.color;
		}

		if (options.background.charAt(0) == '#') {
			document.body.style.backgroundColor = options.background + "";
		} else if (options.background.substr(0,4) == 'http') {
			document.body.style.backgroundImage = "url('" + options.background + "')";
		} else if (options.background.length == 3 || options.background.length == 6) {
			document.body.style.backgroundColor = options.background + "";
		} else {
			document.body.style.background = "" + options.background + ";";
		}

    document.getElementById('backColor').value = options.background;
	});
}

function textColor() {
	chrome.storage.sync.get('textcolor', function(items){
		if (items.textcolor != undefined) {
			options.textColor = items.textcolor;
		}

    document.getElementById('textColor').value = options.textColor;
		document.getElementById('clock').style = "color: " + options.textColor + ';';
		document.getElementById('gear').style = "fill: " + options.textColor + ';';
	});
}

function seconds() {
	chrome.storage.sync.get('secondsOn', function(items){

		if (items.secondsOn != undefined) {
			options.secondsOn = items.secondsOn;
		}

		setSeconds();
	});
}

function setSeconds() {
	var secondsEl = document.getElementById('seconds');

	if (options.secondsOn) {
		secondsEl.classList.add('show');
		secondsEl.classList.remove('hidden');
		msSep.classList.add('show');
		msSep.classList.remove('hidden');
	} else {
		secondsEl.classList.add('hidden');
		secondsEl.classList.remove('show');
		msSep.classList.add('hidden');
		msSep.classList.remove('show');
	}
	document.getElementById('sec').checked = options.secondsOn;
}

function military() {
	chrome.storage.sync.get('military', function(items){
		if (items.military != undefined) {
			options.military = items.military;
		}

  	document.getElementById('military').checked = options.military;
	});
}

function getSeparators() {
	chrome.storage.sync.get('flashSep', function(items){
		if (items.flashSep != undefined) {
			options.flashSep = items.flashSep;
			console.log('flashSep defined! ' + options.flashSep);
		}

		document.getElementById('flashSep').checked = options.flashSep;
	});
}

function flashSeparators() {
	if (options.secondsOn) {
		if (flashVis) {
			msSep.classList.remove('visible');
			msSep.classList.add('invisible');
		} else {
			msSep.classList.add('visible');
			msSep.classList.remove('invisible');
		}
	}

	if (flashVis) {
		hmSep.classList.remove('visible');
		hmSep.classList.add('invisible');
	} else {
		hmSep.classList.add('visible');
		hmSep.classList.remove('invisible');
	}

	flashVis = !flashVis;
}

function getFont() {
	chrome.storage.sync.get('font', function(items){
		if (items.font != undefined) {
			options.font = items.font;
		}

		document.getElementById('font').value = options.font;

		setFont();
	});
}

function setFont() {
	options.font = options.font.trim();
	var fontToLoad = options.font.replace(' ', '+');
	console.log(options.font);

	var link;
	if (document.getElementById('fontLink') != null) {
		link = document.getElementById('fontLink');
	} else {
		link = document.createElement('LINK');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.id = 'fontLink';
		document.body.appendChild(link);
	}

	var fontUrl = 'https://fonts.googleapis.com/css?family=' + fontToLoad;
	link.href = fontUrl;

	if (options.font.indexOf(':') != -1) {
		options.font = options.font.substring(0, options.font.indexOf(':'));
	}

	document.body.style.fontFamily = options.font + '';
	console.log(document.body.style);
	console.log('font ' + options.font);
}

function save_options() {
  options.textColor = document.getElementById('textColor').value.trim();
  options.background = document.getElementById('backColor').value.trim();
  options.font = document.getElementById('font').value.trim();
  options.secondsOn = document.getElementById('sec').checked;
  options.military = document.getElementById('military').checked;
  options.flashSep = document.getElementById('flashSep').checked;

  chrome.storage.sync.set({
    textcolor: options.textColor,
    color: options.background,
    font: options.font,
    secondsOn: options.secondsOn,
    military: options.military,
    flashSep: options.flashSep
  }, function() {
    // Update status to let user know options were saved.
  });

  setSeconds();
  color();
  time();
  military();
  textColor();
  getFont();
}

var optionsVisible = false;

function showOptions() {
	let options = document.getElementById('options');
	if (optionsVisible) {
		options.classList.add('hidden');
		options.classList.remove('show');
		optionsVisible = false;
	} else {
		options.classList.add('show');
		options.classList.remove('hidden');
		optionsVisible = true;
	}
}

document.getElementById('save').addEventListener('click', save_options);
document.getElementById('button-settings').addEventListener("click", showOptions);
