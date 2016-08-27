 /* Image loading utility. It eases the process of loading
  * image files so that they can be used within your game. It also includes
  * a simple "caching" layer so it will reuse cached images if you attempt
  * to load the same image multiple times.
  */
 (function () {
	 var resourceCache = {};
	 var loading = [];
	 var readyCallbacks = [];

	 /* Public image loader function. It accepts an array of strings pointing to image files
	  * or a string for a single image. It will then call the private image loading function * accordingly.
	  */
	 function load(urlOrArr) {
		 if (urlOrArr instanceof Array) {
			 urlOrArr.forEach(function (url) {
				 _load(url);
			 });
		 } else {
			 /* If no array value passed, assume the value is a string and call the image loader directly.
			  */
			 _load(urlOrArr);
		 }
	 }

	 /* Private image loader function, called by the public image loader function.
	  */
	 function _load(url) {
		 if (resourceCache[url]) {
			 /* Returns cached image.
			  */
			 return resourceCache[url];
		 } else {
			 /* Loads new image.
			  */
			 var img = new Image();
			 img.onload = function () {
				 /* Caches loaded image.
				  */
				 resourceCache[url] = img;

				 /* Calls the onReady() callbacks.
				  */
				 if (isReady()) {
					 readyCallbacks.forEach(function (func) {
						 func();
					 });
				 }
			 };

			 /* Sets the initial cache value to false. This will change when
			  * the image's onload event handler is called. Points
			  * the image's src attribute to the one passed in URL.
			  */
			 resourceCache[url] = false;
			 img.src = url;
		 }
	 }

	 /* Grabs references to images that were previously loaded.
	  * If an image is cached, this functions the same as calling load() on that URL.
	  */
	 function get(url) {
		 return resourceCache[url];
	 }

	 /* Checks if requested images have been properly loaded.
	  */
	 function isReady() {
		 var ready = true;
		 for (var k in resourceCache) {
			 if (resourceCache.hasOwnProperty(k) &&
				 !resourceCache[k]) {
				 ready = false;
			 }
		 }
		 return ready;
	 }

	 /* Adds a function to the callback stack that is called
	  * when all requested images are properly loaded.
	  */
	 function onReady(func) {
		 readyCallbacks.push(func);
	 }

	 /* Global Resources object.
	  * Defines publicly accessible functions.
	  */
	 window.Resources = {
		 load: load,
		 get: get,
		 onReady: onReady,
		 isReady: isReady
	 };
 })();
