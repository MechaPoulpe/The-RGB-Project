import { h, app } from 'hyperapp'

const endpoint = 'http://localhost:8080/api/';
const state = {
  colorResult: null
}

let inputTimeout = null;
let defaultColor = "#000000";
const regexHexa = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const regexKey = /[0-9a-fA-F]/;
const updateBgColor = color => document.getElementById('body').setAttribute("style", ["background-color:", color, ";width:100%"].join(''));
const updateColor = color => {
  defaultColor = defineTextColor(color);
  document.getElementById('hex').setAttribute("style", ['font-size : 100px;', 'color:'+ defaultColor].join(''));
  document.getElementById('#').setAttribute("style", ['font-size : 100px;', 'color:'+defaultColor].join(''));
  document.getElementById('underline').setAttribute("style", ['text-decoration: underline;', 'text-decoration-color:'+ defaultColor].join(''));
}

function defineTextColor(hex) {
  if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
  }

  if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

  return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
}

const actions = {
  getColor: value => (state, actions) => {   
    fetch(endpoint + 'getAll?color=' + encodeURIComponent(value))
      .then(data => data.json())
      .then(data => {
        state.colorResult = data;
        updateBgColor(data.rgb.full);
        updateColor(data.hex);
      });
  },
  getInputColor: (value) => (state, actions) => {
    if (regexKey.test(value.key)) {
      let realInputText = document.getElementById('hex').value + value.key;
      if (realInputText.length === 3 || realInputText.length === 6) {
        if (inputTimeout !== null) {
          clearTimeout(inputTimeout);
          inputTimeout = null;
        }
        inputTimeout = setTimeout(() => {
          actions.getColor('#' + realInputText);
        }, 500)
      } 
      return true;
    }
    return false;
  }
}

//TODO
// Show all color code
// Handle C/C

const view = (state, actions) => (
  h("body", {id: "body", style: {width: '100%'}}, [
    h("div", {style: {textDecoration: 'underline', textDecorationColor: defaultColor}, id: 'underline'}, [
      h("div", {style: {fontSize: '100px', color: defaultColor}, id: '#'}, '#'),
      h("input", {style: {fontSize: '100px', color: defaultColor}, type: 'text', id: 'hex', maxlength: 6, placeholder: 'FF00FF', onkeydown:(e) => actions.getInputColor(e) })
    ])
  ])
)

app(state, actions, view, document.body)