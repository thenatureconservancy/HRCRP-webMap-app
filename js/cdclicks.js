// chosen menu and listeners
$( document ).ready(function() {
	// set up chosen country menu
	$("#selectCountry").chosen({allow_single_deselect:false, width:"235px"})
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
			$.each(cd.atts,function(i,v){
				if(val == v.OBJECTID){
					var w = v.emiss_redux_1;
					if (w != -99){
						w = w * 100;
						w = roundTo(w,0);
						$("#emiss_redux_1").html(w + "%" /*+ v.eu*/)
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
			$(".country-selected").slideDown();
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
		});


		$(".h3InfoIcon").hover(function(){
			if (!$(this).parent().parent().find(".h3Info").hasClass("closeH3Info")){
				$(this).parent().parent().find(".h3Info").removeClass("shown").slideDown();
			}
		}, function(){
			if (!$(this).parent().parent().find(".h3Info").hasClass("shown")){
				$(this).parent().parent().find(".h3Info").slideUp();
			}	
			$(this).parent().parent().find(".h3Info").removeClass("closeH3Info")
		});
		$(".h3InfoIcon").click(function(){
			$(this).parent().parent().find(".h3Info").addClass("shown").slideDown();
			$(this).hide();
			$(this).parent().find(".hideH3InfoIcon").show();
		})
		$(".hideH3InfoIcon").click(function(){
			$(this).parent().parent().find(".h3Info").slideUp();
			$(this).parent().parent().find(".h3Info").addClass("closeH3Info")
			$(this).hide();
			$(this).parent().find(".h3InfoIcon").show();	
		})	
		
		// Att Box info hover and clicks
		// Hover on att div show info
		$(".infoIconAttDiv").hover(
			function(){
				if (!$(this).parent().find(".sum-att-info").hasClass("closeAtInfo")){
					$(this).parent().find(".sum-att-info").removeClass("shown").show();
					$(this).parent().find(".sum-att").hide();
					$(this).parent().find(".sum-att-label").hide();
				}	
			}, 
			function(){
				if (!$(this).parent().find(".sum-att-info").hasClass("shown")){
					$(this).parent().find(".sum-att-info").hide();
					$(this).parent().find(".sum-att").show();
					$(this).parent().find(".sum-att-label").show();
				}	
				$(this).parent().find(".sum-att-info").removeClass("closeAtInfo")
			}
		);
		// Click on att div show info
		$(".infoIconAttDiv").click(function(){
			$(this).parent().find(".sum-att-info").addClass("shown").show();
			$(this).hide();
			$(this).parent().find(".sum-att").hide();
			$(this).parent().find(".sum-att-label").hide();
			$(this).parent().find(".hideInfoIconAttDiv").show();
		})
		// Click on att div hide info
		$(".hideInfoIconAttDiv").click(function(){
			$(this).hide();
			$(this).parent().find(".sum-att-info").hide();
			$(this).parent().find(".sum-att").show();
			$(this).parent().find(".sum-att-label").show();
			$(this).parent().find(".sum-att-info").addClass("closeAtInfo");
			$(this).parent().find(".infoIconAttDiv").show();
		})
		// click on country report	
		$("#dl-cr").click(function(){
			cd.country = cd.country.replace(/ /g,"%20");
			window.open("https://nsttnc.blob.core.windows.net/ncs/" + cd.country + "%20Report.pdf")
		});	
		// hover on pathways
		$(".pathway-link").click(function(){
			$(".pathway-link").css({color: "#0921ea", fontFamily: "Brown-Light"})
			$(this).css({color: "#3C454A", fontFamily: "Brown-Regular"})
			cd.pathway = this.classList[1];
			var h = cd.highArray.indexOf(cd.pathway + "_high");
			var ceVal = cd.highVals[h];
			var m = cd.maxArray.indexOf(cd.pathway + "_max");
			var mpVal =cd.maxVals[m];
			cd.mcPieChart.data.datasets[0].data = [ceVal,mpVal];
			cd.mcPieChart.update();
			$("#ceVal").html( commaSeparateNumber(roundTo(ceVal,1)) );
			$("#mpVal").html( commaSeparateNumber(roundTo(mpVal,1)) );
			var position = $(this).offset().top + 16;
			$("#pieChartDiv").css( {position:"absolute", top:position, left: 78}).show();
		})
		$("#closePieInfo").click(function(){
			$(".pathway-link").css({color: "#0921ea", fontFamily: "Brown-Light"})
			$("#pieChartDiv").hide()
		})
		$("#pie-link").click(function(){
			window.open(cd.linkArray[cd.pathway])
		})
	//create chart
	createChart();	
});