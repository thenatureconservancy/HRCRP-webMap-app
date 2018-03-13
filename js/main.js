// #########################################################
// main js file for the Hudson River web mapping application
// ESRI api functions ///////////////////////////////////////////////////////////////////////////////////////////////////
// esri api calls
var app = {}; // main app object
app.visibleLayers = [0,4]
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
     // var url = "http://nyspatial.tnc.org:6080/arcgis/rest/services/HudsonRiverWebServices/HudsonRiverMapService_v03082018/MapServer";
     // for github url
     // var url = "https://nyspatial.tnc.org/arcgis/rest/services/HudsonRiverWebServices/HudsonRiverMapService_v03082018/MapServer";

     var url = "https://cumulus.tnc.org/arcgis/rest/services/nascience/HudsonRiverMapService/MapServer"

     // Add dynamic map service
    var dynamicLayer = new ArcGISDynamicMapServiceLayer(url, {opacity:0.7});
    
    // on dynamic layer load ////////////////////////////////////////////////////////////////////////////////////////////////
    dynamicLayer.on("load", function () {
        dynamicLayer.setVisibleLayers(app.visibleLayers);
        map.addLayer(dynamicLayer); // add dynamic layer
    });
    
    
    




    // //add the legend ////////////////////////////////////////////////////////////////////////////////////////
    // var legendLayers = [{ layer: dynamicLayer }]
    // map.on('layers-add-result', function () {
    //     console.log('inside')
    //   var legend = new Legend({
    //     map: map,
    //     // layerInfos: legendLayers
    //   }, "legendDiv");
    //   legend.startup();
    // });
    



    // when document is ready //////////////////////////////////////////////////////////////////////////////////////////////////
    // html code goes here
    $( document ).ready(function() {
        // on cb clicks add and remoce layers /////////////////
        $('.cbWrapper input').click(function(c){
            var layerId = parseInt(c.currentTarget.id.split('-')[1]);
            if(c.currentTarget.checked){
                app.visibleLayers.push(layerId)
            }else{
                var index = app.visibleLayers.indexOf(layerId)
                if (index !== -1) app.visibleLayers.splice(index, 1);
            }
            dynamicLayer.setVisibleLayers(app.visibleLayers);
        })
        // header collapse functionality
        $('.cbHeader').on('click', function(e){
            // check to see the height of the next cbWrapper
            // if its open close it, change text to show
            if($(e.currentTarget).next().is(':visible')){
                $(e.currentTarget).next().slideUp();
                $(e.currentTarget).find('span').html('Show')
            }else{ // else open it, chnage text to collapse
                $(e.currentTarget).next().slideDown();
                $(e.currentTarget).find('span').html('Collapse')
            }
        })
         // header mouse over functionality
        $('.cbHeader').on('mouseover', function(e){
            // add blue font class to span
            $(e.currentTarget).find('span').css('color', '#2F6384')
        })
        $('.cbHeader').on('mouseout', function(e){
            $(e.currentTarget).find('span').css('color', '#f3f3f3')
            // remove blue font class to span
        })
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

