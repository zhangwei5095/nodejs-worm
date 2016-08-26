var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
//write your url here
var url = 'http://www.iqiyi.com/v_19rrlye7qw.html#vfrm=2-3-0-1';
request(url, function(err, res, body) {
	if (!err) {
		acquireData(body)
	} else {
		console.log(err)
	}
});


function acquireData(data) {
	var $ = cheerio.load(data); //cheerio解析data

	// here is tagname you can choose by yourself
	var img = $('img').toArray();
	console.log(img.length)
	var len = img.length;
	for (var i = 0; i < len; i++) {
		var src = img[i].attribs.src;
		var filename = parseUrlForFileName(src);
		console.log(filename)
		downloadImg(src, filename, function() {
			console.log(filename + 'is done');
		})
	}
}

function parseUrlForFileName(address) {
	var filename = path.basename(address);
	return filename;
}

var downloadImg = function(uri, filename, callback) {
	request.head(uri, function(err, res, body) {
		// console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
		// console.log('content-length:', res.headers['content-length']);  //图片大小
		if (err) {
			console.log('err: ' + err);
			return false;
		}
		console.log('res: ' + res);
		request(uri).pipe(fs.createWriteStream('source/' + filename)).on('close', callback); //调用request的管道来下载到 images文件夹下
	});
};