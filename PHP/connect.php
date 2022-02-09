<?php
    //set up the error reporting for PHP incase something goes wrong
    ini_set("error_reporting",E_ALL);
	ini_set("log_errors","1");
	ini_set("error_log","php_errors.txt");

    $conn = mysqli_connect('localhost', 'root', '', 'shares');

    if(!$conn)
    {
        die("connection failed: ".mysqli_connect_error());
    }
?>
