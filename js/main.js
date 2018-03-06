// #########################################################
// main js file for the Hudson River web mapping application
require([ "esri/map", "esri/dijit/Search", "dojo/domReady!"
  ], function (Map, Search) {
  	// esri map
     var map = new Map("map", {
        basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: [-73.9, 42.05], // lon, lat
        zoom: 8,
        sliderPosition: "top-right"
     });
     // code for ESRI search
     var search = new Search({
        map: map
     }, "search");
     search.startup();

}); // end of main require function






// 
// var map;
// // add esri map and zoom to NY
// require(["esri/map", "dojo/domReady!", "esri/dijit/Search"], function(Map, Search) {
// 	map = new Map("map", {
// 	  basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
// 	  center: [-73.9, 42.05], // longitude, latitude
// 	  zoom: 8
// 	});
// 	
// 	var s = new Search({ map: map },"search");
// 	// start search
// 	s.startup();
// });


// require([
//   "esri/map", "esri/dijit/Search", ... 
// ], function(Map, Search, ...) {
//   var map = new Map(...);
//   var s = new Search({
//     map: map
//   },"search");
// });

// code for ESRI search
// var s = new Search({
//     map: map
//   },"search");
// 	s.startup();
// add code for basemap selector

// 

