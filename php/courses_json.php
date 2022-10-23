<?php

// Page live at http://api.rcpope.net/courses_json.php

// This is a very simple endpoint to fetch all data from the database.
// Expects existence of $SECRET_STRING in library.php which can manually refresh the query.

include('./library.php');
header('Content-Type: application/json');

$runQuery = isset($_GET["secret"]) and $_GET["secret"] == $SECRET_STRING;
$res = array();
$classifications = array();
$languages = array();

$filename = "cache.json";
$query_time = time();
date_default_timezone_set('EST');

if (!$runQuery and file_exists($filename)) {
    $cache = json_decode(file_get_contents($filename), true);

    $res = $cache["courses"];
    $classifications = $cache["classifications"];
    $languages = $cache["languages"];
    $query_time = filemtime($filename);
}

if ($runQuery and $result = $con->query("SELECT semester, course_code, course_name, course_topic, classification, code_available, languages, summary, 
GROUP_CONCAT(CASE WHEN type = 'class' THEN icon_html ELSE NULL END SEPARATOR ' ') AS 'classification_icons', 
GROUP_CONCAT(CASE WHEN type = 'lang' THEN icon_html ELSE NULL END SEPARATOR ' ') AS 'lang_icons', 
GROUP_CONCAT(CONCAT('course--', abbreviation) SEPARATOR ' ') AS 'course_classes' 
FROM courses 
INNER JOIN abbreviations ON (courses.classification LIKE CONCAT('%', abbreviations.abbreviation, '%') OR courses.languages LIKE CONCAT('%', abbreviations.abbreviation, '%'))
GROUP BY course_code
ORDER BY semester_id DESC")) {

    while ($row = $result->fetch_assoc()) {
        $row["code_available"] = ($row["code_available"] == "1"); // 1 is true, 0 is false, converting here makes handling ajax easier
        $res[] = $row;
    }

    $result->close();
}

if ($runQuery and $result = $con->query("SELECT abbreviation, icon_html, longname FROM abbreviations WHERE type = 'class'")) {
    while ($row = $result->fetch_assoc()) {
        $classifications[] = $row;
    }

    $result->close();
}

if ($runQuery and $result = $con->query("SELECT abbreviation, icon_html, longname FROM abbreviations WHERE type = 'lang'")) {
    while ($row = $result->fetch_assoc()) {
        $languages[] = $row;
    }

    $result->close();
}

$out["query_time"] = date("Y-m-d H:i:s T", $query_time);
$out["fresh_query"] = $runQuery;
$out["courses"] = $res;
$out["classifications"] = $classifications;
$out["languages"] = $languages;

if ($runQuery) {
    $cached_file = fopen($filename, "w");
    fwrite($cached_file, json_encode($out));
    fclose($cached_file);
}

echo json_encode($out, JSON_PRETTY_PRINT);
$con->close();