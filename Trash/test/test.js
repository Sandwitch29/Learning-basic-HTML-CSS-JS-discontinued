let start = document.querySelector('#start');
let stop  = document.querySelector('#stop');
let timerId; // makes the variable global

start.addEventListener('click', function() {
	let i = 0;
	
	timerId = setInterval(function() {
		console.log('!')
	}, 1000);
});

stop.addEventListener('click', function() {
	clearInterval(timerId);
});