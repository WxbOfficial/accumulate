

function createXMLHttpRequest() {
	// If running in Babylon Native, then defer to the native XMLHttpRequest, which has the same public contract
	if (typeof _native !== "undefined" && _native.XMLHttpRequest) {
		return new _native.XMLHttpRequest();
	} else {
		return new XMLHttpRequest();
	}
}


export default class WebRequest{

	static CustomRequestHeaders = {};

	static CustomRequestModifiers = [];

	static SkipRequestModificationForBabylonCDN = true;

	static get IsCustomRequestAvailable() {
		return Object.keys(WebRequest.CustomRequestHeaders).length > 0 || WebRequest.CustomRequestModifiers.length > 0;
	}

	constructor(){

		this._xhr = new XMLHttpRequest();

		this._requestURL = "";
	}

	_injectCustomRequestHeaders(){

		if (this._shouldSkipRequestModifications(this._requestURL)) {
			return;
		}

		for (const key in WebRequest.CustomRequestHeaders) {
			const val = WebRequest.CustomRequestHeaders[key];
			if (val) {
				this._xhr.setRequestHeader(key, val);
			}
		}
	}

	_shouldSkipRequestModifications(url) {
		return WebRequest.SkipRequestModificationForBabylonCDN && (url.includes("preview.babylonjs.com") || url.includes("cdn.babylonjs.com"));
	}

	// client's attributes
	get onprogress(){
		return this._xhr.onprogress;
	}

	set onprogress(value) {
		this._xhr.onprogress = value;
	}

	get readyState() {
		return this._xhr.readyState;
	}

	get status() {
		return this._xhr.status;
	}

	get statusText() {
		return this._xhr.statusText;
	}

	get response() {
		return this._xhr.response;
	}

	get responseURL() {
		return this._xhr.responseURL;
	}

	get responseText() {
		return this._xhr.responseText;
	}

	get responseType(){
		return this._xhr.responseType;
	}

	set responseType(value) {
		this._xhr.responseType = value;
	}

	get timeout() {
		return this._xhr.timeout;
	}

	set timeout(value) {
		this._xhr.timeout = value;
	}

	addEventListener(type, listener, options){
		this._xhr.addEventListener(type, listener, options);
	}

	removeEventListener(type, listener, options){
		this._xhr.removeEventListener(type, listener, options);
	}

	abort() {
		this._xhr.abort();
	}

	send(body) {
		if (WebRequest.CustomRequestHeaders) {
			this._injectCustomRequestHeaders();
		}

		this._xhr.send(body);
	}

	open(method, url) {
		for (const update of WebRequest.CustomRequestModifiers) {
			if (this._shouldSkipRequestModifications(url)) {
				return;
			}
			update(this._xhr, url);
		}

		// Clean url
		url = url.replace("file:http:", "http:");
		url = url.replace("file:https:", "https:");

		this._requestURL = url;

		return this._xhr.open(method, url, true);
	}

	setRequestHeader(name, value) {
		this._xhr.setRequestHeader(name, value);
	}

	getResponseHeader(name) {
		return this._xhr.getResponseHeader(name);
	}


}