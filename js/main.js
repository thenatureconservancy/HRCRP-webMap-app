// #########################################################
// main js file for the Hudson River web mapping application
// ESRI api functions ///////////////////////////////////////////////////////////////////////////////////////////////////
// esri api calls
var app = {}; // main app object
app.visibleLayers = [0,1]
require(["esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/symbols/TextSymbol",
    "esri/symbols/Font", "esri/Color", "esri/geometry/Extent", "esri/layers/FeatureLayer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol",
        "esri/renderers/SimpleRenderer", "esri/graphic", "esri/dijit/Search", "esri/dijit/Legend", "esri/dijit/BasemapToggle","dojo/domReady!"], 
function(Map, ArcGISDynamicMapServiceLayer, Query, QueryTask, TextSymbol, Font, Color, Extent, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol,SimpleMarkerSymbol,
        SimpleRenderer, Graphic, Search, Legend, BasemapToggle) {
    // esri map  //////////////////////////////////////////////////////////////////////////////////////////////////////
     var map = new Map("map", {
        basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: [-73.9, 42.05], // lon, lat
        zoom: 8,
        sliderPosition: "top-right"
     });

     // code for ESRI search/////////////////////////////////////////
     var search = new Search({
        map: map
     }, "search");
     search.startup();
     // code for ESRI basemap //////////////////////////////
     var toggle = new BasemapToggle({
        map: map,
        basemap: "satellite"
      }, "BasemapToggle");
      toggle.startup();
      //add the legend ////////////////////////////////////////////////////////////////////////////////////////
      var legendLayers =[];
      legendLayers.push({title: ' ' });

      var legend = new Legend({
        map: map,
        // layerInfos: legendLayers
        // layerInfos: legendLayers
      }, "legendDiv");
      legend.startup();
      // legend.layerInfos = title = ;
    // Add dynamic map service
    app.url = "https://cumulus.tnc.org/arcgis/rest/services/nascience/HudsonRiverMapService/MapServer"
    var dynamicLayer = new ArcGISDynamicMapServiceLayer(app.url, {opacity:0.7});
    // on dynamic layer load ////////////////////////////////////////////////////////////////////////////////////////////////
    dynamicLayer.on("load", function () {
        dynamicLayer.setVisibleLayers(app.visibleLayers);
        map.addLayer(dynamicLayer); // add dynamic layer
    });

    // on map load ////////////////////////////////////////////////////////////////////////////////////////////
     map.on("load", function() {
        // $('#legendDiv').children().first().find('.esriLegendServiceLabel').html('change the title');
        // console.log('hey')
        map.enableScrollWheel();
        map.on("mouse-over", function(e){
            map.setMapCursor("pointer");
        })
        map.on("mouse-out", function(e){
        })
        // on map click /////////////////////////////////////////////////////////
        map.on("click", function(e){
            // query the map for features
            var pnt = e.mapPoint;
            var centerPoint = new esri.geometry.Point(pnt.x,pnt.y,pnt.spatialReference);
            var mapWidth = map.extent.getWidth();
            var mapWidthPixels = map.width;
            var pixelWidth = mapWidth/mapWidthPixels;
            var tolerance = 10 * pixelWidth;
            var ext = new esri.geometry.Extent(1,1, tolerance, tolerance, pnt.spatialReference);
            var p = ext.centerAt(centerPoint);
            //start of query ///////////////////////////////////////////////////////////////////////
            var q = new Query();
            var qt = new QueryTask(app.url + "/0");
            q.geometry = p;
            q.returnGeometry = true;
            q.outFields = ["*"];
            // execute query ///////////////////
            // test to see if the project layers is being displayed. if it is execute query
            var index = app.visibleLayers.indexOf(0)
            if (index > -1) {
                qt.execute(q);
            }
            // query on complete
            qt.on('complete', function(evt){
                map.graphics.clear();
                // new markey symbol used for selected features
                var markerSymbol = new SimpleMarkerSymbol();
                markerSymbol.setColor(new Color("#00FFFF"));
                markerSymbol.setSize(12);
                 // if info returned from query
                if(evt.featureSet.features.length > 0){
                    app.atts = evt.featureSet.features[0].attributes;
                    app.items = $("#bottomPopupWrapper").find(".popupItems")
                    // add the selected feature graphic
                    map.graphics.add(new Graphic(evt.featureSet.features[0].geometry, markerSymbol));
                    // slide down bottom popup
                    $("#bottomPopupWrapper").slideDown();
                    // clean attributes function
                    var cleanAtts = function(val){
                        console.log(val)
                        console.log(val.length);
                        if (val.length <= 1 ) {
                            // console.log(val)
                            val = "N/A"
                            return val
                        }else{
                            return val;
                        }
                        // return val;
                    }

                    // console.log(cleanAtts(''))
                    // console.log(cleanAtts('hey'))

                    // populate the html with the correct attributes 
                    var title = evt.featureSet.features[0].attributes.Project_Title
                    $("#popupHeaderTitle").html(title);
                    // set the attributes for each attribute span
                    $(app.items[0]).find('span').html(cleanAtts(app.atts.Project_Type))
                    $(app.items[1]).find('span').html(cleanAtts(app.atts.Project_Description))
                    $(app.items[2]).find('span').html(cleanAtts(app.atts.Stakeholder))
                    $(app.items[3]).find('span').html(cleanAtts(app.atts.Name))
                    $(app.items[4]).find('span').html(cleanAtts(app.atts.Jurisdiction))
                    $(app.items[5]).find('span').html(cleanAtts(app.atts.County))
                    $(app.items[6]).find('span').html(cleanAtts(app.atts.Location))
                    
                    // console.log(app.items);
                    // console.log(app.atts);
                    // console.log($(app.items[0]).find('span').html(app.atts.Project_Type));

                }else{
                    // slide up bottom popup
                    $("#bottomPopupWrapper").slideUp();
                }
            })
        })
     })

    // when document is ready //////////////////////////////////////////////////////////////////////////////////////////////////
    // html code goes here
    $( document ).ready(function() {
        // build opacity slider and on slide change map opacity //////
        $("#sldr").slider({ min: 0, max: 100, range: false, values: [30], slide: function(e, ui){
            dynamicLayer.setOpacity(1 - ui.value/100);
        } })
        // on cb clicks add and remoce layers /////////////////
        $('.cbWrapper input').click(function(c){
            var layerId = parseInt(c.currentTarget.id.split('-')[1]);
            if(c.currentTarget.checked){
                app.visibleLayers.push(layerId)
            }else{
                var index = app.visibleLayers.indexOf(layerId)
                if (index !== -1) app.visibleLayers.splice(index, 1);
            }
            // call the legend refresh to add or remove layers from the legend.
            legend.refresh();
            // remove legend if there are no layers checked
            if (app.visibleLayers.length >=1) {
                $('.legendDivWrapper').show();
            }else{
                $('.legendDivWrapper').hide();
                $('.dummyLegendHeader').hide();

            }
            // update the viz layers showing on the map
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
        // close attribute popup on close click and clear map graphics
        $('.popupHeaderCloseWrapper').on('click', function(e){
             map.graphics.clear();
            $("#bottomPopupWrapper").slideUp();
        })


        // minimize attribute and legend popup on click
        $('.popupMinWrapper').on('click', function(e){
            var elem = $(e.currentTarget).parent().next();
            var tar = $(e.currentTarget)
            var h = $(elem).is(":visible");
            if(elem[0].id != 'legendDiv'){
                if(h){
                    $(elem).slideUp();
                    $(tar).show();
                    $(tar).css('transform', 'rotate(180deg)')
                }else{
                    $(elem).slideDown();
                    $(tar).css('transform', 'rotate(360deg)')
                }
            }else{
                if(h){
                    $(e.currentTarget).parent().parent().slideUp()
                    $('.dummyLegendHeader').show();
                }
                
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
