<?php

include('./config.php');

$result = $con->query("SELECT semester, course_code, course_name, course_topic, classification, code_available, languages, summary FROM courses ORDER BY semester_id ASC");

while ($row = $result->fetch_assoc()) {
    printf("%s \n", $row["course_name"]);
}

echo "Hello";