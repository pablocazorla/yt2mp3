var YT = (function($) {
	"use strict";

	var vm = {},
		YoutubeMp3Downloader = require('youtube-mp3-downloader'),
		YD,
		callbacks = {};


	vm.init = function(obj) {
		var setting = $.extend({
			"ffmpegPath": `${__dirname}/ffmpeg`, // Where is the FFmpeg binary located? 
			"outputPath": `${__dirname}/mp3`, // Where should the downloaded and encoded files be stored? 
			"youtubeVideoQuality": "highest", // What video quality should be used? 
			"queueParallelism": 2, // How many parallel downloads/encodes should be started? 
			"progressTimeout": 2000 // How long should be the interval of the progress reports 
		}, obj);

		YD = new YoutubeMp3Downloader(setting);

		YD.on("progress", function(data) {
			callbacks[data.videoId].onProgress.apply(null,[data]);
		});

		YD.on("finished", function(data) {
			callbacks[data.videoId].onFinish.apply(null,[data]);
		});

		YD.on("error", function(error) {
			callbacks[data.videoId].onError.apply(null,[error]);
		});
	};

	vm.download = function(videoId, callbks){
		var cbks = $.extend({
			onProgress:function(d){},
			onFinish:function(d){},
			onError:function(e){}
		},callbks);
		callbacks[videoId] = cbks;
		YD.download(videoId);
	};
	return vm;
})(jQuery);