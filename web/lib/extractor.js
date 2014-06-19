var http = require('http');
var https = require('https');
var url = require('url');
var imagesize = require('imagesize');
var async = require('async');
var request = require('request');

// var r = request.defaults({'proxy':'http://proxy.mta.ac.il:8080'})
var r = request.defaults({})

// Javascript OOP, see:
// 1. http://webreflection.blogspot.co.il/2008/04/natural-javascript-private-methods.html
// 2. http://javascript.crockford.com/private.html

//=======================================================
// basic extend function
//=======================================================
function extend(B, A){
    function I(){};
    I.prototype = A.prototype;
    B.prototype = new I;
    B.prototype.constructor = B;
    B.prototype.parent = A;
};

//=======================================================
// Base class for Url Analyzing
//=======================================================

// empty constructor
function UrlAnalyzer() {
};

UrlAnalyzer.prototype = (function(){

    // private methods
	function handleEmbed(self) {
	}
	
	function handleImage(self, images, image, id) {
		var url2analyze = self.url2analyze;
	
		// resolve to absolute path
		image = url.resolve(url2analyze, image);
		if(!(image.trim().substring(0,4) == "http")) {
			image = "http://" + image;
		}
		if(image in images) {
			// TODO: image that appears more than once in page should have lower score
		}
		else {
			// TODO: 
					//		var alt = $(element).attr('alt');
					// having an alt should raise image score, especially if alt = logo or a word from title
			// add to images
			images[image] = {"id": id};
			var loader;
			if((image.trim().substring(0,5)) == "https") {
				loader = https;
			}
			else {
				loader = http;
			}
			
			var image_request = loader.get(image, function (response) {
			  imagesize(response, function (err, result) {
				if(err) {
					// mark this image in the candidates map as invalid
					images[image].bad = true;
				}
				else if(result != undefined) {
					// do something with result
					//console.log("image info " + i + ": " + result.height + ", " + result.width);
					images[image].width = result.width;
					images[image].height = result.height;
				}
				// we don't need more data
				image_request.abort();
			  });
			});
		}
	}

	function handleText(self, texts, text, id) {
		if(text in texts) {
			// TODO: text that appears more than once in page should have higher score
		}
		else {
			texts[text] = {"id": id};
		}
	}
	
	function analyze() {
		var url2analyze = this.url2analyze;
		var urlInfo = this.urlInfo;
		var self = this;

		var cheerio = require('cheerio');

		var callback = function() {
			
			return function(error, response, body) {

				// TODO: need to convert from page charset to UTF-8

			    if (!error && response.statusCode == 200) {

			        // console.log(body);

			                var $ = cheerio.load(body);

							handleEmbed(self);

							// og metadata
			                $("meta[property^='og:']").each(function(i, element) {
								//console.log("og property " + i + " " + $(element).attr('property') + ": " + $(element).attr('content') );
								var og_property = $(element).attr('property');
								if(og_property == "og:image" || (og_property.indexOf("og:image") > -1 && og_property.indexOf("url") > -1 )) {
									var image = $(element).attr('content');
									handleImage(self, urlInfo.images, image, "og-image-" + i);
								}
								else if($(element).attr('property') == "og:title") {
									var title = $(element).attr('content');
									handleText(self, urlInfo.titles, title, "og-title-" + i);
								}
								else if($(element).attr('property') == "og:description") {
									var description = $(element).attr('content');
									handleText(self, urlInfo.descriptions, description, "og-description-" + i);
								}
							});

			                // Images
			                $('img').each(function(i, element) {
								var image = $(element).attr('src');
								if(image != undefined) {
									handleImage(self, urlInfo.images, image, "img-" + i);
								}
							});

			                // Icons
							$("link[rel='icon']").each(function(i, element) {
								var icon = $(element).attr('href');
								if(icon != undefined) {
									handleImage(self, urlInfo.icons, icon, "icon-" + i);
								}
							});
							
			                // Title
			                $('title').each(function(i, element) {
								var title = $(element).text();
								handleText(self, urlInfo.titles, title, "title-" + i);
							});

			                // Meta Title
			                $("meta[name='title']").each(function(i, element) {
								var title = $(element).attr('content');
								handleText(self, urlInfo.titles, title, "meta-title-" + i);
							});

			                // Meta Description
			                $("meta[name='description']").each(function(i, element) {
								var description = $(element).attr('content');
								handleText(self, urlInfo.descriptions, description, "meta-description-" + i);
							});

			                // keywords
			                $("meta[name='keywords']").each(function(i, element) {
								var keywords_item = $(element).attr('content');
								handleText(self, urlInfo.keywords,  keywords_item, "meta-keywords-" + i);
							});

			                // news_keywords
			                $("meta[name='news_keywords']").each(function(i, element) {
								var keywords_item = $(element).attr('content');
								handleText(self, urlInfo.keywords,  keywords_item, "meta-news-keywords-" + i);
							});
											
			                // title - h1
			                $("h1").each(function(i, element) {
								var title = $(element).text();
								handleText(self, urlInfo.titles, title, "h1-title-" + i);
							});

			                // TODO:  CSS files
							/*
								$("link[rel='stylesheet']").each(function(i, element) {

									console.log("css: " + $(element).attr('href'));
								
									// TODO:
									// Need to parse the CSS and look for:
									// 1. background-image: url("image.gif");
									// 2. background: #00ff00 url('smiley.gif') no-repeat fixed center; 
									// 3. selector with image in css, like: #home{background:url('img_navsprites.gif') 0 0;}
									// 4. recognize image sprites

								});
							*/

			                // TODO: background images in internal style
							/*
							        console.log("style - background image:");    

							        $('div').each(function(i, element) {

								        var style = $(element).attr('style');

								        if(style && style.indexOf('background:url') != -1) {

											console.log("css_image: " + style);

									}

								});
							*/

			    }
			    else {

			        urlInfo.error = {"message": error};

		            if(response) {
						urlInfo.error.responseStatusCode = response.statusCode;
			        }

			    }
				
			}
		}();

		var options = {

		    url: url2analyze,

		    headers: {

		        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36'

		    }

		};

		// TODO: if no "good" results, try fallback for: (a) domain only, (b) if we are in https, try fallback to http

		r(options, callback);

	
	}

    // prototype
    return {

        constructor:UrlAnalyzer,

        analyze:function(){

            // call private analyze method
            // in a more natural way
            return this._(analyze)();
        },
		
		getUrlInfo:function(){
			return this.urlInfo;
		},

		setData:function(url2analyze, protocol, host, domain, urlInfo){
			this.url2analyze = url2analyze;
			this.protocol = protocol;
			this.host = host;
			this.domain = domain;	
			this.urlInfo = urlInfo;
		},

		// define private methods dedicated one
        _:function(callback){

            // instance referer
            var self = this;

            // callback that will be used
            return function(){
                return callback.apply(self, arguments);
            };
        }
    };
})();
//=======================================================

