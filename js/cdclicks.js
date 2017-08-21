// chosen menu and listeners
$( document ).ready(function() {
	// set up chosen country menu
	$("#selectCountry").chosen({allow_single_deselect:false, width:"260px"})
		.change(function(c){
			var val = c.target.value;
			cd.country = $("#selectCountry option:selected").text();
			var rep = "no";
			$.each(cd.reportCountries, function(i,v){
				if (cd.country == v){
					rep = "yes";
				}
			})
			if (rep == "yes"){
				$("#dl-cr").slideDown();
			}else{
				$("#dl-cr").hide();
			}
			// check for a deselect
			if (val.length == 0){
				$(".c-sel").slideUp();
			}else{
				$.each(cd.atts,function(i,v){
					if(val == v.OBJECTID){
						var w = v.emiss_redux_1;
						if (w != -99){
							w = w * 100;
							w = roundTo(w,0);
							$("#emiss_redux_1").html(w + "%" + v.eu)
						}
						else{
							$("#emiss_redux_1").html("N/A")
						}
						// var w1 = v.ref_yr_1;
						// if (w1 == -99){
						// 	w1 = "N/A"
						// }
						// $("#ref_yr_1").html(w1)
						var x = v.emiss_cut
						if (x != -99){
							x = roundTo(x,0);
							x = commaSeparateNumber(x);
						}else{
							x = "N/A"
						}
						$("#emiss_cut").html(x)
						var y = 0;
						cd.highVals = [];
						cd.maxVals = [];
						cd.sumVals = [];
						cd.lblArray = [];
						$(" .p-a").hide();
						$.each(cd.highArray,function(i1,v1){
							if(v[v1] != -99){
								cd.highVals.push(v[v1]);
								y = y + Number(v[v1]);
							}else{
								cd.highVals.push(0);
							}
						})
						$.each(cd.maxArray,function(i1,v1){
							if(v[v1] != -99){
								cd.maxVals.push(v[v1]);
								y = y + Number(v[v1]);
							}else{
								cd.maxVals.push(0);
							}
						})
						$.each(cd.sumArray,function(i1,v1){
							cd.lblArray.push( roundTo(v[v1], 1) );
							if(v[v1] != -99){
								cd.sumVals.push(v[v1]);
								if (v[v1] > 40){
									$(" .p-a:eq(" + i1 +")").show();
								}
							}else{
								cd.sumVals.push(0);
							}
						})

						// cd.twoDeg = 0;
						// $.each(cd.degArray,function(i1,v1){
						// 	if(v[v1] != -99){
						// 		cd.twoDeg = cd.twoDeg + v[v1];
						// 	}
						// })	
						if (v.emiss_cut == -99){
							cd.parisBar = 0;	
						}else{
							cd.parisBar = v.emiss_cut;
						}
						updateChart();
						y = roundTo(y, 0)
						y = commaSeparateNumber(y)
						$("#nscMitPoten").html(y);
					}
				})
				$(".c-sel").slideDown();
				var cnty = $("#selectCountry option:selected").text();
				var query = new esri.tasks.Query();  
				query.where = "country ='" + cnty + "'";
				cd.fcSel.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function(result){  
					if (cd.querySource == "menu"){ 
						var extent = result[0].geometry.getExtent().expand(2);  
						cd.map.setExtent(extent,true); 
					}else{
						cd.querySource = "menu"; 
					}	
				});	
			}
		});
		$("#mpInfo").click(function(){
			$("#mpInfoText").slideDown();
			$("#mpInfo").hide();
			$("#hideInfo").show();
		})
		$("#hideInfo").click(function(){
			$("#mpInfoText").slideUp();
			$("#hideInfo").hide();
			$("#mpInfo").show();	
		})	
		$("#dl-cr").click(function(){
			cd.country = cd.country.replace(/ /g,"%20");
			window.open("https://nsttnc.blob.core.windows.net/ncs/" + cd.country + "%20Report.pdf")
		});	
	//create chart
	createChart();	
});