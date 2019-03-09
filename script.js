var elements = document.getElementsByTagName("td");
var number = 0;
for (var i = 0; i < elements.length; i++)
	elements[i].addEventListener("click", color);

var elems = document.getElementsByClassName('special');
for (var i = 0; i < elems.length; i++)
	elems[i].removeEventListener("click", color);


function color () {
	number++;
	this.innerHTML = (number%2 == 0? 'O':'X');
	document.getElementById('player').innerHTML = "Player turn: " + (number%2 == 0? 'X':'O');
	this.removeEventListener("click", color);
}
