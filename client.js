/**
* This is the stuff to paste to the Hello Space javascript editor.
* Be sure to start the server first.
*/

return function GoToMoon(state) {
   return controls(state);
}

function controls(state) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "//localhost:8080/", false);
  xhr.send(JSON.stringify(state));
    
  return new Controls(JSON.parse(xhr.response));
}