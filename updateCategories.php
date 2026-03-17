<?php
require_once("connect.php");

// Read the body of the JSON post request and decode it
$body = json_decode(file_get_contents("php://input"), true);
$category = $body["category"];

// Grab the row of the given category
$stmt = $conn->prepare("SELECT selected FROM menuCategories WHERE strCategory = (?)");
$stmt->bind_param("s", $category);
if ($stmt->execute()) {
    $selectedResult = $stmt->get_result();
    while ($row = $selectedResult->fetch_assoc()) {
        // Toggle the selected column and update it with the new value
        $newResult = $row["selected"] == 1 ? 0 : 1;

        $update = $conn->prepare("UPDATE menuCategories SET selected = (?) WHERE strCategory = (?)");
        $update->bind_param("is", $newResult, $category);

        if ($update->execute()){
            // Send back success message
            echo json_encode(["success" => true, "message"=> "Database successfully updated."]);
        }
        else{
            // Something went wrong
            echo json_encode(["success"=> false, "message" => "There was an error with updating the database."]);
        }
    }
} else {
    echo "Error with query: " . $stmt->error;
}
mysqli_close($conn);
?>