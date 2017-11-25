
const OPTION_DEFAULTS = {
  'military': false,
  'secondsOn': false,
  'flashSep': false,
  'textColor': '#fff',
  'background': '#555',
  'font': 'Rubik:500'
}

var options = OPTION_DEFAULTS;

var hEl;
var mEl;
var sEl;

var optionContainerEl = document.getElementById('options')
var buttonSettings = document.getElementById('button-settings')
var buttonSave = document.getElementById('save')
var buttonCancel = document.getElementById('cancel')

var optionElements = {
  textColor: document.getElementById('textColor'),
  background: document.getElementById('backColor'),
  font: document.getElementById('font'),
  secondsOn: document.getElementById('sec'),
  military: document.getElementById('military'),
  flashSep: document.getElementById('flashSep')
}

var hmSep;
var msSep;

var lastSecond;
var flashVis = false;

var browser = browser || chrome;
var storage = browser.storage.local;

window.addEventListener('load', function () {
  init()
})

function init() {

  hEl = document.getElementById("minute");
  mEl = document.getElementById("hour");
  sEl = document.getElementById("seconds");

  hmSep = document.getElementById('hm-sep');
  msSep = document.getElementById('ms-sep');

  load();

  setInterval(time, 1000);
  time();

  document.body.classList.add('fade-in');
}

function load() {
  let loadingOptions = browser.storage.local.get();
  loadingOptions.then(onLoad, onError);
}

function onLoad(item) {
  console.log('loaded options')
  options = item || OPTION_DEFAULTS
  loadOptions()
}

function setBackground() {
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
}

function setTextColor() {
  document.getElementById('textColor').value = options.textColor;
  document.getElementById('clock').style = "color: " + options.textColor + ';';
  document.getElementById('gear').style = "fill: " + options.textColor + ';';
}

function loadOptions() {
  color();
  textColor();
  getFont();
  setSeconds();
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
    hmSep.classList.remove('invisible');
    msSep.classList.remove('invisible');
  }

  hEl.textContent = "" + min;
  mEl.textContent = "" + hr;
  sEl.textContent = "" + sec;
}

function color() {
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
}

function textColor() {
  document.getElementById('textColor').value = options.textColor;
  document.getElementById('clock').style = "color: " + options.textColor + ';';
  document.getElementById('gear').style = "fill: " + options.textColor + ';';
}

function setSeconds() {
  var secondsEl = document.getElementById('seconds');

  secondsEl.classList.toggle('hidden', !options.secondsOn);
  msSep.classList.toggle('hidden', !options.secondsOn);

  document.getElementById('sec').checked = options.secondsOn;
}

function military() {
  document.getElementById('military').checked = options.military;
}

function getSeparators() {
  document.getElementById('flashSep').checked = options.flashSep;
}

function flashSeparators() {
  msSep.classList.toggle('invisible', flashVis)
  hmSep.classList.toggle('invisible', flashVis)
  flashVis = !flashVis;
}

function getFont() {
  document.getElementById('font').value = options.font
  setFont()
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

  document.body.style.fontFamily = options.font.substring(0, options.font.indexOf(':'))
  console.log(document.body.style);
  console.log('font ' + options.font);
}

function save() {
  options.textColor = optionElements.textColor.value.trim();
  options.background = optionElements.background.value.trim();
  options.font = optionElements.font.value.trim();
  options.secondsOn = optionElements.secondsOn.checked;
  options.military = optionElements.military.checked;
  options.flashSep = optionElements.flashSep.checked;

  storage.set(options, function() {
    console.log('saved!');
    showOptions()
  })

  setSeconds()
  color()
  time()
  military()
  textColor()
  getFont()
  setBackground()
}

function cancel() {
  loadOptions()
  showOptions()
}

var optionsVisible = false;

function showOptions() {
  optionsVisible = !optionsVisible
  optionContainerEl.classList.toggle('hidden', !optionsVisible)
  buttonSettings.classList.toggle('active', optionsVisible)
}

function clearOptions() {
  var clearStorage = storage.clear();
  clearStorage.then(onCleared, onError);
}

function onCleared() {
  console.log("Sync storage cleared");

  storage.set(OPTION_DEFAULTS, function() {
    console.log('saved!');
    loadOptions()
  })
}

function onError(e) {
  console.log(e);
}

buttonSave.addEventListener('click', save)
buttonCancel.addEventListener('click', cancel)
buttonSettings.addEventListener('click', showOptions)
