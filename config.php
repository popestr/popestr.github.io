<?php
	require_once('./library.php'); //to connect to the database
	$con = new mysqli($SERVER, $loginUSERNAME, $loginPASSWORD, $DATABASE, $PORT);
	if (mysqli_connect_errno())
	{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
?>