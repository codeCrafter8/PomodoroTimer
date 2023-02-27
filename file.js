window.onload = () => {
	const option = document.getElementById('pomodoro');
	option.classList.add('active');
	show('pomodoro');
	button_click('pomodoro');
};

function button_click(option){
	const button = document.getElementById('start_stop');
	button.innerHTML = 'START';
	button.onclick = () => {
		if (start_stop.innerHTML == 'START'){
			runTime(option);
			start_stop.innerHTML = 'STOP'
		}
		else{
			runningTime = false;
			clearInterval(interval1);
			clearInterval(interval2);
			start_stop.innerHTML = 'START'
	}};
}

const time = {
	pomodoro: 25,
	shortBreak: 5,
	longBreak: 15,
	howMany: 0,
	elapsed_m: 0,
	elapsed_s: 0
};

const options = document.querySelectorAll('.headButton');
options.forEach((elem) => {
	elem.onclick = () => {
		change_option(elem.id);
	}
});

const timer = document.getElementById('timer');

let interval1;
let interval2;
let minutes;
let seconds;
let partofProgress = 0;
let runningTime = false;

function runTime(option){
	runningTime = true;
	
	let partition = 60000 - time.elapsed_s * 1000;

	if(partofProgress == 0)
		partofProgress = loading_bar.offsetWidth / (60 * time[`${option}`]);
	
	minutes = time[`${option}`] - time.elapsed_m;
	seconds = 60 - time.elapsed_s;
	
	seconds--;
	minutes--;
	if(minutes < 10)
			minutes = '0' + minutes;
	
	interval1 = setInterval(interval_1, 1000, option);

	//console.log(partition);
	interval2 = setInterval(interval_2, partition, option);
}

const loading_progress = document.getElementById('loadingBarProgress');
const loading_bar = document.getElementById('loadingBar');

function interval_1(option){
	loading_progress.style.width = partofProgress + 'px';
	partofProgress += loading_bar.offsetWidth / (60 * time[`${option}`]);
	
	if(seconds < 10)
			seconds = '0' + seconds;
	timer.innerHTML = minutes + ':' + seconds;
	if(minutes == 0 && seconds == 0){
		const beep = new Audio('beep.mp3');
	    beep.play();
		clearInterval(interval1);
		clearInterval(interval2); 
		time.elapsed_s = 0;
		time.elapsed_m = 0;
		setTimeout(function(){
			if(option == 'pomodoro'){
				time.howMany++;
				time.howMany < 4 ? change_option('shortBreak') : change_option('longBreak');
			}
			else if(option == 'shortBreak' || option == 'longBreak')
				change_option('pomodoro');
		}, 3000);
	}
	seconds--;
	time.elapsed_s++;
}

function interval_2(option){
	minutes--;
	time.elapsed_m++;
	time.elapsed_s = 0;
	if(minutes < 10)
		minutes = '0' + minutes;
	clearInterval(interval1);
	clearInterval(interval2);
	runTime(option);
}

function change_option(option){
	//console.log(minutes);
	if(runningTime == true){
		if(confirm('The timer is still running!'))
			process_change(option);
	}
	else
		process_change(option);
}

function process_change(option){
	partofProgress = 0;
	runningTime = false;
	loading_progress.style.width = 0;
	time.elapsed_m = 0;
	time.elapsed_s = 0;
	clearInterval(interval1);
	clearInterval(interval2);
	
	const mode = option;
	
	show(mode);
	
	turn_to_active(mode);
	
	button_click(mode);
}

function turn_to_active(option){
	const color = `var(--` + option + `)`;
	options.forEach(e => {
		e.classList.remove('active')
		e.style.backgroundColor = color;
	}
	);
	
	const choosen = document.getElementById(option);
	choosen.classList.add('active');
	document.body.style.backgroundColor = color;
	document.getElementById('container').style.backgroundColor = color;
	document.getElementById('start_stop').style.color = color;
}


function show(option){
	minutes = time[`${option}`];
	seconds = 60;
	if(minutes < 10)
			minutes = '0' + minutes;
	timer.innerHTML = minutes + ':00';
}