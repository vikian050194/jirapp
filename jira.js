const addDailyFooter = () => {
	let countDownTimer = 60;

	let footer = document.createElement("div");
	footer.id = "daily";
	footer.style.position = "absolute";
	footer.style.backgroundColor = "grey";
	footer.style.bottom = "0px";
	footer.style.width = "100%";
	footer.style.height = "10%";
	footer.style.zIndex = 1000;
	footer.style.fontSize = "4rem";
	footer.style.textAlign = "center";
	footer.innerText = countDownTimer;

	const id = setInterval(() => {
		footer.innerText = --countDownTimer
		if(countDownTimer < 0){
			footer.style.backgroundColor = "red";
		}
	}, 1000);

	document.body.appendChild(footer);

	return id;
};

const removeDailyFooter = (id) => {
	clearInterval(id);
	document.querySelector("#daily").remove();
}

const apply = () => {
	const filters = [...document.querySelectorAll("a.js-quickfilter-button")].filter(f => f.innerText.length === 2);

	if(filters.length === 0){
		setTimeout(apply, 1000);
		return;
	}

	let intervalId = null;
	const getFilterName = () => filters[index].innerText;

	chrome.runtime.sendMessage("fullscreen");
	chrome.runtime.sendMessage("zoom");

	if([...document.querySelector("body").classList].indexOf("ghx-header-compact") === -1){
		document.querySelector("span.aui-icon.aui-icon.aui-icon-small.aui-iconfont-vid-full-screen-on").click();
	}

	const nextKeys = ["ArrowRight", "PageDown", " "];
	const previousKeys = ["ArrowLeft", "PageUp", "Backspace"];
	const toggleKeys = ["."];
	const keys = [...nextKeys, ...previousKeys, ...toggleKeys];
	
	let index = filters.indexOf(document.querySelector("a.js-quickfilter-button.ghx-active"));
	let isFilterEnabled = false;

	const max = filters.length - 1;
	const click = () => { 
		filters[index].click();
		isFilterEnabled = !isFilterEnabled;

		if(isFilterEnabled){
			intervalId = addDailyFooter(getFilterName());
		} else{
			removeDailyFooter(intervalId);
		}
	};

	const moveNext = () => {
		if(!isFilterEnabled){
			return;
		}

		click();
		index++;

		if (index > max) {
			index = 0;
		}

		click();
	};

	const movePrevious = () => {
		if(!isFilterEnabled){
			return;
		}
		
		click();
		index--;

		if (index === -1) {
			index = max;
		}

		click();
	};

	if (index === -1) {
		index = 0;
		click();
	} else{
		intervalId = addDailyFooter(getFilterName());
	}

	window.addEventListener("keydown", (e) => {
		const { key, code, keyCode } = e;

		console.info(`key: "${key}" code: "${code}" keyCode: "${keyCode}"`);

		if (keys.indexOf(key) !== -1) {
			e.preventDefault();
		}

		if (nextKeys.indexOf(key) !== -1) {
			moveNext();
			return;
		}

		if (previousKeys.indexOf(key) !== -1) {
			movePrevious();
			return;
		}

		if (toggleKeys.indexOf(key) !== -1) {
			click();

			return;
		}
	});
};

apply();