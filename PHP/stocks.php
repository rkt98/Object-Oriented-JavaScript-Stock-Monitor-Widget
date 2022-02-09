<?php

    //set up the error reporting for PHP incase something goes wrong
    ini_set("error_reporting",E_ALL);
	ini_set("log_errors","1");
	ini_set("error_log","php_errors.txt");

    //connect to the database
    require_once('connect.php');


    //put data passed through the request into variables
    $name = $_POST['name'];

    //query to get towns the given user wants to see
    $sql = "SELECT * FROM `shareprices` WHERE `name` ='".$name."'";
    $result = mysqli_query($conn, $sql);

    //get the results and store them into their respective variables
    $row = mysqli_fetch_array($result);

	//set the values of price and movement from the returned data
    $price = $row['price'];
    $movement = $row['movement'];

    //set up resuts with json
    $share = array($name,$price,$movement);
    $share = json_encode($share);

    //return
    echo $share;
?>
