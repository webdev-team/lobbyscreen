
//DATE TRANSLATION
Locale.define('fr-FR', 'Date', {
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
	days:      ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
	dateOrder: ['date', 'month', 'year', '/']
});
Locale.use('fr-FR');
	
//CONFIG
	var config = {
				
		requester : {
			//URL_une				: 'tests/une.js', // locals tests only
			URL_une				: 'http://www.rtl.fr/redac/a-la-une.jsonp',
			URL_hitCount		: 'http://www.rtl.fr/redac/a-la-une/hit-count.jsonp',
			NUM_hitCountDelay 	: 20000
		},
				
		cube : {
			NUM_frontFaceDisplayDelay	: 4000,
			NUM_othersFacesDisplayDelay	: 6000,
			NUM_maxArticlesToDisplay	: 10,
			URL_fallbackFaceImage		: 'img/default-cover.gif'
		},

		live : {
			//URL_RTL_isLiveVideo		: 'tests/video.js', // locals tests only
			URL_RTL_isLiveVideo		: 'http://www.rtl.fr/redac/a-la-une.jsonp',
			URL_DM_isLiveVideo 		: 'https://api.dailymotion.com/video/k2pkmLiG8RxnWX2oiVy?fields=onair', // return live state on "k2pkmLiG8RxnWX2oiVy" video id
			NUM_checkLiveDelay		: 60000
		},
				
		grid : {
			NUM_pictureToLoadPrefetch 	: 1000
		}
		
	};


//GLOBAL VARS
	var NS_GlobalVars = NS_GlobalVars || {};
		
		NS_GlobalVars.body 		= document.body;
		NS_GlobalVars.grid 		= document.id('grid');
		NS_GlobalVars.wrapper 	= document.id('wrapper');
		
//DATE & TIME
	var NS_DateTime = NS_DateTime || {};
		
		NS_DateTime.elm_date 	= document.id('date');
		NS_DateTime.elm_mins 	= document.id('mins');
		NS_DateTime.elm_hours 	= document.id('hrs');
			
		if(NS_DateTime.elm_date && NS_DateTime.elm_mins && NS_DateTime.elm_hours){
			
			NS_DateTime.setTime = function() {
				var d = new Date();
				NS_DateTime.elm_hours.set('html', d.format('%H'));
				NS_DateTime.elm_mins.set('html', d.format('%M'));
			};
	
			NS_DateTime.setDate = function() {
				var d = new Date();
				NS_DateTime.elm_date.set('html', d.format('%A') +" "+ d.format('%d') + d.format(' %B'));
			};
	
			NS_DateTime.setTime(); // initially call
			NS_DateTime.setTime.periodical(60000); // periodical call every minutes
	
			NS_DateTime.setDate();
	
		}

//RANDOM WORDS POSITION
	if(NS_GlobalVars.grid){
		
		var NS_RedBoxs = NS_RedBoxs || {};
		
			NS_RedBoxs.setWords = function() {
				NS_RedBoxs.squares = NS_GlobalVars.grid.getElements('.js-square:not(.rows2):not(.bigger):not(.fat)');
				['listen', 'see', 'share'].each(function(word, index) {
					var rand = NS_RedBoxs.squares.getRandom().addClass('redbox').addClass(word);
					NS_RedBoxs.squares.erase(rand);
				});
			};
					
			NS_RedBoxs.setWords();
		
	}
	
//FONTSIZE VIEWPORT
	if(NS_GlobalVars.wrapper){
		
		var NS_FontsizeViewport = NS_FontsizeViewport || {};
		
			NS_FontsizeViewport.resize = function() { // useful to have dynamic size for fonts (and cube property's) on resize window
				var wrapperWIDTH = NS_GlobalVars.wrapper.getComputedSize().width; 
				var fontSize = wrapperWIDTH / NS_FontsizeViewport.initialState;
				NS_GlobalVars.body.setStyle('font-size', fontSize+'em');
			};

			NS_FontsizeViewport.initialState = 500; // template is based on 500px viewport width
			NS_FontsizeViewport.resize(); // initialy resize
			
			window.addEvent('resize', function(e) {
				NS_FontsizeViewport.resize();
			});
		
	}
		
