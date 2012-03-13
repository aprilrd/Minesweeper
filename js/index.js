$(document).ready(function () {
	initialize();
});

function initialize() {
	Chosen = []; //global
	Clicked = []; //global
	num = 8, //size of the grid, global. Change it to change the size of the grids
	bombs = 10, //number of bombs, global. change it to change the number of bombs
	randomPick(); //Pick the locations of the bombs randomly
	
	var w = 800, //height of the 
		h = w, //height of the matrix
		s = w/num; //size of each squares		
		
	var vis = d3.select("div#container").append("svg:svg")
	    .attr("width", w)
	    .attr("height", h);
	    
	var data = [];
	for (var i = 0; i < num*num; i ++) { //build data for d3
		var tmp = {}; 
		tmp.x = i%num;
		tmp.y = Math.floor(i/num);
		if (Chosen.indexOf(i) >= 0) {
			tmp.bomb = true;
		} else {
			tmp.bomb = false;
		}
		tmp.count = countBombs(i);
		
		data.push(tmp);
	}
	
	rects = vis.selectAll("rect") //add squares
			   .data(data)
			 .enter().append("rect")
			   .attr("x", function(d) { return s * d.x;})
			   .attr("y", function(d) { return s * d.y;})
			   .attr("width", s)
			   .attr("height", s)
			   .attr("class", "hidden");
	
    rects.on("click", click);
    
    function click(datum, i) { //properly react to click
    	if (Clicked.indexOf(i) >= 0) {
    		return; //No more duplicate clicks!
    	}
    	Clicked.push(i); //Add if the square was safe
    	
    	if (datum.bomb) {
    		alert("You lost: Bomb at (" + datum.x + ", " + datum.y + ")");
    		$(this).attr("class", "wrong");
    		rects.on("click", function() {}); //Failed. Noop
    	} else {
    		$(this).attr("class", "right");
    		vis.append("text")
	    		.attr("x", s * datum.x)
				.attr("y", s * datum.y)
		        .attr("dx", s/2-5)
		        .attr("dy", s/2+5)
		        .text(datum.count);
		}
    }
	
	function randomPick() { //pick the location of the bombs
		for (var i = 0; i < bombs; i ++) {
			do {
				var temp = Math.floor(Math.random()*num*num);
			} while (Chosen.indexOf(temp)>=0);
			Chosen.push(temp);
		}
	}
	
	function countBombs(i) { //determine the number of neighboring mines
		var counter = 0;
		var neighbors;
		if (i%num == 0 || i%num == num-1 || i < num || i > num^2-num-1) {
			if (i%num == 0) {
				if (i<num) {
					neighbors = [(Chosen.indexOf(i+1) >= 0), (Chosen.indexOf(i+1+num) >= 0), (Chosen.indexOf(i+num) >= 0)];
				} else if (i > num^2-num-1) {
					neighbors = [(Chosen.indexOf(i-num) >= 0), (Chosen.indexOf(i-num+1) >= 0), (Chosen.indexOf(i+1) >= 0)];
				} else {
					neighbors = [(Chosen.indexOf(i-num) >= 0), (Chosen.indexOf(i-num+1) >= 0), (Chosen.indexOf(i+1) >= 0), (Chosen.indexOf(i+num+1) >= 0), (Chosen.indexOf(i+num) >= 0)];
				}
			} else if (i%num == num-1) {
				if (i < num) {
					neighbors = [(Chosen.indexOf(i-1) >= 0), (Chosen.indexOf(i+num) >= 0), (Chosen.indexOf(i+num-1) >= 0)];
				} else if (i > num^2-num-1) {
					neighbors = [(Chosen.indexOf(i-num-1) >= 0), (Chosen.indexOf(i-num) >= 0), (Chosen.indexOf(i-1) >= 0)];
				} else {
					neighbors = [(Chosen.indexOf(i-num-1) >= 0), (Chosen.indexOf(i-num) >= 0), (Chosen.indexOf(i-1) >= 0), (Chosen.indexOf(i+num) >= 0), (Chosen.indexOf(i+num-1) >= 0)];
				}
			} else if (i < num) {
				neighbors = [(Chosen.indexOf(i-1) >= 0), (Chosen.indexOf(i+1) >= 0), (Chosen.indexOf(i+num+1) >= 0), (Chosen.indexOf(i+num) >= 0), (Chosen.indexOf(i+num-1) >= 0)];
			} else if (i > num^2-num-1) {
				neighbors = [(Chosen.indexOf(i-num-1) >= 0), (Chosen.indexOf(i-num) >= 0), (Chosen.indexOf(i-num+1) >= 0), (Chosen.indexOf(i-1) >= 0), (Chosen.indexOf(i+1) >= 0)];
			}
		} else {
			neighbors = [(Chosen.indexOf(i-num-1) >= 0), (Chosen.indexOf(i-num) >= 0), (Chosen.indexOf(i-num+1) >= 0), (Chosen.indexOf(i-1) >= 0), (Chosen.indexOf(i+1) >= 0), (Chosen.indexOf(i+num+1) >= 0), (Chosen.indexOf(i+num) >= 0), (Chosen.indexOf(i+num-1) >= 0)];
		}
		for (var n in neighbors) {
			if (neighbors[n]) { counter ++; }
		}  
		return counter;
	}
}

function newGame() { //start over
	$("div#container").html("");
	initialize();
}

function cheat() { //show the hidden bombs 
	rects.style("fill", function(d) {
		if (d.bomb) { return "red";}
		return "blue";
	});
}

function validate() { //validate the solution
	if (Clicked.length == num^2 - bombs) { //this is the invariant: all safe squares = size of grid - number of bombs
		alert("You won! The game is over. Please start over.");
	} else {
		alert("You lost :( The game is over. Please start over.");
	}
	rects.on("click", function() {}); //Failed. Noop
}
