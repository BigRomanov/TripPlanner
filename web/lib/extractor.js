var http = require('http');
var https = require('https');
var url = require('url');
var imagesize = require('imagesize');
var async = require('async');
var request = require('request');

// var r = request.defaults({'proxy':'http://proxy.mta.ac.il:8080'})
var r = request.defaults({})

function handleImage(url2analyze, images, image, id) {
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

function handleText(url2analyze, texts, text, id) {
	if(text in texts) {
		// TODO: text that appears more than once in page should have higher score
	}
	else {
		texts[text] = {"id": id};
	}
}

exports.analyze = function(url2analyze, timeout) {

	var urlInfo = {titles: {}, descriptions: {}, icons: {}, images: {}, keywords: {}, embeds: {} };

	// if we reach timeout, we return the urlInfo as is
	var timeoutObject = setTimeout(function() {
		return urlInfo;
	}, timeout);
	
	// TODO
	// sync the tasks to know when we are definitely done
	// see: http://stackoverflow.com/questions/10551499/simplest-way-to-wait-some-asynchronous-tasks-complete-in-javascript 

	// remove trainling "/" from url to analyze
	if(url2analyze.substring(url2analyze.length - 1) == '/')
	{
		url2analyze = url2analyze.substring(0, url2analyze.length - 1);
	}
	if(!(url2analyze.substring(0,4) == "http")) {
		url2analyze = "http://" + url2analyze;
	}
	var url2analyzeObject = url.parse(url2analyze);

	var protocol = url2analyzeObject.protocol + "//";
	var domain = protocol + url2analyzeObject.host;


	var cheerio = require('cheerio');

	function callback(error, response, body) {

		// TODO: need to convert from page charset to UTF-8

	    if (!error && response.statusCode == 200) {

	        // console.log(body);

	                var $ = cheerio.load(body);

					// og metadata
	                $("meta[property^='og:']").each(function(i, element) {
						//console.log("og property " + i + " " + $(element).attr('property') + ": " + $(element).attr('content') );
						var og_property = $(element).attr('property');
						if(og_property == "og:image" || (og_property.indexOf("og:image") > -1 && og_property.indexOf("url") > -1 )) {
							var image = $(element).attr('content');
							handleImage(url2analyze, urlInfo.images, image, "og-image-" + i);
						}
						else if($(element).attr('property') == "og:title") {
							var title = $(element).attr('content');
							handleText(url2analyze, urlInfo.titles, title, "og-title-" + i);
						}
						else if($(element).attr('property') == "og:description") {
							var description = $(element).attr('content');
							handleText(url2analyze, urlInfo.descriptions, description, "og-description-" + i);
						}
					});

	                // Images
	                $('img').each(function(i, element) {
						var image = $(element).attr('src');
						if(image != undefined) {
							handleImage(url2analyze, urlInfo.images, image, "img-" + i);
						}
					});

	                // Icons
					$("link[rel='icon']").each(function(i, element) {
						var icon = $(element).attr('href');
						if(icon != undefined) {
							handleImage(url2analyze, urlInfo.icons, icon, "icon-" + i);
						}
					});
					
	                // Title
	                $('title').each(function(i, element) {
						var title = $(element).text();
						handleText(url2analyze, urlInfo.titles, title, "title-" + i);
					});

	                // Meta Title
	                $("meta[name='title']").each(function(i, element) {
						var title = $(element).attr('content');
						handleText(url2analyze, urlInfo.titles, title, "meta-title-" + i);
					});

	                // Meta Description
	                $("meta[name='description']").each(function(i, element) {
						var description = $(element).attr('content');
						handleText(url2analyze, urlInfo.descriptions, description, "meta-description-" + i);
					});

	                // keywords
	                $("meta[name='keywords']").each(function(i, element) {
						var keywords_item = $(element).attr('content');
						handleText(url2analyze, urlInfo.keywords,  keywords_item, "meta-keywords-" + i);
					});

	                // news_keywords
	                $("meta[name='news_keywords']").each(function(i, element) {
						var keywords_item = $(element).attr('content');
						handleText(url2analyze, urlInfo.keywords,  keywords_item, "meta-news-keywords-" + i);
					});
									
	                // title - h1
	                $("h1").each(function(i, element) {
						var title = $(element).text();
						handleText(url2analyze, urlInfo.titles, title, "h1-title-" + i);
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


	var options = {

	    url: url2analyze,

	    headers: {

	        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36'

	    }

	};

	// TODO: if no "good" results, try fallback for: (a) domain only, (b) if we are in https, try fallback to http

	r(options, callback);

	
	
	// here we know that all data is retrieved and set	
	// timeoutObject.clearTimeout();

	// console.log("%j", urlInfo);
	return urlInfo;
	
}





 



