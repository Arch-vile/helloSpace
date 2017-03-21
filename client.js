/**
* This is the stuff to paste to the Hello Space javascript editor.
* Be sure to start the server first.
*/

return function GoToMoon(state) {
   return requestControls(state);
}

function requestControls(state) {
  console.log("Requesting controls from ground control.")
  
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "//localhost:8080/", false);
    xhr.send(JSON.stringify(state));
  
    return new Controls(JSON.parse(xhr.response));
  } catch(err) {
    console.log("Ground control unresponsive. Houston, we have a problem.");
    return new Controls({});
  }
}