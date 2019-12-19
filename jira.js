const apply = () => {
	const filters = [...document.querySelectorAll("a.js-quickfilter-button")].filter(f => f.innerText.length === 2);

	if(filters.length === 0){
		setTimeout(apply, 1000);
		return;
	}

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
	const max = filters.length - 1;
	const click = () => { filters[index].click(); };

	const moveNext = () => {
		click();
		index++;

		if (index > max) {
			index = 0;
		}

		click();
	};

	const movePrevious = () => {
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