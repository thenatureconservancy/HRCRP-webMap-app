// #########################################################
// main js file for the Hudson River web mapping application
// ESRI api functions ///////////////////////////////////////////////////////////////////////////////////////////////////
// esri api calls
var app = {}; // main app object
app.visibleLayers = [1];
app.layerDefinitions  = [];
app.authorText = 'Not Selected';
app.titleText = 'NY Hudson River'
app.appMode = 'main';
require(["esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/symbols/TextSymbol",
    "esri/symbols/Font", "esri/Color", "esri/geometry/Extent", "esri/layers/FeatureLayer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol",
        "esri/renderers/SimpleRenderer", "esri/graphic","esri/geometry/Point","esri/SpatialReference", "esri/dijit/Search", "esri/dijit/Legend", "esri/dijit/BasemapToggle",
        "esri/tasks/locator","esri/geometry/webMercatorUtils","esri/dijit/Print","esri/tasks/PrintTemplate","esri/request", "esri/config","dojo/i18n!esri/nls/jsapi", "dojo/_base/array", "dojo/dom", "dojo/parser","dojo/domReady!"], 
function(Map, ArcGISDynamicMapServiceLayer, Query, QueryTask, TextSymbol, Font, Color, Extent, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol,SimpleMarkerSymbol,
        SimpleRenderer, Graphic,Point, SpatialReference, Search, Legend, BasemapToggle, Locator, webMercatorUtils,Print, PrintTemplate, esriRequest,esriConfig,esriBundle,arrayUtils, dom, parser) {
    parser.parse();
    esriConfig.defaults.io.proxyUrl = "/proxy/";
    esriBundle.widgets.print.NLS_print = "Create PDF Map";
    esriBundle.widgets.print.NLS_printing = "Creating Map....";
    esriBundle.widgets.print.NLS_printout= "Click to Open PDF";
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
      }, "legendDiv");
      legend.startup();
      // geolocator startup
      var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
        // add feature layer for add own layers, this feature layer is published on AGO
        app.addOwnProjectLayerURL = 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/addNewProject_hudsonRiver_1/FeatureServer/0'
        
        app.addOwnProjectLayer = new FeatureLayer(app.addOwnProjectLayerURL, {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
        });
        map.addLayer(app.addOwnProjectLayer);
        app.addOwnProjectLayer.setDefinitionExpression("display_on_web='yes'");
        // print service URL to create PDF maps
        app.printUrl = "https://cumulus.tnc.org/arcgis/rest/services/nascience/NYHudsonRiverExportWebMap/GPServer/Export%20Web%20Map";
        // get print templates from the export web map task
        var printInfo = esriRequest({
          "url": app.printUrl,
          "content": { "f": "json" }
        });
        printInfo.then(handlePrintInfo, handleError);
        // on create print button click
        $("#createPrint").on('click', function(){
            // slide down map create screen
            $('.mapInfoWrapper').slideDown();
        })
        // on create map section close button click
        $('.mapClose').on('click', function(evt){
            console.log(evt);
            $('.mapInfoWrapper').slideUp();
            // clear map form 
            $('#mapText1').val('')
            $('#mapText2').val('')
            // and reset vars 
            app.printer.templates[0].layoutOptions.titleText = 'NY Hudson River'
            app.printer.templates[1].layoutOptions.titleText = 'NY Hudson River'
            app.printer.templates[0].layoutOptions.authorText = 'Not Selected'
            app.printer.templates[1].layoutOptions.authorText = 'Not Selected'

        })
        // the var inputs is all of the inputs in the form.
        var mapInputs = $("#mapText1,#mapText2")
        mapInputs.change(function() {
            mapInputs.each(function(index) {
                var input = $(this);
                if(index == 0){
                    if(input[0].value){
                        // app.titleText = input[0].value
                        app.printer.templates[0].layoutOptions.titleText = input[0].value;
                        app.printer.templates[1].layoutOptions.titleText = input[0].value;
                    }
                }else if(index == 1){
                    if(input[0].value){
                        // app.authorText = input[0].value
                        // console.log(app.printer)
                        app.printer.templates[0].layoutOptions.authorText = input[0].value;
                        app.printer.templates[1].layoutOptions.authorText = input[0].value;
                    }
                }
            })
        })
        

        function handlePrintInfo(resp){
            var layoutTemplate, templateNames, mapOnlyIndex, templates;
              layoutTemplate = arrayUtils.filter(resp.parameters, function(param, idx) {
                return param.name === "Layout_Template";
              });
              
              if ( layoutTemplate.length === 0 ) {
                console.log("print service parameters name for templates must be \"Layout_Template\"");
                return;
              }
              templateNames = layoutTemplate[0].choiceList;
              // remove the MAP_ONLY template then add it to the end of the list of templates 
              mapOnlyIndex = arrayUtils.indexOf(templateNames, "MAP_ONLY");
              if ( mapOnlyIndex > -1 ) {
                var mapOnly = templateNames.splice(mapOnlyIndex, mapOnlyIndex + 1)[0];
                templateNames.push(mapOnly);
              }
              // create a print template for each choice
              templates = arrayUtils.map(templateNames, function(ch) {
                var plate = new PrintTemplate();
                plate.layout = plate.label = ch;
                plate.format = "PDF";
                plate.layoutOptions = { 
                  "authorText": app.authorText,
                  "copyrightText": "<copyright info here>",
                  "legendLayers": [], 
                  "titleText": app.titleText, 
                  "scalebarUnit": "Miles" 
                };
                return plate;
              });
             // print dijit ////////////////////
                app.printer = new Print({
                      map: map,
                      "templates": templates,
                      url: app.printUrl,
                }, dom.byId("createMap"));
                app.printer.startup();
        }
        function handleError(err){
            console.log('somthing went wrong', err)
        }
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
            console.log('map click')
            // when in main map mode //////////////////
            if(app.appMode == 'main'){
                // query the map for features
                var pnt = e.mapPoint;
                app.pnt = e.mapPoint;
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
                if($("#layer-0")[0].checked){
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
                        if($('.popupItemsWrapper')[0].clientHeight == 0){
                            $('.popupItemsWrapper').slideDown();
                            $('#bottomPopupWrapper .popupMin').css('transform', 'rotate(180deg)')
                        }
                        // clean attributes function
                        var cleanAtts = function(val){
                            if (val.length <= 1 ) {
                                val = "N/A"
                                return val
                            }else{
                                return val;
                            }
                        }
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
                    }else{
                        // slide up bottom popup
                        $("#bottomPopupWrapper").slideUp();
                    }
                })
            // when in submit your own project mode /////////////////
            } else if(app.appMode == 'submit'){
                // use the loc var below to geolocate sddresses on map click. use that to populate some of the form.
                var loc = locator.locationToAddress(e.mapPoint, 100, function(t){
                    var mp = webMercatorUtils.webMercatorToGeographic(e.mapPoint);
                    var lat_long = mp.x + ' ' + mp.y;
                    $('#formItem6').val(lat_long);
                    $('#formItem7').val(t.address.City);
                    // $('#formItem8').val(t.address.Type);
                    $('#formItem9').val(t.address.Subregion);
                    // trigger change to force call on form validate function
                    $("#formItem7").trigger("change");
                });
            }else{
                console.log('there is a problem with the map mode variable')
            }
            
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
            // click on all projects cb and slide down filter cb's
            if(layerId == 0){
                // test if cb is checked
                if (c.currentTarget.checked) {
                    $(".cb_wrapper_indent").slideDown();
                    // app.layerDefinitions[0] =  app.finalDeff;
                    // dynamicLayer.setLayerDefinitions(app.layerDefinitions);
                    map.addLayer(app.addOwnProjectLayer);
                    if(!app.finalDeff){
                        app.addOwnProjectLayer.setDefinitionExpression("display_on_web='yes' AND projectType_web = 'Habitat' OR projectType_web = 'Recreation and Access' OR projectType_web = 'Community Infrastructure' OR projectType_web = 'Multiple'" );
                    }else{
                        app.addOwnProjectLayer.setDefinitionExpression("display_on_web='yes' AND " + app.finalDeff);
                    }
                }else{
                    $(".cb_wrapper_indent").slideUp();
                    app.layerDefinitions[0] =  "projectType_web = 'null'"
                    dynamicLayer.setLayerDefinitions(app.layerDefinitions);
                    map.removeLayer(app.addOwnProjectLayer);
                }
            }
            // if cb checked push viz layers into viz layers array
            if(c.currentTarget.checked){
                if(layerId == 0){
                    'dont push in project layers as dynamic map service layer'
                }else{
                    app.visibleLayers.push(layerId)   
                }
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
        // all project filter check boxes /////////////////////////////////////////////////////////////////////////////////////////
        $('.cb_wrapper_indent input').click(function(c){
            var id  = c.currentTarget.id
            app.layerDeffs = ["projectType_web = 'Habitat'","projectType_web = 'Recreation and Access'", "projectType_web = 'Community Infrastructure'", "projectType_web = 'Multiple'"]
            app.finalDeff = ''
            // find out which cb's are checked
            $.each($('.cb_wrapper_indent input'), function(i,v){
                if(!$(v)[0].checked){
                    id  = "projectType_web = '" + $(v)[0].id + "'"
                    var index =  app.layerDeffs.indexOf(id)
                    if (index > -1) {
                        app.layerDeffs.splice(index, 1)
                    }
                    // loop through layer defs and build the final def string
                    $.each(app.layerDeffs, function(i,v){
                        if (i < 1) {
                            app.finalDeff = app.layerDeffs[0]
                        }else{
                            app.finalDeff += " OR " + app.layerDeffs[i]
                        }
                    })
                }else{
                    id  = "projectType_web = '" + $(v)[0].id + "'"
                    var index =  app.layerDeffs.indexOf(id)
                    if (index > -1) {
                        // app.layerDeffs.splice(index, 1)
                    }

                }
            })
            // set layer def to null to display no layers if all cb's are unchecked
            if(app.layerDeffs.length < 1){
                app.finalDeff = "projectType_web = 'null'";
            }
            // set layer defs and update the mask layer /////////////////////
            app.layerDefinitions = [];
            app.layerDefinitions[0] =  app.finalDeff
            dynamicLayer.setLayerDefinitions(app.layerDefinitions);
            app.addOwnProjectLayer.setDefinitionExpression("display_on_web='yes' AND " + app.finalDeff);
        })
        // on add new project button click ///////////////////////////////////////////////////
        $('#addOwnProject').click(function(c){
            $(".mainContentWrapper").slideUp();
            $(".addNewContentWrapper").slideDown();
            app.appMode = 'submit' // change app mode to submit
        })
        // on add new project button click ///////////////////////////////////////////////////
        $('#backToMain').click(function(c){
            $(".mainContentWrapper").slideDown();
            $(".addNewContentWrapper").slideUp();
            $('.submitText').slideUp(); 
            app.appMode = 'main' // change app mode to submit
        })
        // the var inputs is all of the inputs in the form.
        var inputs = $("#formItem1,#formItem2,#formItem3,#formItem4,#formItem5,#formItem6,#formItem7,#formItem8,#formItem9")
        // clear form when the user clicks the back button or the submit button
        var clearForm = function(){
            inputs.each(function(i,v) {
                $(v).val(''); // set all values back to empty string
                $(v).trigger('change') // to disable submit button
            })
        }
        // validate form before submit //////////////////////////
        var validateInputs = function validateInputs(inputs) {
          var validForm = true;
          inputs.each(function(index) {
            var input = $(this);
            if (!input.val() || (input.type === "radio" && !input.is(':checked'))) {
              // $("#subnewtide").attr("disabled", "disabled");
              $("#submitButton").attr("disabled", "disabled");
              validForm = false;
            }
          });
          return validForm;
        }
        // on input change call validate inputs function and make sure everything is good before enabeling submit button
        inputs.change(function() {
            $('.submitText').slideUp();
            if(validateInputs(inputs)){
                $("#submitButton").removeAttr("disabled");
            }
        })
        // on new project submit button click //////////////////////////////////////////////
        $("#submitButton").click(function(c){
            var formArray = [];
            // collect all the inputs from the form
            var item1 = $( "#formItem1" ).val();
            var item2 = $( "#formItem2" ).val();
            var item3 = $( "#formItem3" ).val();
            var item4 = $( "#formItem4" ).val();
            var item5 = $( "#formItem5" ).val();
            var item6 = $( "#formItem6" ).val();
            var item7 = $( "#formItem7" ).val();
            var item8 = $( "#formItem8" ).val();
            var item9 = $( "#formItem9" ).val();

            formArray.push(item1, item2)
            // split item 6 to get the lat long values
            item6 = item6.split(' ')
            var lat = parseFloat(5275704.371526124)
            var long = parseFloat(-8429816.546952119)
            // use this code while on the S3 bucket
            // var lat = parseFloat(item6[1])
            // var long = parseFloat(item6[0])

            // use this code below to add attributes and geometry to the projects layer when adding new porokects
            var obj = { user_name:item1, project_name:item2, project_type:item3, project_desc:item4, stakeholder: item5, jur_name:item7, county: item9, lat:lat, long:long, display_on_web:'no'}
            var spatialReference = new SpatialReference ({spatialReference:{wkid: 102100, latestWkid: 3857}})
            var pt = new Point({x:long,y:lat,spatialReference:{wkid: 102100, latestWkid: 3857}})
            var sms = new SimpleMarkerSymbol().setStyle(
                SimpleMarkerSymbol.STYLE_SQUARE).setColor(
                new Color([255,0,0,0.5]));

            var incidentGraphic = new Graphic(pt,sms, obj);
            // apply a def query to the add own project layer feature layer
            // app.addOwnProjectLayer.setDefinitionExpression("user_name<>'mark'");
            // app.addOwnProjectLayer.setDefinitionExpression("user_name='mark'");
            // app.addOwnProjectLayer.setDefinitionExpression("Project_Type='Habitat'");
            // app.addOwnProjectLayer.setDefinitionExpression("display_on_web='yes'");

            // apply edits to the feature layer here
            app.addOwnProjectLayer.applyEdits([incidentGraphic], null, null, function(e){
                // clear form after the submit button has been clicked
                clearForm();
                // display text that your project has been submited 
                $('.submitText').slideDown();
            });
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
