<?php

	$dbconnection = pg_connect("host=giv-siidemo.uni-muenster.de port=5432 dbname=group04 user=group04 password=uNMPygmcwCE56S7");

	//$parameters = $_GET['parameters'];
	$category = $_GET['category'];



	if($category == 'supermarket'){
   $category = 'Supermarket';
   }
   else if($category == 'restaurant'){
     $category = 'Restaurant';
   }
    else if($category == 'fastfood'){
     $category = 'Fast Food';
   }
    else if($category == 'bakery'){
     $category = 'Bakery';
   }


 function checkClosed($openTime, $closeTime){
   if($openTime == '24:00:00' && $closeTime == '00:00:00'){
     return 'closed';
   }
   else{
     return $openTime.' - '.$closeTime;
   }
 }


	$abfrage = pg_query("SELECT *,st_astext(location) AS geometry FROM foodstores WHERE type = '$category' ORDER BY id");

	$resultString = '';

	while($row=pg_fetch_assoc($abfrage)){
       $pointString = $row['geometry'];
  	   $pointString = substr($pointString, 6);
  	   $pointString = substr($pointString, -strlen($pointString), strlen($pointString)-1);
  	   $coordinates = explode(" ",$pointString);
       $latitude = $coordinates[0];
       $longitude = $coordinates[1];

  		 $info = '<b>'.$row['name'].'</b><br />Mo - Fr: '.checkClosed($row['ot_monfri_open'],$row['ot_monfri_close']).'<br />Saturday: '.checkClosed($row['ot_sat_open'],$row['ot_sat_close']).'<br />Sunday: '.checkClosed($row['ot_sun_open'],$row['ot_sun_close']).'<br />Comments: '.$row['comment'];

  		 $resultString .= '|'.$latitude.'|'.$longitude.'|'.$info;
	}

	$resultString = substr($resultString, 1);

	echo $resultString;

	//echo phpinfo();
?>
