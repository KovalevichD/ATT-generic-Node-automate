"use strict"
window.onload = function() {
	
	
	if (Enabler.isInitialized()) {
		init();
	} else {
	  	Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
	}

	function init() {
	  	if (Enabler.isPageLoaded()) {
	    	//Enabler.setProfileId(10486385);
	    	politeInit();
	  	} else {
	  		//Enabler.setProfileId(10486385);
	    	Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit);
	 	}
	};

	function politeInit(){		
	    console.log = function() {}
        
        var select = function(s) {
                return document.querySelector(s);
            },
            selectAll = function(s) {
                return document.querySelectorAll(s);
            },
            wrapper = select('#wrapper'),
            wrect = select('#wrect'),
            logo = select('#logo'),
            bgexit = select('#bgexit'),
            ctaInside = selectAll('.cta'),
            tl = new TimelineMax(),
            text1 = select('#text1'),
            text2 = select('#text2'),
            text3 = select('#text3'),
            text4 = select('#text4'),
            textevent = select('#textevent'),
            container = select('#container'),
            ctaURL;
        
        animate();
 
        
		function animate() {
            
            var total = 30, k = 0,
                w = container.offsetWidth,
                h = container.offsetHeight;

             for (var i = 0, div; i < total; i++) { 
                div = document.createElement('div');
                div.className='dot';
                container.appendChild(div);
                TweenMax.set(div, {x:R(0,w), y:R(-100, 0), opacity:1, scale:R(0,0.5)+0.5, backgroundColor:"hsl(" +R(0,200)+ ",80%,50%)"});
                animm(div);
             }

             function animm(elm){   
                 TweenMax.to(elm, R(0,5)+2, {y:h, ease:Linear.easeNone, repeat:-1, delay:-5});
                 TweenMax.to(elm, R(0,1)+1.5, {x:'+=30', repeat:-1, yoyo:true, ease:Sine.easeInOut});
                 TweenMax.to(elm, R(0,1)+0.5, {opacity:0.2, repeat:-1, yoyo:true, ease:Sine.easeInOut});
                 
                 TweenMax.to(elm, R(0,5)+1, {scaleX:'-0.5', rotation:'+=90', repeat:-1, yoyo:true, ease:Sine.easeInOut});
             }
            
            TweenMax.delayedCall(29, function(){
                TweenMax.killAll();
            })
            
            
			tl
            
            .to(wrect, 0.7, {alpha:0, ease:Linear.easeNone}, "st")
            
            .from([text1, text2], 0.5, {y:"-=100", alpha:0, ease:Sine.easeOut}, "st+=0.5")
            
            .to([text1, text2], 0.2, {y:"+=20", alpha:0, ease:Sine.easeIn}, "st+=3.5")
            .from([text3, text4], 0.5, {y:"-=100", alpha:0, ease:Sine.easeOut}, "st+=3.7")
            
            .to([text3, text4], 0.2, {y:"+=20", alpha:0, ease:Sine.easeIn}, "st+=6.5")
            .from(textevent, 0.5, {y:"-=100", alpha:0, ease:Sine.easeOut}, "st+=6.7")
            
            .call(function(){if(++k > 2) tl.pause();})
            
            .to(wrect, 0.3, {alpha:1, ease:Linear.easeNone, onComplete:function(){tl.restart();}}, "+=3")
            
            
           
		}
        
        function R(min, max){ return min + ( Math.random() * (max - min)) };
	};
}