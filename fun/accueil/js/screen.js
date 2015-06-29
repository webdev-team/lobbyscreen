
/*TWITTER TRICKS*/
window.twttr = (function (d,s,id) {
	var t, js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)){return;}
	js=d.createElement(s);
	js.id=id;
	js.src="https://platform.twitter.com/widgets.js";
	fjs.parentNode.insertBefore(js, fjs);
	return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
   }(document, "script", "twitter-wjs"));





/*
Name : NS_Global
Description : Global var and function
*/
		
var NS_Global = NS_Global || {};
	
	NS_Global.counterSlide 	= 0;
	NS_Global.goTo			= null;
	NS_Global.maxNews		= 16;
	NS_Global.video			= $('#video');
	NS_Global.logo			= $('#logo-fun');

	NS_Global.vignette13	= $('#vignette13');
	NS_Global.vignette14	= $('#vignette14');
	NS_Global.vignette15	= $('#vignette15');
	
	
	NS_Global.getRandom = function(array, previous){ 		//higher order function
		var rand = array[Math.floor(Math.random() * array.length)];
		if(previous && (previous === rand)){
			return NS_Global.getRandom(array, previous);
		}
		return rand;
	};

	NS_Global.getRandomNum = function(max, previous){
		var rand  = Math.floor(Math.random() * max);
		if(previous && (previous === rand)){
			return NS_Global.getRandomNum(max, previous);
		}
		return rand;
	};
	
	/*
	NS_Global.restartVideo = function(){
		NS_Global.video.currentTime = 0.1; //setting to zero breaks iOS 3.2, the value won't update, values smaller than 0.1 was causing bug as well.
		NS_Global.video.play();
	}

	//loop video
	NS_Global.video.on('ended', function(e){
		console.log(e);
	});*/
	
	NS_Global.init = function(){
		if(!NS_Global.counterSlide){
			sessionStorage.clear();
			NS_LiveInfo.hideLiveFrame();
			NS_SocialCount.hideSocialFrame();
			
			NS_GetNews.requester();
			NS_LiveInfo.requester();
			NS_SocialCount.getFbCount();
			NS_SocialCount.getTwCount();
		}
	};
	
					



/*
Name : NS_lobbyAnim
Description : Animate frames
*/

var NS_lobbyAnim	= NS_lobbyAnim || {};

	NS_lobbyAnim.container					= $('#container');		
	NS_lobbyAnim.vignetteHolder				= $('#vignette-holder');
	NS_lobbyAnim.vignettes					= NS_lobbyAnim.vignetteHolder.find('.vignette');
	NS_lobbyAnim.vignettesImg				= NS_lobbyAnim.vignetteHolder.find('.vignette img');
	NS_lobbyAnim.containerMove 				= ['tolayer1','tolayer2','tolayer3','tolayer4','tolayer5','tolayer6'];
	NS_lobbyAnim.previousContainerClass 	= 'tolayer2';
	NS_lobbyAnim.containerClass				= null;
	NS_lobbyAnim.counterSlide				= 0;
	
	NS_lobbyAnim.setAnimVignettes	=	function(){	
		NS_lobbyAnim.vignetteHolder.toggleClass('animate');
	};
	
	NS_lobbyAnim.setStartFrame = function(goTo,elem){
		NS_lobbyAnim.containerClass = goTo;

		if(NS_lobbyAnim.previousContainerClass){
			NS_lobbyAnim.container.removeClass(NS_lobbyAnim.previousContainerClass)
		}
		NS_lobbyAnim.container.addClass(NS_lobbyAnim.containerClass);
		NS_lobbyAnim.previousContainerClass = NS_lobbyAnim.containerClass;
		setTimeout(function(){NS_GetNews.fillFrame(elem)},3500);
	};

	NS_lobbyAnim.setEndFrame = function(){
//			NS_lobbyAnim.setAnimVignettes();
//			NS_lobbyAnim.setRestart();
	};

	NS_lobbyAnim.setRestart = function(){
		setTimeout(function(){
			NS_LiveInfo.hideLiveFrame();
			NS_SocialCount.hideSocialFrame();
			NS_lobbyAnim.vignetteHolder.removeClass('animate'); //once all the request are done we show the vignettes
		},7000);
		setTimeout(NS_GetNews.fillFrame,7500); //timed for css animation sequence					
	};
	
	
	
/*
Name : NS_GetNews
Description : get News funradio for the frames
*/
			
