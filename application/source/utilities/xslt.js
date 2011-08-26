/*
 * xslt.js
 *
 * Copyright (c) 2005-2008 Johann Burkard (<mailto:jb@eaio.com>)
 * <http://eaio.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

/**
 * Constructor for client-side XSLT transformations.
 * 
 * @author <a href="mailto:jb@eaio.com">Johann Burkard</a>
 * @version $Id: overview-summary-xslt.js.html 300 2008-08-29 22:18:52Z Johann $
 * @constructor
 */
function Transformation() {

	this.xml = undefined;
	this.xmlDoc = undefined;
	this.xslt = undefined;
	this.xsltDoc = undefined;
	this.callback = function() {};
	this.resultDoc = undefined;
	
	/**
	 * Sort of like a fix for Opera who doesn't always get readyStates right.
	 */
	this.transformed = false;
		
	/**
	 * Returns the URL of the XML document.
	 * 
	 * @return the URL of the XML document
	 * @type String
	 */
	this.getXml = function() {
		return this.xml;
	}
	
	/**
	 * Returns the XML document.
	 * 
	 * @return the XML document
	 */
	this.getXmlDocument = function() {
		return this.xmlDoc;
	}
	
	/**
	 * Sets the URL of the XML document.
	 * 
	 * @param x the URL of the XML document
	 * @return this
	 * @type Transformation
	 */
	this.setXml = function(x) {
		this.xml = x;
		return this;
	}
	
	/**
	 * Returns the URL of the XSLT document.
	 * 
	 * @return the URL of the XSLT document
	 * @type String
	 */
	this.getXslt = function() {
		return this.xslt;
	}
	
	/**
	 * Returns the XSLT document.
	 * 
	 * @return the XSLT document
	 */
	this.getXsltDocument = function() {
		return this.xsltDoc;
	}
	
	/**
	 * Sets the URL of the XSLT document.
	 * 
	 * @param x the URL of the XML document
	 * @return this
	 * @type Transformation
	 */
	this.setXslt = function(x) {
		this.xslt = x;
		return this;
	}
	
	/**
	 * Returns the callback function.
	 * 
	 * @return the callback function
	 */
	this.getCallback = function() {
		return this.callback;
	}
	
	/**
	 * Sets the callback function
	 * 
	 * @param c the callback function
	 * @return this
	 * @type Transformation
	 */
	this.setCallback = function(c) {
		this.callback = c;
		return this;
	}
	
	/**
	 * Returns the result document fragment
	 *
	 * @return the result document fragment
	 */
	this.getResult = function() {
		return this.resultDoc;
	}
	
	
	/**
	 * Sets the target element to write the transformed content to and <em>asynchronously</em>
	 * starts the transformation process.
	 * <p>
	 * <code>target</code> is the ID of an element. 2DO
	 * <p>
	 * This method may only be called after {@link #setXml} and {@link #setXslt} have
	 * been called.
	 * <p>
	 * Note that the target element must exist once this method is called. Calling
	 * this method before <code>onload</code> was fired will most likely
	 * not work.
	 * 
	 * @param target the ID of an element
	 */
	this.transform = function(target) {
		if (!browserSupportsXSLT()) {
			return;
		}
		var str = /^\s*</;
		var t = this;
		if (document.recalc) {
			var change = function() {
				var c = 'complete';
				if (xm.readyState == c && xs.readyState == c) {
					window.setTimeout(function() {
						this.xmlDoc = xm.XMLDocument;
						this.xsltDoc = xs.XMLDocument;
						this.callback(t);
						if(target) document.all[target].innerHTML = xm.transformNode(xs.XMLDocument);
					}, 50);
				}
			};
			
			var xm = document.createElement('xml');
			xm.onreadystatechange = change.bind(this);
			xm[str.test(this.xml) ? "innerHTML" : "src"] = this.xml;
			
			var xs = document.createElement('xml');
			xs.onreadystatechange = change.bind(this);
			xs[str.test(this.xslt) ? "innerHTML" : "src"] = this.xslt;
			
			with (document.body) {
				insertBefore(xm);
				insertBefore(xs);
			};
		}
		else {
			var transformed = false;

			var xm = {
				readyState: 4
			};
			var xs = {
				readyState: 4
			};
			var change = function() {
				if (xm.readyState == 4 && xs.readyState == 4 && !transformed) {
					this.xmlDoc = xm.responseXML;
					this.xsltDoc = xs.responseXML;
					var processor = new XSLTProcessor();
					
					if (typeof processor.transformDocument == 'function') {
						// obsolete Mozilla interface
						this.resultDoc = document.implementation.createDocument("", "", null);
						processor.transformDocument(xm.responseXML, xs.responseXML, this.resultDoc, null);
						var out = new XMLSerializer().serializeToString(this.resultDoc);
						this.callback(t);
						if(target) document.getElementById(target).innerHTML = out;
					}
					else {
						processor.importStylesheet(xs.responseXML);
						this.resultDoc = processor.transformToFragment(xm.responseXML, document);
						this.callback(t);
						if(target) document.getElementById(target).innerHTML = '';
						if(target) document.getElementById(target).appendChild(this.resultDoc);
					}
					
					transformed = true;
				}
			};

			if (str.test(this.xml)) {
				xm.responseXML = new DOMParser().parseFromString(this.xml, "text/xml");
			}
			else {
				xm = new XMLHttpRequest();
				xm.onreadystatechange = change.bind(this);
				xm.open("GET", this.xml);
				xm.send(null);
			}

			if (str.test(this.xslt)) {
				xs.responseXML = new DOMParser().parseFromString(this.xslt, "text/xml");
				change();
			}
			else if (typeof(this.xsltDoc) != 'undefined') {
				xs.responseXML = this.xsltDoc;
				change();
			}
			else {
				xs = new XMLHttpRequest();
				xs.onreadystatechange = change.bind(this);
				xs.open("GET", this.xslt);
				xs.send(null);
			}
		}
	}

}

/**
 * Returns whether the browser supports XSLT.
 * 
 * @return the browser supports XSLT
 * @type boolean
 */
function browserSupportsXSLT() {
	var support = false;
	if (document.recalc) { // IE 5+
		support = true;
	}
	else if (window.XMLHttpRequest != undefined && window.XSLTProcessor != undefined) { // Mozilla 0.9.4+, Opera 9+
		var processor = new XSLTProcessor();
		if (typeof processor.transformDocument == 'function') {
			support = window.XMLSerializer != undefined;
		}
		else {
			support = true;
		}
	}
	return support;
}

