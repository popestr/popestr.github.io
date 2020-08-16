function getTextDelta(goal, mod){

}

function reset(){
	$("#counter").html("0");
	$("#mte").val("").change();
}

function toggleTheme(){
	let curr = $("#stl").attr("href");
	if(curr === "styles.css") $("#stl").attr("href", "styles_dark.css");
	if(curr === "styles_dark.css") $("#stl").attr("href", "styles.css");
}


$(document).ready(function(){

$("#mte").keypress(function(){
	let b = $("#counter").html();
	$("#counter").html(++b);
});

});
// $("document").change(function(){
// 	console.log("dew")
// })

