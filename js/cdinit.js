// esri api calls
require(["esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/symbols/TextSymbol",
	"esri/symbols/Font", "esri/Color", "esri/geometry/Extent", "esri/layers/FeatureLayer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/renderers/SimpleRenderer", "esri/graphic"], 
function(Map, ArcGISDynamicMapServiceLayer, Query, QueryTask, TextSymbol, Font, Color, Extent, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic) {
	// inital extent
	var bounds = new Extent({ "xmin":-13000000, "ymin":0, "xmax":13000000, "ymax":2000000, "spatialReference":{"wkid":54030}});
	
	// map and display feature layer
	cd.map = new Map("cd_map", { showLabels:true, extent:bounds, logo:false, backgroundColor:"rgba(187,187,187,0)"});
	cd.fc = new FeatureLayer(cd.url + "/1", {opacity:0.9})
	
	// labels for display feature layer
	var statesColor = new esri.Color("#3C454A");
	var statesLabel = new TextSymbol().setColor(statesColor);
	statesLabel.font.setSize("9pt");
	statesLabel.font.setFamily("futura");
	var json = {
		"labelExpressionInfo": {"value": "{country}"},
		"minScale": "24000000"
	};
	var labelClass = new esri.layers.LabelClass(json);
	labelClass.symbol = statesLabel; 
	cd.fc.setLabelingInfo([ labelClass ]);

	// selection feature layer
	cd.fcSel = new FeatureLayer(cd.url + "/0", {mode: FeatureLayer.MODE_SELECTION});
	
	// add feature layers to map
	cd.map.addLayer(cd.fc);
	cd.map.addLayer(cd.fcSel);
	
	// query that poulates country dropdown and gets all attribute data
	var q = new Query(); 
	var qt = new QueryTask(cd.url + "/" + cd.countries);
	q.where = "OBJECTID > 0";
	q.returnGeometry = false;
	q.outFields = ["*"];
	var c = [];
	qt.execute(q, function(e){
		$.each(e.features, function(i,v){
			cd.atts.push(v.attributes)
			c.push(v.attributes.country + "," +v.attributes.OBJECTID)
		})
		var countries = c.sort();
		$.each(countries,function(i,v){
			var a = v.split(",")[1];
			var b = v.split(",")[0];
			$('#selectCountry').append("<option value='" + a + "'>"+ b +"</option")
		})	
		$('#selectCountry').val(27).trigger("chosen:updated").trigger("change");			
	});
	cd.map.setMapCursor("pointer")
	// handle map clicks
	cd.map.on('click',function(cl){
		cd.querySource = "map";
		var pnt = cl.mapPoint;
		var q1 = new Query();
		var qt1 = new QueryTask(cd.url + "/" + cd.countries);
		q1.geometry = pnt;
		q1.outFields = ["OBJECTID"];
		qt1.execute(q1, function(e){
			if (e.features.length > 0){
				var obid = e.features[0].attributes.OBJECTID;
				$("#selectCountry").val(obid).trigger("chosen:updated").trigger("change");						
			}
		})	
	})
});

function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}
function roundTo(n, digits) {
	if (digits === undefined) {
    	digits = 0;
    }
    var multiplicator = Math.pow(10, digits);
	n = parseFloat((n * multiplicator).toFixed(11));
	var test =(Math.round(n) / multiplicator);
	return +(test.toFixed(2));
}