//=======================================================
// YouTubeAnalyzer
//=======================================================
// empty constructor
function YouTubeAnalyzer(){
};
extend(YouTubeAnalyzer, UrlAnalyzer);

// extend prototype and return them
YouTubeAnalyzer.prototype = (function(proto){

	function handleEmbed(self) {
		console.log("in youtube handle embed");
	}

    proto.handleEmbed = function(){
        this.parent.prototype.handleEmbed.call(this);
		this._(handleEmbed)();
    };

    proto.analyze = function(){
        this.parent.prototype.analyze.call(this);
		this._(handleEmbed)();
    };

    proto._ = function(callback){
        var self = this;
        return function(){
            return callback.apply(self, arguments);
        };
    };

    return proto;
})(YouTubeAnalyzer.prototype);

//=======================================================


function getAnalyzer(url2analyze) {
	// [1] fix the url
	// remove trainling "/" from url to analyze
	if(url2analyze.substring(url2analyze.length - 1) == '/')
	{
		url2analyze = url2analyze.substring(0, url2analyze.length - 1);
	}
	if(!(url2analyze.substring(0,4) == "http")) {
		url2analyze = "http://" + url2analyze;
	}
	var url2analyzeObject = url.parse(url2analyze);

	// [2] get protocol, host and domain separated
	var protocol = url2analyzeObject.protocol + "//";
	var host = url2analyzeObject.host;
	var domain = protocol + host;

	// [3] get actual analyzer by host (or default)
	// TODO: use a more elegant factory, based on external map of host to constructor function...
	var analyzer;
	console.log("host: " + host);
	if(host == "www.youtube.com") {
		analyzer = new YouTubeAnalyzer();
		console.log("YoutubeAnalyzer!!!");
	} else {
		analyzer = new UrlAnalyzer();
	}
	
	// [4] set all the relevant data into the analyzer
	var urlInfo = {titles: {}, descriptions: {}, icons: {}, images: {}, keywords: {}, embeds: {} };	
	analyzer.setData(url2analyze, protocol, host, domain, urlInfo);
	
	// [5] return
	return analyzer;
	
}

exports.analyze = function(url2analyze, timeout, callback) {

	// [1] get analyzer by domain (or default if no specific analyzer for this domain)
	var analyzer = getAnalyzer(url2analyze);
	
	// [2] do the actual analysis
	analyzer.analyze();

	// [3] if we reach timeout, we return the urlInfo as is
	var timeoutObject = setTimeout(function() {
		callback(analyzer.getUrlInfo());
	}, timeout);
	
	// TODO
	// sync the tasks to know when we are definitely done
	// see: http://stackoverflow.com/questions/10551499/simplest-way-to-wait-some-asynchronous-tasks-complete-in-javascript 
	
	// here we know that all data is retrieved and set	
	// timeoutObject.clearTimeout();

	// function returns empty urlInfo
	return analyzer.getUrlInfo();
	
}
