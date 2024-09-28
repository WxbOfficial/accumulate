import App from './app.js';

globalThis.json = async fileName => await (await fetch(`../data/${fileName}.json`)).json();

// Pssst, I've created a github package - https://github.com/brookesb91/dismissible
globalThis.hideBanners = (e) => {
	document
		.querySelectorAll(".banner.visible")
		.forEach((b) => b.classList.remove("visible"));
};

const app = new App();
app.initial();

globalThis.app = app;