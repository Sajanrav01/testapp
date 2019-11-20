/** Copyright 2016 IPCO 2012 Limited

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

window.zapppopup = window.zapppopup || {};
var TP_COOKIE_DISABLED_COOKIE = "TPCookieDisabled";
(function() {

    zapppopup._readyCallbacks = [];
    zapppopup._readyCallback = false;

    if (!zapppopup.registerEventHandler)
    {

    	zapppopup.events = {};

    	zapppopup.registerEventHandler = function (name, fn) {
            if (typeof zapppopup.events[name] === "undefined")
            	zapppopup.events[name] = [];
            zapppopup.events[name].push(fn);
        };

        zapppopup.triggerEvent = function (name, args) {
            if (typeof zapppopup.events[name] === "undefined")
                return;
            for (var idx = 0; idx < zapppopup.events[name].length; idx ++)
            	zapppopup.events[name][idx](args);
        };

    }

    
    zapppopup.documentReady = function(callback)
    {
    	try {
    		zapppopup._readyCallbacks.push(callback);
            if (zapppopup._readyCallback)
                return;
            document.onreadystatechange = function() {
                if (document.readyState === "complete")
                    for (var i = 0; i < zapppopup._readyCallbacks.length; i ++)
                    	zapppopup._readyCallbacks[i]();
            };
            zapppopup._readyCallback = true;
    	} catch(err) {
    		return;
    	}
    };


    zapppopup.registerXEventHandler = function(events, target)
    {

    	zapppopup.bindEvent("message", function(ev) {

    		try {
                data = JSON.parse(ev.data);
            } catch (err) {
                return;
            }

            if (typeof data.eventType === "undefined" || data.eventType.indexOf("com.zapp") == -1)
                return;

            if (!events[data.eventType])
            {
                //alert("Unhandled Event : " + data.eventType);
                return;
            }

            if (typeof events[data.eventType] !== "function")
            {
                //alert("Event handler for " + data.eventType + " is not a function");
                return;
            }

            events[data.eventType](data);

        }, target);

    };
    
    zapppopup.extendObj = function()
    {
        var obj = {};
        for (var idx in arguments)
        {
            if (typeof (arguments[idx]) !== "object")
                continue;
            for (var prop in arguments[idx])
                obj[prop] = arguments[idx][prop];
        }
        return obj;
    };

    /**
     *
     * @param elem
     * @returns {{document: {top: number, left: number, right: number, bottom: number}, window: {top: Number, left: Number, right: number, bottom: number}, height: Number, width: Number}}
     */
    zapppopup.getBoundingClient = function(elem)
    {
        var box = elem.getBoundingClientRect();

        var getSize = function(prop)
        {
            var doc = elem.ownerDocument,
                docElem = doc.documentElement,
                body = doc.body;
            return docElem[prop] || body[prop] || 0;
        };

        return {
            document: {
                top: box.top + getSize('scrollTop') - getSize('clientTop'),
                left: box.left + getSize('scrollLeft') - getSize('clientLeft'),
                right: getSize('clientWidth') - box.right,
                bottom: getSize('clientHeight') - box.bottom
            },
            window: {
                top: box.top,
                left: box.left,
                right: window.screen.width - box.right,
                bottom: window.screen.height - box.bottom
            },
            height: box.bottom - box.top,
            width: box.right - box.left
        };
    };

    /**
     *
     * @param url
     */
    zapppopup.addCssFile =  function(url)
    {
        var script = document.createElement('link');
        script.setAttribute('type', 'text/css');
        script.setAttribute('rel', 'stylesheet');
        script.setAttribute('media', 'all');
        script.setAttribute('href', url);
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    /**
     * Bind the callback to an event
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {Element} target
     * @returns {undefined}
     */
    zapppopup.bindEvent =  function(eventName, callback, target) {
        target = target || window;
        if (typeof (target.addEventListener) !== "undefined") {
            target.addEventListener(eventName, callback, false);
        } else if (typeof (target.attachEvent) !== "undefined") {
            target.attachEvent("on" + eventName, callback);
        } else {
            target["on" + eventName] = callback;
        }
    };

    /**
     * @param {string} className description
     */
    zapppopup.hasClassName = function(ele, className)
    {
        return (' ' + ele.className + ' ').indexOf(' ' + className + ' ') > -1;
    };

    /**
     * @param {string} className description
     */
    zapppopup.addClassName = function(ele, className)
    {
        if (zapp.hasClassName(ele, className))
            return ele;
        var a = ele.className + " " + className;
        ele.className = a[0] === " " ? a.substring(1, a.length) : a;
        return ele;
    };

    /**
     * @param {string} className description
     */
    zapppopup.removeClassName = function(ele, className)
    {
        if (!zapp.hasClassName(ele, className))
            return ele;
        var a = " " + ele.className + " ",
            b = " " + className + " ",
            c = a.indexOf(b),
            d = a.substring(0, c) + " " + a.substring(c + b.length, a.length);
        ele.className = d.substring(1, d.length - 1);
        return ele;
    };

    /**
     *
     * @param name
     * @returns {string}
     */
    zapppopup.getParameterByName =  function(name)
    {
    	 try {
		        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		            results = regex.exec(location.search);
		        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    	 } catch (err) {
    		 
    	 }
    };

   
    zapppopup.deleteCookie = function(name) {
    	
    	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    }
    
    zapppopup.cookieExists = function(cookie) {
    	return (document.cookie.indexOf(cookie) != -1 ) ? true : false;
    };

    zapppopup.isTPCookieDisabled = function() {
    	return zapppopup.cookieExists(TP_COOKIE_DISABLED_COOKIE);
    };
    
    
    zapppopup.redirectToCookieManagementUrl = function(url) {
    	
    	var xmlhttp = new XMLHttpRequest();
    	
		if (xmlhttp.withCredentials === undefined) {
			xmlhttp = new XDomainRequest();
		}
		
	    xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
	           if (xmlhttp.status == 200) {
	        	   console.log(url+" is reachable.");
	        	   setTimeout(function(){
	           			window.location.href = url +  "cookie-management/index.html";
	           		}, 10);
	        	   zapppopup.deleteCookie(TP_COOKIE_DISABLED_COOKIE);
	           }
	        }
	    };
	
	    xmlhttp.open("HEAD", url +  "cookie-management/index.html", true);
	    xmlhttp.send();
    };
    
    zapppopup.setHasAppCookie = function(cookieManagementUrl) {
    	
    	var ele = document.getElementById("zappAction");
        if (!ele)
        {
            ele = document.createElement("iframe");
            ele.style.display = "none";
            ele.id = "zappAction";
        }
        if (typeof zapp != "undefined" && typeof zapp.options != "undefined")
        	ele.setAttribute("src", zapp.options.cookieManagementUrl + "cookie-management/set-app-cookie.html");
        else if (typeof zapppopup != "undefined" && typeof zapppopup.options != "undefined")
        	ele.setAttribute("src", zapppopup.options.cookieManagementUrl + "cookie-management/set-app-cookie.html");
        else if (cookieManagementUrl != null && cookieManagementUrl != "")
        	ele.setAttribute("src", cookieManagementUrl + "cookie-management/set-app-cookie.html");
       // else
        	//alert("Cannot set app cookie!");
        
        document.body.appendChild(ele);
        
    };
    
    zapppopup.setAppCookie =  function(cookieManagementUrl)
    {
    	if (zapppopup.isTPCookieDisabled()) {
    		zapppopup.redirectToCookieManagementUrl(cookieManagementUrl);
    		setTimeout(function(){
    			zapppopup.setHasAppCookie(cookieManagementUrl);
    		},1000);
		} else {
			zapppopup.setHasAppCookie(cookieManagementUrl);
		}
        
        
    };
    
    zapppopup.removeAppCookie =  function(cookieManagementUrl)
    {
        var ele = document.getElementById("zappAction");
        if (!ele)
        {
            ele = document.createElement("iframe");
            ele.style.display = "none";
            ele.id = "zappAction";
        }
        if (typeof zapp != "undefined" && typeof zapp.options != "undefined")
        	ele.setAttribute("src", zapp.options.cookieManagementUrl + "cookie-management/remove-app-cookie.html");
        else if (typeof zapppopup != "undefined" && typeof zapppopup.options != "undefined")
        	ele.setAttribute("src", zapppopup.options.cookieManagementUrl + "cookie-management/remove-app-cookie.html");
        else if (cookieManagementUrl != null && cookieManagementUrl != "")
        	ele.setAttribute("src", cookieManagementUrl + "cookie-management/remove-app-cookie.html");
       // else
        //	alert("Cannot remove app cookie!");
        
        document.body.appendChild(ele);
        
    };

    /**
     *
     * @param c_name
     * @returns {HTMLCollection}
     */
    zapppopup.getCookie =  function(c_name)
    {
        var c_value = document.cookie;

        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start === -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start === -1) {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    };

})();

// Fire Loaded Event (This comes last to make sure the methods have been loaded)
setTimeout(function() {
	if (zapppopup.triggerEvent)
		zapppopup.triggerEvent("com.zapp.extras.loaded");
}, 200);

