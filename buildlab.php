<?php
define("SOURCE_PATH",__DIR__."/public");
define("PATTERN_PATH",SOURCE_PATH."/patterns");
define("TEMP_PATH",__DIR__."/temp");
define("OUTPUT_PATH",__DIR__."/build");
define("INDEX","homepage");
define("DONTCOPY","/styleguide|/patterns|/data|/index.html|/latest-change.txt");
define("PL_START","<!-- Begin Pattern Lab (Required for Pattern Lab to run properly) -->");
define("PL_END","<!-- End Pattern Lab -->");

function copyr($f,$src_path,$out_path){
	if(strpos("|".DONTCOPY."|","|$f|")!==false)return false;
	$src=$src_path.$f;
	$dest=$out_path.$f;
	if(is_dir($src)){
		if(!file_exists($dest))
			mkdir($dest);
		foreach(glob("$src/*")as $g)
			copyr(substr($g,strlen($src_path)),$src_path,$out_path);
	}else
		copy($src,$dest);
}
function rmdirr($d){
	if(!file_exists($d))return false;
	foreach(glob("$d/*")as $f)
		if(is_dir($f))
			rmdirr($f);
		else
			unlink($f);
	if(file_exists("$d/.DS_Store"))
		unlink("$d/.DS_Store");
	rmdir($d);
}
function rmrmissing($f,$src_path,$out_path){
	$src=$src_path.$f;
	$dest=$out_path.$f;
	if(!file_exists($src))
		if(is_dir($dest))
			rmdirr($dest);
		else
			unlink($dest);
	else
		if(is_dir($dest))
			foreach(glob("$dest/*")as $g)
				rmrmissing(substr($g,strlen($out_path)),$src_path,$out_path);
}
function copyrifdifferent($f,$src_path,$out_path){
	$src=$src_path.$f;
	$dest=$out_path.$f;
	if(is_dir($src)){
		if(!file_exists($dest))
			mkdir($dest);
		foreach(glob("$src/*")as $g)
			copyrifdifferent(substr($g,strlen($src_path)),$src_path,$out_path);
	}else
		if(!file_exists($dest)||filesize($src)!=filesize($dest)||md5_file($src)!=md5_file($dest))
			copy($src,$dest);
}

rmdirr(TEMP_PATH);
copyr("",SOURCE_PATH,TEMP_PATH);
foreach(glob(PATTERN_PATH."/04-pages-*")as $pattern){
	$file=strrchr($pattern,"/");
	preg_match("#04-pages-\d\d-(.*)$#",$file,$id);
	$id=$id[1];
	$content=file_get_contents("$pattern$file.html");
	while(($start=strpos($content,PL_START))!==false)
		$content=substr($content,0,$start).substr($content,strpos($content,PL_END,$start)+strlen(PL_END));
	$content=str_replace("../../","",$content);
	file_put_contents(TEMP_PATH."/".($id==INDEX?"index":$id).".html",$content);
}
rmrmissing("",TEMP_PATH,OUTPUT_PATH);
copyrifdifferent("",TEMP_PATH,OUTPUT_PATH);
rmdirr(TEMP_PATH);