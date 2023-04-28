function cdVideoController($scope, $sce, $window, i18n, cdAnalytics, $timeout) {
	var c = this;
	var youtubePlayers = {};
	var contentsViewed = {};
	var contentsPlayed = {};
	var defaultRotationState = false; //pause auto-rotate by default

	c.i18n = i18n;
	c.playCarousel = false; //paused carousel state by default
	c.isFocused = false;
	c.isHovered = false;
	c.activeIndex = 0;
	
	c.handleMouseOver = function(event) {
		c.isHovered = true;
		c.updateRotation();
	};

	$scope.preventDefault = function($event) {
		$event.preventDefault();
	};
	
	c.handleMouseOut = function() {
		c.isHovered = false;
		c.updateRotation();
	};
	
	c.handleFocusIn = function(event) {
		if(event.shiftKey && event.keyCode == 9)
			c.isFocused = false;
		else if(event.keyCode == 9)
			c.isFocused = true;
		c.updateRotation();
	};
	
	c.handleFocusOut = function(event) {
		if(event.shiftKey && event.keyCode == 9)
			c.isFocused = true;
		else if(event.keyCode == 9)
			c.isFocused = false;
		c.updateRotation();
	};
	
	c.updateFocusVariable = function() {
		if(event.target.id == 'toggleVideoCarousel')
			c.isFocused = false;
		else if($(event.target).hasClass('right')) 
			c.isFocused = true;
		c.updateRotation();
	};
	
	c.updateRotation = function() {
		var $videoCarousel = c.$video.find('.carousel');
		if(c.playCarousel && !c.isFocused && !c.isHovered){
			if(defaultRotationState == false){
				defaultRotationState = true;
				c.startCarousel();
			}
			else{
				$videoCarousel.carousel('cycle');
			}
		}
		else{
			$videoCarousel.carousel('pause');
		}
	};
	
	c.toggleVideoCarousel = function(event) {
		if(event.keyCode === 32)
			event.preventDefault();
		c.playCarousel = !c.playCarousel;
		c.updateRotation();
	};

	c.multipleSlides = function() {
		return c.data.items.length > 1;
	};

	c.loadData = function(callback) {
		c.server.get({action: 'loadData'}).then(callback);
	};

	c.loadData(onDataLoad);

	c.startCarousel = function () {
		var $videoCarousel = c.$video.find('.carousel');
		$videoCarousel.carousel('cycle');
		
		$videoCarousel.on('slide.bs.carousel', function (e) {
			var index = e.relatedTarget.getAttribute('data-idx');
			closeCarouselInfoPopovers();
			// pause the carousel when it fully cycles to the beginning
			if (index == 0)
				// need to add delay or carousel will not obey order
				$scope.$applyAsync(function() {
					c.playCarousel = false;
					$videoCarousel.carousel('pause');
				});
		});
	};
	
	c.swipeRight = function() {
		c.$video.find('.left.carousel-control').click();
		c.$video.find('.carousel-indicator.active').focus();
	};
	
	c.swipeLeft = function() {
		c.$video.find('.right.carousel-control').click();
		c.$video.find('.carousel-indicator.active').focus();
	};
	
	c.clickItem = function(index) {
		c.activeIndex = index;
		c.selectItem(c.data.items[index]);
	};

	c.selectItem = function(item) {
		c.activeItem = item;
	};

	$scope.$on('youtubeIframeAPIReady', function() {
		setupPlayer(0);
	});

	function closeCarouselInfoPopovers() {
		jQuery('#' + c.data.spInstanceId).find('.preview-info-popup').removeClass('active').popover('hide');
	}

	c.getNumOpenPopovers = function getNumOpenPopovers() {
		return jQuery("#" + c.data.spInstanceId).find(".preview-info-popup.active").length;
	};

	function onDataLoad(response) {
		trustURL(response);
		setupTracking();
		c.selectItem(c.data.items[c.activeIndex]);
	}

	//Helper method for Whitelisting URLs
	function trustURL(response) {
		c.data = response.data;

		for(var item in c.data.items)
			c.data.items[item].url = $sce.trustAsResourceUrl(c.data.items[item].url);
	}

	//Sets up tracking
	function setupTracking() {
		// If there is no data, return
		if (!c.data || !c.data.items || c.data.items.length == 0)
			return;

		// Timeout to ensure the widget has rendered
		$timeout(function(){
			// Setup the first player
			setupPlayer(0);

			// Track an impression for the first player
			trackImpression(c.data.items[0]);

			// When the carousel slides...
			$('#' + c.data.spInstanceId).on('slid.bs.carousel', function (e) {
				stopVideos();

				// Setup the youtube player for the current video
				var idx = parseInt($(e.relatedTarget).attr('data-idx'));
				setupPlayer(idx);
				c.activeIndex = idx;
				c.selectItem(c.data.items[idx]);

				// Track an impression
				var bItem = c.data.items[idx];
				trackImpression(bItem);
				
				var $tabs = c.$video.find('.carousel-indicator');
				$tabs.each(function(){
					if($(this).hasClass('active')) {
						$(this).attr('aria-selected', true);
						$(this).attr('tabindex',0);
					}
					else {
						$(this).attr('aria-selected', false);
						$(this).attr('tabindex',-1);
					}
				});
			});
			
			var $videoCarousel = c.$video.find('.carousel');
			$videoCarousel.carousel({
				interval: 1000 * 10
			});
			$videoCarousel.carousel('pause');
		});
	}

	function stopVideos() {
		for(var i in c.data.items) {
			var item = c.data.items[i];
			var elId = 'video_' + i + '_' + c.data.spInstanceId;

			if (item.video_source === 'youtube') {
				if (elId in youtubePlayers && youtubePlayers[elId] && youtubePlayers[elId].pauseVideo)
					youtubePlayers[elId].pauseVideo();
			}
			else {
				//Setting src to itself will refresh the video
				angular.element('#' + elId)[0].src = angular.element('#' + elId)[0].src;
			}
		}
	}

	function trackImpression(videoItem) {
		var contentName = videoItem.title + '-' + videoItem.sys_id;

		// Don't overdo it with tracking video impressions.
		// Only track each video once per page load
		if (!c.data.isContentPreview && !(contentName in contentsViewed)) {
			cdAnalytics.trackEvent('Video Impression', videoItem);
			contentsViewed[contentName] = true;
		}
	}

	function setupPlayer(idx) {
		// If we don't have any data, nothing to setup yet
		if (!c.data || !c.data.items || c.data.items.length === 0)
			return;

		var videoPreviewId = c.data.spInstanceId ? c.data.spInstanceId : '';
		var videoElId = 'video_' + idx + '_' + videoPreviewId;
		var youtubeClass = 'youtube-embedded-' + videoPreviewId;
		var youtubeEl = $('#' + videoElId + '.' + youtubeClass);

		if (youtubeEl.length > 0)
			setupYoutubePlayer(idx, videoElId);
	}

	function setupYoutubePlayer(itemIdx, elId) {
		// If youtube is not defined,
		// or if a "player" object has already been created for the video
		// return
		if (typeof YT === 'undefined' || typeof YT.Player === 'undefined' || elId in youtubePlayers)
			return;

		$timeout(function() {
			var item = c.data.items[itemIdx];
			var p = new YT.Player(elId, {
				height: '400',
				width: '100%',
				videoId: c.data.items[itemIdx].video_source_id,
				playerVars: c.data.items[itemIdx].player_vars,
				events: {
					onStateChange: function(evt) {
						var contentName = item.title + '-' + item.sys_id;
						if (!c.data.isContentPreview && YT && evt.data === YT.PlayerState.PLAYING && !(contentName in contentsPlayed)) {
							cdAnalytics.trackEvent('Video Played', item);
							contentsPlayed[contentName] = true;
						}
					}
				}
			});

			youtubePlayers[elId] = p;
		});
	}
	
		/*function to make 'a' tags spacebar & enter key pressable. Corresponds to Left & Right carousel conntrols*/
    $scope.handleKeyBoardEvent = function (event) {
        if (event.keyCode === 32 || event.keyCode == 13) {
            event.preventDefault();
            $timeout(function () {
                event.target.click();               
            }, 0);
        }
    }
}
