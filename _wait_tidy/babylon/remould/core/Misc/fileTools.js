
import WebRequest from "./webRequest.js";


export function RequestFile(
	url,
	onSuccess,
	onProgress,
	useArrayBuffer,
	onError,
	onOpened
){
	let request = new WebRequest();
	let onReadyStateChange ;

	const unbindEvents = () => {
		if (!request) {
			return;
		}

		if (onProgress) {
			request.removeEventListener("progress", onProgress);
		}

		if (onReadyStateChange) {
			request.removeEventListener("readystatechange", onReadyStateChange);
		}
		request.removeEventListener("loadend", onLoadEnd);
	}

	let onLoadEnd = () => {
		unbindEvents();

		onProgress = undefined;
		onReadyStateChange = null;
		onLoadEnd = null;
		onError = undefined;
		onOpened = undefined;
		onSuccess = undefined;
	}

	request.open("GET", url);

	if (onOpened) {
		try {
			onOpened(request);
		} catch (e) {
			onError(e);
			return;
		}
	}

	if (useArrayBuffer) {
		request.responseType = "arraybuffer";
	}

	if (onProgress) {
		request.addEventListener("progress", onProgress);
	}

	if (onLoadEnd) {
		request.addEventListener("loadend", onLoadEnd);
	}

	onReadyStateChange = ()=>{
		if ( !request) {
			return;
		}

		if (request.readyState === (XMLHttpRequest.DONE || 4)) {

			if (onReadyStateChange) {
				request.removeEventListener("readystatechange", onReadyStateChange);
			}

      if ( request.status >= 200 && request.status < 300 ) {
        try {
          if (onSuccess) {
            onSuccess(useArrayBuffer ? request.response : request.responseText, request);
          }
        } catch (e) {
          onError(e);
        }
        return;
      }
		}
	}

	request.addEventListener("readystatechange", onReadyStateChange);

	request.send();
}