var NS_GetNews = NS_GetNews || {};
	
	NS_GetNews.previousInfo		= null;
	NS_GetNews.previousFrame	= null;
	
	NS_GetNews.requester = function(){															
		$.ajax({
			type: 'get',
			url:'http://services.funradio.fr/flux/articles.json?tags=funradio&nb='+NS_Global.maxNews,
			cache : false,
			dataType: 'jsonp',
			success: function(data, status, xhr){
				NS_GetNews.getData(data);
				
				$(window).trigger('newsReady');
			}
		});
	};
	
	NS_GetNews.getData = function(data){
		var _news = data.items;	
		$(_news).each(function(index,item){
			var _index = index;
			$(item).each(function(index,article){
				var _title 		= article.title;
				var _decription = article.description.value;

				if(typeof(article.enclosures[index]) === "object"){
					var _img	= article.enclosures[index].url;
				}else{
					var _img 	= "";
				}

				NS_GetNews.setBgVignette(NS_lobbyAnim.vignettesImg,_index,_img);
				NS_GetNews.storeHtmlNews(_title,_decription,_img,_index);
			});
		});
	};
	
	NS_GetNews.setBgVignette = function(coll,pos,src){
		coll[pos].src = src;
	};
	
	NS_GetNews.storeHtmlNews = function(title, desc,img,index){
		var _newsHtml = '<div class="template-news"><h1><span>'+title+'</span></h1></div>';
		sessionStorage.setItem(index,_newsHtml);
	};
	
	NS_GetNews.fillFrame = function(previuosFrame){
		if(NS_Global.counterSlide === 0){
			NS_Global.goTo	= 'tolayer1';
		}else{
			NS_Global.goTo = NS_Global.getRandom(NS_lobbyAnim.containerMove, NS_lobbyAnim.previousContainerClass);						
			setTimeout(function(){NS_GetNews.unfillFrame(previuosFrame)},750);
		}
		
		var _frame 	= NS_Global.goTo.split('to')[1];	
		var _key 	= NS_Global.getRandomNum(NS_Global.maxNews,NS_GetNews.previousInfo);
		var _html 	= sessionStorage.getItem(_key);
		
		$(_html).appendTo($('.'+_frame));
		NS_GetNews.previousInfo 	= _key;
		
		$(window).trigger('setShowFrame',$('.'+_frame));
	};
	
	NS_GetNews.unfillFrame = function(elem){
		if(elem){
			$(elem).empty();
		}
	};
	

	
/*
Name : NS_SocialCount
Description : get News funradio for the frames
*/

var NS_SocialCount = NS_SocialCount || {};
	NS_SocialCount.fbElem		= $('#facebook');
	NS_SocialCount.twElem		= $('#twitter');
	NS_SocialCount.fbCountElem	= $('#fb-count');
	NS_SocialCount.twCountElem	= $('#tw-count');
	
	NS_SocialCount.getFbCount = function(){
		$.ajax({
			type: 'get',
			url:'https://graph.facebook.com/?ids=funradio&callback=?',
			cache : false,
			dataType: 'jsonp',						
			success: function(data, status, xhr){						
				var _tmpCount = data.funradio.likes;
			
				var _tmpCountString = _tmpCount.toString();
				var _counterString = 0;
				var _finalString = "";
			
				for(var i=_tmpCountString.length-1, j=0; i>=j; i--){
					_counterString ++;
					_finalString += _tmpCountString[i];
					if((_counterString%3 === 0)  && _tmpCountString[i - 1]){
						_finalString += ".";
					}
					_tmpCount = _finalString.split("").reverse().join("");
				}
			
				NS_SocialCount.fbCountElem.text(_tmpCount);
			
				var _html = NS_SocialCount.fbElem.html();
				NS_Global.vignette13.html(_html);
				
				$(window).trigger('fbCountReady');
			},
			error: function(){
				return;
			}
		});
	};
	
	NS_SocialCount.showFbCount = function(){
		NS_SocialCount.fbElem.addClass('show');				
	};
	
	NS_SocialCount.getTwCount = function(){
		/*			
		$.ajax({
			type: 'get',
			url:'https://cdn.api.twitter.com/1/users/show.json?screen_name=funradio_fr&callback=?',
			cache : false,
			dataType: 'jsonp',
			success: function(data, status, xhr){
				var _tmpCount = data.followers_count;
												
				var _tmpCountString = _tmpCount.toString();
				var _counterString = 0;
				var _finalString = "";

				for(var i=_tmpCountString.length-1, j=0; i>=j; i--){
					_counterString ++;
					_finalString += _tmpCountString[i];
					
					if((_counterString%3 === 0) && _tmpCountString[i - 1]){
						_finalString += ".";
					}
					_tmpCount = _finalString.split("").reverse().join("");
				}
				
				NS_SocialCount.twCountElem.text(_tmpCount);
				
				var _html = NS_SocialCount.twElem.html();
				NS_Global.vignette14.html(_html);
				
				$(window).trigger('twCountReady');
			},
			error: function(){
				return;
			}
		});
		*/

		NS_SocialCount.twCountElem.text('736.345'); // super magic number. We need backend to send us the result since twitter api 1 is deprecated ... anyway
		var _html = NS_SocialCount.twElem.html();
		NS_Global.vignette14.html(_html);
				
		$(window).trigger('twCountReady');	
	};
	
	NS_SocialCount.showTwCount = function(){
		NS_SocialCount.twElem.addClass('show');
	};
	
	NS_SocialCount.hideSocialFrame = function(){
		NS_SocialCount.fbElem.removeClass('show');						
		NS_SocialCount.twElem.removeClass('show');					
	};
	
	
	
