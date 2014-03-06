navigator.geolocation.getCurrentPosition(GetLocation);

function GetLocation(location) {
  // after we have acquired the user's location, it is written into the HTML <input...> text boxes below
  document.getElementById('lat').value = location.coords.latitude;
  document.getElementById('lon').value = location.coords.longitude;
  //document.form.acc.value = location.coords.accuracy;
}

function getFocus(text, id){
  var field = document.getElementById(id);
  if(field.value == text){
    field.value = '';
    field.style.color = 'black';
  }
}
function loseFocus(text, id){
  var field = document.getElementById(id);
  if(field.value == ''){
    field.style.color = '#C0C0C0';
    field.value = text;
  } 
}

function isNumeric(n){
  var numbers = new Array(0,1,2,3,4,5,6,7,8,9);
  var result = false;
  for(var i = 0; i < numbers.length; i++){
    if(n == numbers[i] && n != ''){
      result = true;
    }
  }
  return result;
}

function validateTime(id){
  var input = document.getElementById(id).value;
  var result = true;
  if(input == ''){
    result = false;
  }
  if(isNumeric(input.charAt(0)) == false || isNumeric(input.charAt(1)) == false || isNumeric(input.charAt(3)) == false || isNumeric(input.charAt(4)) == false){
    result = false;
  }  
  if(input.charAt(2) != ':'){
    result = false;
  }
  return result;  
}

function saveInputs(){
  var name = document.getElementById('name');
  var category = document.getElementById('category');
  if(name.value == '' || category.options[category.options.selectedIndex].text == '' || name.value == 'Name' || category.options[category.options.selectedIndex].text == 'Category'){
    alert("Please enter a name and select a category");
    return false;
  }
  if(document.getElementById('lat').value == '' || document.getElementById('lon').value == ''){
    alert("Please type in the coordinates");
    return false;
  }
  if(validateTime("mfo") && validateTime("mfc") && validateTime("sato") && validateTime("satc") && validateTime("suno") && validateTime("sunc")){
    saveInputsAjax();  
  }
  else{
    alert("Please enter the time in the format hh:mm");
    return false;
  }
}

//AJAX Funktionen
var req = null;

function getXMLHttpRequest() {
  var httpReq = null;
  if (window.XMLHttpRequest) {
    httpReq = new XMLHttpRequest();
  }else if (typeof ActiveXObject != "undefined") {
    httpReq = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return httpReq;
}

function sendRequest(url, param, id) {
  req = getXMLHttpRequest();
  if (req) {
    req.onreadystatechange = function() {
    saveInputsResponse(id);
  }
    req.open("get", url + "?" + param, true);
    req.send(null);
  }
    }

//fragt alle existierenden Regionen ab und liefert Namen und Koordinaten zurÃ¼ck
function saveInputsAjax(){
  var name = document.getElementById('name').value;
  var category = document.getElementById('category').options[document.getElementById('category').options.selectedIndex].text;
  if(category == 'Bakery/CafÃ©'){
    category = 'Bakery';
  }
  var lat = document.getElementById('lat').value;
  var lon = document.getElementById('lon').value;
  var mfo = document.getElementById('mfo').value + ':00.00';
  var mfc = document.getElementById('mfc').value + ':00.00';
  var sato = document.getElementById('sato').value + ':00.00';
  var satc = document.getElementById('satc').value + ':00.00';
  var suno = document.getElementById('suno').value + ':00.00';
  var sunc = document.getElementById('sunc').value + ':00.00';
  var comments = document.getElementById('comments').value;
  var param02 = "name=" + name + "&category=" + category + "&lat=" + lat + "&lon=" + lon + "&mfo=" + mfo + "&mfc=" + mfc + "&sato=" + sato + "&satc=" + satc + "&suno=" + suno + "&sunc=" + sunc + "&comments=" + comments; 
  sendRequest("includes/dbResponse_saveInput.php", param02, 0);
}
function saveInputsResponse(id){
  if(req.readyState == 4){
    if(req.responseText == 'Success'){
      alert('Data Saved');
    }
    else{
      alert("Failure");
    }
  }
}