//GRID
	if(NS_GlobalVars.grid){
		
		var NS_Grid = NS_Grid || {};

			NS_Grid.init = function(){

				if(!NS_GlobalVars.grid){
					return;
				}

				NS_Grid.squares 				= NS_GlobalVars.grid.getElements('.js-square:not(.redbox)');
				NS_Grid.flippers				= NS_GlobalVars.grid.getElements('.js-flipper');
				NS_Grid.pictures 				= [];
				NS_Grid.picturesFlipped 		= false;
				NS_Grid.firstPicturesLoad		= true;
				
				NS_Grid.setFlipPicturesDelay();

			};
		
			NS_Grid.picturesInit = function(datas) { // this function is called after ajax complete event, need datas here
				
				NS_Grid.pictures.empty(); // empty previous pictures
				
				// get all the pictures (if a picture is not present, take next)
				datas.each(function(item) {
					if(item.picture){
						NS_Grid.pictures.include(item.picture); // add new pictures
					}
				});
				
				// and include the first 10 pictures (NS_Grid.squares.length)
				if(NS_Grid.picturesFlipped){
					NS_Grid.setSquaresPictures(NS_Grid.pictures, true); // set the front face picture	
				}else {
					NS_Grid.setSquaresPictures(NS_Grid.pictures, false); // set the back face picture 
				}

				var _flipperTime = config.grid.NUM_pictureToLoadPrefetch; // allowing load image, be patient
				if(!_flipperTime || NS_Grid.firstPicturesLoad){_flipperTime = 0;}

				(function() {
					NS_Grid.flipPictures();
				}).delay(_flipperTime);
				
				NS_Grid.firstPicturesLoad = false;

			};

			NS_Grid.setSquaresPictures = function(pictures, frontFace) {

				NS_Grid.squares.each(function(square, index) {
					
					var _picture = pictures[index];
					if(!_picture){return;}
					
					var _face = null;
					if(frontFace){
						_face = square.getElement('.js-front'); // set the front face picture	
					}else {
						_face = square.getElement('.js-back'); // set the back face picture
					}

					// set the image when it's loaded
					Asset.image(_picture, {
					    onLoad: function() {
							NS_Grid.setImageBackground(_picture, _face);
						}
					});

				});

			};
			
			NS_Grid.setImageBackground = function(image, where) {
				where.setStyle('background-image', 'url('+image+')');
			};
			
			NS_Grid.setFlipPicturesDelay = function() {
				
				// add a "stairs effect" delay transition on flip effect, not useful, just for design purpose
				NS_Grid.squares.each(function(square, index) {
					var _flipper = square.getElement('.js-flipper');
					if(_flipper){
						var _time = (index+1)*100;
						_flipper.setStyles({
							'-webkit-transition-delay':_time+'ms',
							'-moz-transition-delay':_time+'ms',
							'-o-transition-delay':_time+'ms',
							'transition-delay':_time+'ms'
						});
					}
				});
				
			};
			
			NS_Grid.flipPictures = function() {
				if(NS_Grid.picturesFlipped){
					NS_Grid.flippers.removeClass('flip');
					NS_Grid.picturesFlipped = false;
				}else {
					NS_Grid.flippers.addClass('flip');
					NS_Grid.picturesFlipped = true;
				}
			};

			NS_Grid.init();
			
	}
	