/*
Name : NS_LiveInfo
Description : get Live Info from funradio video live (thanks CORS)
*/

var NS_LiveInfo = NS_LiveInfo || {};
	
	NS_LiveInfo.container = $('#live');
	
	NS_LiveInfo.requester = function(){
		$.ajax({
			type: 'get',
			url:'http://www.funradio.fr/live/en-direct',
			cache : false,
			dataType: 'html',							
			success: function(data, status, xhr){
				
				NS_LiveInfo.container.empty();
				
				var response	= data.replace(/<script.*?<\/script>/gi, "");
				response		= response.match(/.*<body.*>([\s\S]*)<\/body>.*/)[1];
				
				NS_LiveInfo.container.append(response);
				NS_LiveInfo.container.append($('<span class="what">LIVE</span>'));
				NS_Global.vignette15.html(response);
				NS_Global.vignette15.append($('<span class="what">LIVE</span>'));
				
				$(window).trigger('liveInfoReady');																
			},
			error: function(){
				NS_LiveInfo.container.empty();
			}
		});
	};
	
	NS_LiveInfo.showLiveFrame = function(){
		NS_LiveInfo.container.addClass('show');
	};
	
	NS_LiveInfo.hideLiveFrame = function(){
		NS_LiveInfo.container.removeClass('show');

	};
			
			

//execution

NS_Global.init();

$(window).on({
	'newsReady':function(){
		NS_lobbyAnim.vignetteHolder.removeClass('animate'); //once all the request are done we show the vignettes
		setTimeout(NS_GetNews.fillFrame,500); //timed for css animation sequence
	},
	'setShowFrame':function(e,elem){
		NS_Global.logo.toggleClass('animate');
		
		switch(NS_Global.counterSlide){
			case 5:
				$('.layer').empty(); 										//empty the layer (news)
				NS_lobbyAnim.setAnimVignettes(); 							//hide the vignettes wall
				setTimeout(NS_SocialCount.showFbCount,500); 				//show fb count (wait 500ms for the css animation of the layer)
				setTimeout(function(){
					NS_LiveInfo.hideLiveFrame(); 							//hide live frame
					NS_SocialCount.hideSocialFrame(); 						//hide social frame
				},7000); 													//(the all package wait for 7s that lets us see the fb count for 7s)
				setTimeout(NS_lobbyAnim.setAnimVignettes,7250);				//show the vignettes wall
				setTimeout(NS_GetNews.fillFrame,7500); 						//timed for css animation sequence
				NS_Global.counterSlide ++;									//+1 on counterSlide
				return;
			break;
			case 10:
				$('.layer').empty();
				NS_lobbyAnim.setAnimVignettes();
				setTimeout(NS_LiveInfo.showLiveFrame,500);
				setTimeout(function(){
					NS_LiveInfo.hideLiveFrame();
					NS_SocialCount.hideSocialFrame();
				},7000);
				setTimeout(NS_lobbyAnim.setAnimVignettes,7250);				
				setTimeout(NS_GetNews.fillFrame,7500);
				NS_Global.counterSlide ++;
				return;								
			break;
			case 15:
				$('.layer').empty();
				NS_lobbyAnim.setAnimVignettes();
				setTimeout(NS_SocialCount.showTwCount,500);
				setTimeout(function(){
					NS_LiveInfo.hideLiveFrame();
					NS_SocialCount.hideSocialFrame();
				},7000);
				setTimeout(NS_lobbyAnim.setAnimVignettes,7250);				
				setTimeout(NS_GetNews.fillFrame,7500);
				NS_Global.counterSlide ++;
				return;
			break;
			case 20:
				NS_Global.counterSlide = 0;									//set counterSlide to 0;																					
				$('.layer').empty();
				NS_lobbyAnim.setAnimVignettes();
				setTimeout(NS_LiveInfo.showLiveFrame,500);
				setTimeout(function(){
					NS_LiveInfo.hideLiveFrame();
					NS_SocialCount.hideSocialFrame();
				},7000);
				setTimeout(NS_lobbyAnim.setAnimVignettes,7250);				
				setTimeout(NS_Global.init,7500);							//restart the all scenario
				return;
			break;
			default:
				NS_lobbyAnim.setStartFrame(NS_Global.goTo,elem);
				NS_Global.counterSlide ++;
			break;
		}
	}
});