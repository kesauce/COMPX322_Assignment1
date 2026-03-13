<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "menucategories";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if ($conn == FALSE) {
	die("Connection failed: " . mysqli_connect_error());
}
?>