//CUBE

	var NS_Cube = NS_Cube || {};
						
		NS_Cube.init = function() {
			
			NS_Cube.element = document.id('cube');
			
			if(!NS_Cube.element){
				return false;
			}
			
			NS_Cube.faces 					= NS_Cube.element.getElements('.js-face');
			NS_Cube.datas 					= [];
			NS_Cube.frontFaceDisplayTimer 	= null;
			NS_Cube.otherFacesDisplayTimer 	= null;
						
			NS_Cube.element.addEvent('faceDisplayed', function(face) {
				clearTimeout(NS_Cube.frontFaceDisplayTimer);
				// display article during NUM_othersFacesDisplayDelay ms 
				NS_Cube.frontFaceDisplayTimer = NS_Cube.resetFaceAndGoToArticle.delay(config.cube.NUM_othersFacesDisplayDelay, null, 'next'); 
			});
									
		};
		
		NS_Cube.fillFace = function(face, item) {
						
			var _faceContent = face.getElement('.js-face-content');
			if(!_faceContent){
				return false;
			}
			
			// set default image face
			NS_Cube.setImageBackground(config.cube.URL_fallbackFaceImage, _faceContent);

			// set the image when it's loaded
			var _picture = item.picture;
			if(_picture){
				Asset.image(_picture, {
				    onLoad: function() {
						NS_Cube.setImageBackground(_picture, _faceContent);
					}
				});
			}
									
		};
		
		NS_Cube.fillFaces = function(datas) {
			NS_Cube.faces.each(function(face, index) {
				_item = datas[index];
				if(_item){
					NS_Cube.fillFace(face, _item);
				}
			});
		};
		
		NS_Cube.setImageBackground = function(image, where) {
			where.setStyle('background-image', 'url('+image+')');
		};
		
		NS_Cube.setArticle = function(article) {

			if(!article){
				return false;
			}
			
			// select a random face
			var _face = NS_Cube.faces.getRandom();
			
			// fill it with image
			NS_Cube.fillFace(_face, article);
			
			// fill it with texts
			NS_Cube.setFaceTexts(_face, article);
			
			// show it
			NS_Cube.showFace(_face.get('data-face'));
			
			NS_Cube.element.fireEvent('faceDisplayed', _face);
			
		};
		
		NS_Cube.setFaceTexts = function(face, article) {
			var _faceContent = face.getElement('.js-face-content');
			if(!_faceContent){
				return false;
			}
			
			_faceContent.empty();
			
			var _tag = article.tag;
			if(_tag){
				new Element('span.tag', {
					'html' : _tag
				}).inject(_faceContent, 'top');
			}
			
			var _texts = new Element('section.texts');
			
			var _time = article.time;
			if(_time){
				var _span = new Element('span.time', {
					'html' : _time
				}).inject(_texts);
			}
			
			var _title = article.title;
			if(_title){
				var _h2 = new Element('h2.title', {
					'html' : _title
				}).inject(_texts);
			}

			if(_h2){
				_texts.inject(_faceContent, 'bottom');
			}
			
		};
		
		NS_Cube.showFace = function(face) {
			NS_Cube.element.setProperty('data-show', face);
		};
		
		NS_Cube.start = function(datas) {

			if(!datas || datas.length < 1){
				return false;
			}
			
			clearTimeout(NS_Cube.frontFaceDisplayTimer);
			clearTimeout(NS_Cube.otherFacesDisplayTimer);
			
			NS_Cube.articleActive = 0;
			
			NS_Cube.datas.empty(); // empty previous datas
			NS_Cube.datas = datas;
			NS_Cube.articlesLength = NS_Cube.datas.length;
			
			NS_Cube.fillFaces(NS_Cube.datas); // display an image on every cube faces, just for design purpose
			NS_Cube.resetFaceAndGoToArticle("index", NS_Cube.articleActive);
			
		};
		
		NS_Cube.resetFaceAndGoToArticle = function(way, article) {
			
			NS_Cube.showFace('front'); // show front face
			
			clearTimeout(NS_Cube.otherFacesDisplayTimer);
			NS_Cube.otherFacesDisplayTimer = NS_Cube.toArticle.delay(config.cube.NUM_frontFaceDisplayDelay, null, [way, article]);
		};
		
		NS_Cube.toArticle = function(way, index) {

			switch(way){
				case "next":
					NS_Cube.articleActive += 1;
				break;
				case "index":
					NS_Cube.articleActive = index;
				break;
			}

			if( (NS_Cube.articleActive > NS_Cube.articlesLength-1) || (NS_Cube.articleActive > config.cube.NUM_maxArticlesToDisplay-1) ){
				if(NS_Requester){
					NS_Requester.getNewsDatas(); // if NS_Requester, get new news datas
					return false;
				}else {
					NS_Cube.articleActive = 0; // loop
				}
			}

			NS_Cube.setArticle(NS_Cube.datas[NS_Cube.articleActive]);

		};
		
		NS_Cube.init();

		
//HITCOUNT
	var NS_HitCount = NS_HitCount || {};
	
		NS_HitCount.setCounter = function(count) {
			if(NS_HitCount.elm_counter){
				NS_HitCount.elm_counter.set('html', count);
				if(NS_HitCount.elm_read){
					NS_HitCount.elm_read.show();
				}
			}	
		};
	
		NS_HitCount.elm_counter = document.id('counter');
		NS_HitCount.elm_read = document.id('read');

