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
            eventTitle = select('#event-title'),
            slogan = select('#slogan'),
            eventLocation = select('#text5'),
            eventTime = select('#text6'),
            eventDate = select('#text7');
       
        if (text5.innerHTML.length > 25) {
            text5.style.fontSize = "19px";
        }
        
        animate();
        
		function animate() {
                
            tl
            .to(wrect, {duration: 0.5, alpha:0, ease:"none"})
            
            .from(logoitem, {duration:0.8, y:"-=200", ease:"power2"}, "<0.5")
            .from(orangelines, {duration:0.8, y:"+=125", height:0, ease:"power2"}, "<")
            
            .from(logo, {duration:1.2, force3D:true, rotation:0.01, width:485, ease:"power2.inOut"}, ">")
            .from(footer, {duration:1.2, force3D:true, rotation:0.01, width:485, ease:"power2.inOut"}, "<")
            
            .from(slogan, { duration:0.6, y:"-=50", scale:0, alpha:0, ease:"power2"}, "<0.8")
            
            .from(text1, {duration:0.6, y:"-=100", alpha:0, ease:"power3"}, ">")
            
            .to(text1, {duration:0.3, y:"+=30", alpha:0, ease:"power3"}, ">1.5")
            .from(text2, {duration:0.6, y:"-=100", alpha:0, ease:"power3"}, ">")
            
            .to(text2, {duration:0.3, y:"+=30", alpha:0, ease:"power3"}, ">1.5")
            .from([eventTitle, textevent], {duration:0.6, y:"-=100", alpha:0, ease:"power3"}, ">")
		}
	};
}