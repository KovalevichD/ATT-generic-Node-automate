"use strict"
window.onload = function() {
/******************** ENABLER  ********************/     
	if (Enabler.isInitialized()) {
		init();
	} else {
	  	Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
	}

	function init() {
	  	if (Enabler.isPageLoaded()) {
	    	//Enabler.setProfileId(10522275);
	    	politeInit();
	  	} else {
	  		//Enabler.setProfileId(10522275);
	    	Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit);
	 	}
	};
/***************** //end ofENABLER  *****************/ 

	function politeInit(){		
//	    console.log = function() {}
        
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
            orangelines = selectAll('.orangeline'),
            tl = gsap.timeline(),
            text1 = select('#text-1-Wrap'),
            text2 = select('#text-2-Wrap'),
            textevent = select('#textevent'),
            sloganPart1 = select('#slogan-part1'),
            sloganPart2 = select('#slogan-part2'),
            eventTitle = select('#event-title'),
            eventLocation = select('#text5'),
            eventTime = select('#text6'),
            eventDate = select('#text7');
       
        animate();
        
		function animate() {
                
            tl
            .to(wrect, {duration: 0.5, alpha:0, ease:"none"})
            
            .from(logoitem, {duration:0.8, y:"-=230", ease:"power2"}, "<0.5")
            .from(orangelines, {duration:0.8, x:"+=80", width:0, ease:"power2"}, "<")
            
            .from(logo, {duration:1.2, force3D:true, rotation:0.01, height:300, ease:"power2.inOut"}, ">")
            .from(footer, {duration:1.2, force3D:true, rotation:0.01, height:300, ease:"power2.inOut"}, "<")
            
            .from(slogan, {duration:0.6, y:"-=50", scale:0, alpha:0, ease:"power2"}, "<0.8")
            
            .from(text1, {duration:0.6, y:"-=100", alpha:0, ease:"power3"}, ">")
            
            .to(text1, {duration:0.3, y:"+=30", alpha:0, ease:"power3"}, ">1.5")
            .from(text2, {duration:0.6, y:"-=100", alpha:0, ease:"power3"}, ">")
            
            .to(text2, {duration:0.3, y:"+=30", alpha:0, ease:"power3"}, ">1.5")
            .from([textevent, eventTitle], {duration:0.6, y:"-=100", alpha:0, ease:"power3"}, ">")
		}
	};
}