const ipc = require('electron').ipcRenderer;

(function($) {
	"use strict";
	$(document).ready(function() {

		var path = null,
			listIds = [],
			$btnDownload = $('#btnDownload'),
			$list = $('#main-list'),
			currentVideoId = '',
			webview = document.getElementById('yt-view');

		webview.addEventListener('did-stop-loading', () => {
			currentVideoId = '';
			var url = webview.getURL();
			var arr = url.split('v=');
			if (arr.length > 1) {
				currentVideoId = arr[1].split('&')[0];
			}

			if (listIds.indexOf(currentVideoId) >= 0 || currentVideoId === '') {
				$btnDownload.addClass('disabled');
			} else {
				$btnDownload.removeClass('disabled');
			}
		});

		var putOnList = function() {
			if (listIds.indexOf(currentVideoId) < 0 && currentVideoId !== '') {

				listIds.push(currentVideoId);

				var isUntitled = true;

				var $item = $('<div class="item"/>').prependTo($list),
					$itemHeader = $('<div class="item-header"/>').appendTo($item),
					$itemPercent = $('<div class="item-header-right">0%</div>').appendTo($itemHeader),
					$itemTitle = $('<div class="item-header-left">Loading...</div>').appendTo($itemHeader),
					$itemBar = $('<div class="item-bar"/>').appendTo($item),
					$itemProgress = $('<div class="item-bar-progress"/>').appendTo($itemBar);

				YT.download(currentVideoId, {
					onProgress: function(data) {
						if (isUntitled) {
							var title = data.tit;
							$itemTitle.text(title).attr('title', title);
							isUntitled = false;
						}
						var count = Math.round(data.progress.percentage) + '%';
						$itemPercent.text(count);
						$itemProgress.css('width', count);
					},
					onFinish: function() {
						$item.addClass('ready');
					},
					onError: function(err) {
						$itemTitle.text('ERROR');
					}
				});
			}
		};

		$btnDownload.click(function() {
			if (path === null) {
				ipc.send('open-file-dialog');
			} else {
				putOnList();
			}
		});
		//
		ipc.on('selected-directory', function(event, p) {
			path = `${p}`;
			YT.init({
				'outputPath': path
			});
			putOnList();
		});
	});
})(jQuery);