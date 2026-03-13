<?php
require_once("connect.php");

// Query the database and store the result inside $categories
$categories = [];
$query = "SELECT * FROM menucategories";
$result = $conn->query($query);

if ($result == FALSE) {
    die("Error in query" . mysqli_error($con));
}

// Add all the results to the categories
while ($row = mysqli_fetch_assoc($result)) {
    $categories[] = $row;
}

echo json_encode(['success' => true, 'data' => $categories]);
mysqli_close($conn);
?>