const addDailyFooter = () => {
	let countDownTimer = 90;
	const textColor = "snow";
	const initialBackgroundColor = "#1ba548";
	const overtimeBackgroundColor = "#e41b13";

	const getTimerValue = () => {
		const absValue = Math.abs(countDownTimer);
		const date = new Date(0, 0, 0, 0, 0, absValue);
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const result = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

		return result;
	}

	let footer = document.createElement("div");
	footer.id = "daily";
	footer.style.position = "absolute";
	footer.style.backgroundColor = initialBackgroundColor;
	footer.style.bottom = "0px";
	footer.style.width = "100%";
	footer.style.zIndex = 1000;
	footer.style.justifyContent = "center";
	footer.style.alignItems = "center";
	
	footer.style.textAlign = "center";
	footer.style.display = "flex";

	let timer = document.createElement("span");
	timer.style.color = textColor;
	timer.style.fontSize = "64px";
	timer.style.backgroundColor = "transparent";
	timer.innerText = getTimerValue();

	footer.appendChild(timer);

	const id = setInterval(() => {
		countDownTimer--;
		timer.innerText = getTimerValue();

		if (countDownTimer < 0) {
			footer.style.backgroundColor = overtimeBackgroundColor;
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

	if (filters.length === 0) {
		setTimeout(apply, 1000);
		return;
	}

	let intervalId = null;
	const getFilterName = () => filters[index].innerText;

	chrome.runtime.sendMessage("fullscreen");
	// chrome.runtime.sendMessage("zoom");

	if ([...document.querySelector("body").classList].indexOf("ghx-header-compact") === -1) {
		document.querySelector("span.aui-icon.aui-icon.aui-icon-small.aui-iconfont-vid-full-screen-on").click();
	}

	const nextKeys = ["ArrowRight", "PageDown", " "];
	const previousKeys = ["ArrowLeft", "PageUp", "Backspace"];
	const toggleKeys = ["."];
	const keys = [...nextKeys, ...previousKeys, ...toggleKeys];

	let index = filters.indexOf(document.querySelector("a.js-quickfilter-button.ghx-active"));
	let isFilterEnabled = index !== -1;

	const max = filters.length - 1;
	const click = () => {
		filters[index].click();
		isFilterEnabled = !isFilterEnabled;

		if (isFilterEnabled) {
			intervalId = addDailyFooter(getFilterName());
		} else {
			removeDailyFooter(intervalId);
		}
	};

	const moveNext = () => {
		if (!isFilterEnabled) {
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
		if (!isFilterEnabled) {
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
	} else {
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