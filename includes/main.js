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

function getTime(){
  var datum = new Date();
  var hours = datum.getHours();
  var minutes = datum.getMinutes();
  if(hours < 10){
    hours = '0' + hours;
  }
  if(minutes < 10){
    minutes = '0' + minutes;  
  }
  return hours + ':' + minutes + ':00.00';
}

function getDay(){
  var datum = new Date();
  var days = datum.getDay();
  var weekdays = new Array("Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
  return weekdays[days]; 
}

function setWhereQuery(time, day){
  var result = "";
  if(day == 'Monday' || day == 'Tuesday' || day == 'Wednesday' || day == 'Thursday' || day == 'Friday'){
    result = 'ot_monfri_open < \'' + time + '\' AND ot_monfri_close > \'' + time + '\''; 
  }
  else if(day == 'Saturday'){
    result = 'ot_sat_open < \'' + time + '\' AND ot_sat_close > \'' + time + '\'';  
  }
  else if(day == 'Sunday'){
    result = 'ot_sun_open < \'' + time + '\' AND ot_sun_close > \'' + time + '\'';
  }
  return result;
}


function StringToFeatures(string, category){
  if(string != ''){
    var all = new Array();
  all = string.split('|');


  for(var i = 0; i < all.length; i+=3){
    var marker = L.marker([all[i], all[i+1]]);
    marker.bindPopup(all[i+2]);
    if(category == 'supermarket'){
      var myIcon = L.icon({iconUrl: 'images/supermarket.png',iconSize: [35, 35],iconAnchor: [22, 22],popupAnchor: [-3, -50],});
      marker.setIcon(myIcon);
      marker.addTo(supermarketLayer);
    }
    else if(category == 'restaurant'){
      var myIcon = L.icon({iconUrl: 'images/restaurant.png',iconSize: [35, 35],iconAnchor: [22, 22],popupAnchor: [-3, -50],});
      marker.setIcon(myIcon);
      marker.addTo(restaurantLayer);
    }
    else if(category == 'fastfood'){
      var myIcon = L.icon({iconUrl: 'images/fastfood.png',iconSize: [35, 35],iconAnchor: [22, 22],popupAnchor: [-3, -50],});
      marker.setIcon(myIcon);
      marker.addTo(fastfoodLayer);
    }
    else if(category == 'bakery'){
      var myIcon = L.icon({iconUrl: 'images/bakery.png',iconSize: [30, 30],iconAnchor: [22, 22],popupAnchor: [-3, -50],});
      marker.setIcon(myIcon);
      marker.addTo(bakeryLayer);
    }
  }  
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

function sendRequest1(url, param, id) {
  req = getXMLHttpRequest();
  if (req) {
    req.onreadystatechange = function() {
    getFeaturesResponse(id);
  }
    req.open("get", url + "?" + param, true);
    req.send(null);
  }
    }


function getFeatures(category){ 
  var param02 = "actualTime=" + getTime() + "&day=" + getDay() + "&category=" + category;
  sendRequest1("includes/dbResponse_getFeatures.php", param02, category);
}
function getFeaturesResponse(category){
  if(req.readyState == 4){
    StringToFeatures(req.responseText, category);
    if(category == 'supermarket'){
      getFeatures('restaurant');
    }      
    else if(category == 'restaurant'){
      getFeatures('fastfood');
    }
    else if(category == 'fastfood'){
      getFeatures('bakery');
    }
  }
}




function changeTimeManually(){
  if(validateTime("newtime") == true){
    supermarketLayer.clearLayers();
    restaurantLayer.clearLayers();
    fastfoodLayer.clearLayers();
    bakeryLayer.clearLayers();
    getFeaturesManually('supermarket');
    }
  else{
    alert("Please enter the time in the format hh:mm!");
  }  
}


function sendRequest2(url, param, id) {
  req = getXMLHttpRequest();
  if (req) {
    req.onreadystatechange = function() {
    getFeaturesManuallyResponse(id);
  }
    req.open("get", url + "?" + param, true);
    req.send(null);
  }
}


function getFeaturesManually(category){
    var newTime = document.getElementById('newtime').value + ':00.00';
    var day = document.getElementById('weekday').options[document.getElementById('weekday').options.selectedIndex].text;
    var param02 = "actualTime=" + newTime + "&day=" + day + "&category=" + category;
    sendRequest2("includes/dbResponse_getFeatures.php", param02, category);  
}
function getFeaturesManuallyResponse(category){
  if(req.readyState == 4){
    StringToFeatures(req.responseText, category);
    if(category == 'supermarket'){
      getFeaturesManually('restaurant');
    }
    else if(category == 'restaurant'){
      getFeaturesManually('fastfood');
    }
    else if(category == 'fastfood'){
      getFeaturesManually('bakery');
    }
  }
}

function showAllFoodstores(){
  if(document.getElementById('showAll').checked){
    supermarketLayer.clearLayers();
    restaurantLayer.clearLayers();
    fastfoodLayer.clearLayers();
    bakeryLayer.clearLayers();
    getAllFeaturesAjax('supermarket');
  }
  else{
    supermarketLayer.clearLayers();
    restaurantLayer.clearLayers();
    fastfoodLayer.clearLayers();
    bakeryLayer.clearLayers();
    getFeatures('supermarket');  
  }
}

function sendRequest3(url, param, id) {
  req = getXMLHttpRequest();
  if (req) {
    req.onreadystatechange = function() {
    getAllFeaturesResponse(id);
  }
    req.open("get", url + "?" + param, true);
    req.send(null);
  }
}


function getAllFeaturesAjax(category){
    var param02 = "category=" + category;
    sendRequest3("includes/dbResponse_getAllFeatures.php", param02, category);
}
function getAllFeaturesResponse(category){
  if(req.readyState == 4){
    StringToFeatures(req.responseText, category);
    if(category == 'supermarket'){
      getAllFeaturesAjax('restaurant');
    }
    else if(category == 'restaurant'){
      getAllFeaturesAjax('fastfood');
    }
    else if(category == 'fastfood'){
      getAllFeaturesAjax('bakery');
    }
  }
}

//updates the clock in the functions box
function updateClock (){
  var currentTime = new Date ( );

  var currentHours = currentTime.getHours ( );
  var currentMinutes = currentTime.getMinutes ( );
  var currentSeconds = currentTime.getSeconds ( );

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;

  // Update the time display
  document.getElementById("clock").firstChild.nodeValue = currentTimeString;
}



