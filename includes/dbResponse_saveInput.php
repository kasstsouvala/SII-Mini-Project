<?php 

  if(isset($_GET['name']) && isset($_GET['category']) && isset($_GET['lon']) && isset($_GET['lat']) && isset($_GET['mfo']) && isset($_GET['mfc']) && isset($_GET['sato']) && isset($_GET['satc']) && isset($_GET['suno']) && isset($_GET['sunc'])){
    
    $dbconnection = pg_connect("host=giv-siidemo.uni-muenster.de port=5432 dbname=group04 user=group04 password=uNMPygmcwCE56S7");
    
    $id;
    
    $abfrage = pg_query("SELECT id FROM foodstores ORDER BY id DESC LIMIT 1");
    
    while($row=pg_fetch_object($abfrage)){
		    $id = $row->id;
	   }
       
    
    $id++;
    $name = $_GET['name'];
    $category = $_GET['category'];
    $lat = $_GET['lat'];
    $lon = $_GET['lon'];
    $mfo = $_GET['mfo'];
    $mfc = $_GET['mfc'];
    $sato = $_GET['sato'];
    $satc = $_GET['satc'];
    $suno = $_GET['suno'];
    $sunc = $_GET['sunc'];
    $point = 'POINT('.$lon.' '.$lat.')';
    $comment;
    if(isset($_GET['comments']) && $_GET['comments'] != ''){
      $comment = $_GET['comments'];
      pg_query("INSERT INTO foodstores(id, ot_monfri_open, ot_monfri_close, ot_sat_open, ot_sat_close,ot_sun_open, ot_sun_close, comment, location, type, name) VALUES ('$id', '$mfo', '$mfc', '$sato', '$satc', '$suno', '$sunc', '$comment', ST_GeomFromText('$point', 4326), '$category','$name');");
    }
    else{
      pg_query("INSERT INTO foodstores(id, ot_monfri_open, ot_monfri_close, ot_sat_open, ot_sat_close,ot_sun_open, ot_sun_close, comment, location, type, name) VALUES ('$id', '$mfo', '$mfc', '$sato', '$satc', '$suno', '$sunc', NULL, ST_GeomFromText('$point', 4326), '$category','$name');");
    }

    
    
    echo 'Success';
    
  }



 ?>