//LIVE DM
	var NS_LiveDM = NS_LiveDM || {};

		NS_LiveDM.init = function(){

			NS_LiveDM.DMContainer = document.id('flash-container');
			
			NS_LiveDM.request = new Request.JSONP({
				link : 'chain',
				noCache : true,
				timeout : 10000,
				onRequest : function(url){

					// stop the chain request if the RTL video service is off
					if(NS_LiveDM.stopRequest){
						this.cancel();
						NS_LiveDM.stopRequest = false;
					}

				},
				onComplete: function(datas){
					NS_LiveDM.onComplete(datas);
				}
			});

			NS_LiveDM.liveRTLReady		= false;
			NS_LiveDM.liveDMReady		= false;
			NS_LiveDM.stopRequest	 	= false;
			NS_LiveDM.URL_RTLREQUEST 	= config.live.URL_RTL_isLiveVideo;
			NS_LiveDM.URL_DMREQUEST	 	= config.live.URL_DM_isLiveVideo;

			NS_LiveDM.sendRequests(); // init call
			NS_LiveDM.sendRequests.periodical(config.live.NUM_checkLiveDelay); // periodical call

		};

		NS_LiveDM.onComplete = function(datas){

			if(!datas){
				return false;
			}

			if(NS_LiveDM.request.options.rtl){
				if(datas.show && datas.show.video){
					NS_LiveDM.liveRTLReady = true;
				}else {
					NS_LiveDM.liveRTLReady = false;
					NS_LiveDM.stopRequest = true;
				}
			}

			if(NS_LiveDM.request.options.dm){
				if(datas.onair){
					NS_LiveDM.liveDMReady = true;
				}else {
					NS_LiveDM.liveDMReady = false;
				}
			}

			NS_LiveDM.isPlaying();

		};

		NS_LiveDM.sendRequests = function(){
			NS_LiveDM.request.send({'url':NS_LiveDM.URL_RTLREQUEST,'dm':false,'rtl':true});
			NS_LiveDM.request.send({'url':NS_LiveDM.URL_DMREQUEST,'dm':true,'rtl':false});
		};

		NS_LiveDM.isPlaying = function() {
			if(!NS_LiveDM.DMContainer){
				return;
			}
			if(NS_LiveDM.liveRTLReady && NS_LiveDM.liveDMReady){
				NS_LiveDM.DMContainer.removeClass('off');
			}else {
				NS_LiveDM.DMContainer.addClass('off');
			}
		};

		NS_LiveDM.init();

		
//JSON REQUESTER
	var NS_Requester = NS_Requester || {};
		
		NS_Requester.onComplete = function(datas) {

			if(!datas){
				return;
			}
			
			// a la une datas
			if(datas.items){
				NS_Requester.newsData = datas.items;
				if(NS_GlobalVars.grid){
					NS_Grid.picturesInit(NS_Requester.newsData);
				}
				if(NS_Cube.element){
					NS_Cube.start(NS_Requester.newsData);
				}
			}
			
			// hit count datas
			if(datas.formattedCount && NS_HitCount) {
				NS_HitCount.setCounter(datas.formattedCount);
			}
			
		};
		
		NS_Requester.getNewsDatas = function() {
			NS_Requester.news.send();
		};
		
		NS_Requester.getHitCountDatas = function() {
			NS_Requester.hitCount.send();
		};
		
		NS_Requester.newsData = [];
			
		NS_Requester.news = new Request.JSONP({
			url : config.requester.URL_une,
			link : 'cancel',
			onComplete : function(datas) {
				NS_Requester.onComplete(datas);
			}
		});
				
		NS_Requester.hitCount = new Request.JSONP({
			url : config.requester.URL_hitCount,
			link : 'cancel',
		    onComplete: function(datas) {
				NS_Requester.onComplete(datas);
			}
		});
		
		//initially calls
		NS_Requester.getNewsDatas();
		NS_Requester.getHitCountDatas();
		
		//periodical calls
		NS_Requester.getHitCountDatas.periodical(config.requester.NUM_hitCountDelay);
