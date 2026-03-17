<?php
// $servername = "localhost";
// $username = "root";
// $password = "";
// $dbname = "menucategories";
$servername = "learn-mysql.cms.waikato.ac.nz";
$username = "am1989";
$password = "my476249sql";
$dbname = "am1989";


// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if ($conn == FALSE) {
	die("Connection failed: " . mysqli_connect_error());
}
?>