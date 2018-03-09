// #########################################################
// main js file for the Hudson River web mapping application
// ESRI api functions ///////////////////////////////////////////////////////////////////////////////////////////////////
// esri api calls
var app = {}; // main app object
app.visibleLayers = [0,2,3,4]
require(["esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/symbols/TextSymbol",
    "esri/symbols/Font", "esri/Color", "esri/geometry/Extent", "esri/layers/FeatureLayer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/renderers/SimpleRenderer", "esri/graphic", "esri/dijit/Search", "dojo/domReady!","esri/dijit/Legend"], 
function(Map, ArcGISDynamicMapServiceLayer, Query, QueryTask, TextSymbol, Font, Color, Extent, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic, Search, Legend) {
  	// esri map//////////////////////////////////////////////////////////////////////////////////////////////////////
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
     map.on("load", function() {
        console.log('inside load')
        map.enableScrollWheel()
     })
     // add dynamic layer to map
     var url = "http://nyspatial.tnc.org:6080/arcgis/rest/services/HudsonRiverWebServices/HudsonRiverMapService_v03082018/MapServer";
     // Add dynamic map service
    var dynamicLayer = new ArcGISDynamicMapServiceLayer(url, {opacity:0.7});
    
    // on dynamic layer load ////////////////////////////////////////////////////////////////////////////////////////////////
    dynamicLayer.on("load", function () {
        console.log('loaded');
        dynamicLayer.setVisibleLayers(app.visibleLayers);
        map.addLayer(dynamicLayer);
        console.log('added layer')

    });

    // //add the legend ////////////////////////////////////////////////////////////////////////////////////////
    var legendLayers = [{ layer: dynamicLayer }]
    map.on('layers-add-result', function () {
        console.log('inside')
      var legend = new Legend({
        map: map,
        // layerInfos: legendLayers
      }, "legendDiv");
      legend.startup();
    });
    

}); // end of main require function













// when document is ready //////////////////////////////////////////////////////////////////////////////////////////////////
$( document ).ready(function() {
    // on doc click
    $(document).on('click', function (e) {
    // Do whatever you want; the event that'd fire if the "special" element has been clicked on has been cancelled.
        var c = $(e.target).attr('class')
        if(c){
             var i = c.indexOf('hamburgerClick')
        }
        if(i > -1){
            $('.dropdownMenu').slideDown();
        }else{
            $('.dropdownMenu').slideUp();
        }
    });
});















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

