<?php
header('Access-Control-Allow-Origin: *');

function getFileUrls($htmlUrl){
    $file = fopen($htmlUrl,"r");
    $text = fread($file,filesize($htmlUrl));
    fclose($file);

    $t = trim($text);
    $t = implode("",explode("\n",$t));
    $t = implode("",explode('"',$t));
    $t = implode("",explode(" ",$t));
    $t = explode(",",trim($t));
    return $t;
  }



$urlList = "";
$urls = getFileUrls("HoloFiles.js");
$len = count($urls);
$allFiles = "";

for($i=0;$i<$len;$i++){
    $name = trim($urls[$i]);
    $file = fopen($name,"r");
    $text = fread($file,filesize($name));
    fclose($file);
    $allFiles .= $text."\n\n";
    $urlList .= "<script src = '".$name."' ></script>";
}

$file = fopen("build/holo.js","w");
fwrite($file,$allFiles);
fclose($file);


//----------------------------
//build html page

$file = fopen("quiltPlayer.html","r");
$text = fread($file,filesize("quiltPlayer.html"));
fclose($file);

$text = implode($urlList,explode('<script type="text/javascript" src="build/holo.js"></script>',$text));

echo $text;

 ?>
