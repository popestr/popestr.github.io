<?php
$d = json_decode($_POST["cart"]);
$ret = "<table><tr><th>Item</th><th>Price</th><th>Special Requests</th></tr>";
foreach($d as $i){
    $n = $i->n;
    $p = $i->p;
    $r = $i->r;
    $ret.="<tr><td>".$n."</td><td>$".number_format((float)$p, 2, '.', '')."</td><td>".$r."</td></tr>";
}
$id = $_POST["id"];
$ret.="</table><br> Order submitted with ID ".$id;
echo $ret;


?>