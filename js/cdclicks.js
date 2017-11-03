// chosen menu and listeners
$( document ).ready(function() {
	var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
	if(isMac){
		//$(".pathway-name-wrap").css("top","2px")
	}
	// set up chosen country menu
	$("#selectCountry").chosen({allow_single_deselect:false, width:"303px"})
		.change(function(c){
			$("#poweredBy").slideUp();
			$("#closePieInfo").trigger("click");
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
			$(".country-selected").slideDown();
			$.each(cd.atts,function(i,v){
				if(val == v.OBJECTID){
					var w = v.emiss_redux_1;
					if (w == -99 || w == -999){
						if (w == -99){
							$("#emiss_redux_1").html("Not Included")	
						}
						if (w == -999){
							$("#emiss_redux_1").html("No NDC")	
						}
					}	
					else{
						w = w * 100;
						w = roundTo(w,0);
						$("#emiss_redux_1").html(w + "%")
					}
					var crange = cd.country.replace(/ /g,"_")
					if (cd.ndcRange[crange]){
						$("#emiss_redux_1").html(cd.ndcRange[crange])
					}
					$("#tar_desc").html(v.tar_desc);
					var x = v.emiss_cut
					if (x != -99){
						if (x < 1){
							x = x
						}else{
							x = roundTo(x,0);
							x = commaSeparateNumber(x);
						}	
					}else{
						x = "N/A"
					}
					$("#emiss_cut").html(x)
					var ma = 0;
					cd.highVals = [];
					cd.maxVals = [];
					cd.sumVals = [];
					cd.lblArray = [];
					$(" .p-a").hide();
					$.each(cd.highArray,function(i1,v1){
						if(v[v1] != -99){
							cd.highVals.push(v[v1]);
						}else{
							cd.highVals.push(0);
						}
					})
					$.each(cd.maxArray,function(i1,v1){
						cd.lblArray.push( roundTo(v[v1], 1) );
						if(v[v1] != -99){
							cd.maxVals.push(v[v1]);
							ma = ma + Number(v[v1]);
						}else{
							cd.maxVals.push(0);
						}
					})
					$.each(cd.sumArray,function(i1,v1){
						if(v[v1] != -99){
							cd.sumVals.push(v[v1]);
							if (v[v1] > 40){
								$(" .p-a:eq(" + i1 +")").show();
							}
						}else{
							cd.sumVals.push(0);
						}
					})	
					if (v.emiss_cut == -99){
						cd.parisBar = 0;	
					}else{
						cd.parisBar = v.emiss_cut;
					}
					updateChart();
					ma = roundTo(ma, 0)
					ma = commaSeparateNumber(ma)
					$("#nscMitPoten").html(ma);
				}
			})
			
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
			if ( $(this).hasClass("top-one") ){
				$("#closePieInfo").trigger("click");
			}
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
			if ( $(this).hasClass("top-one") ){
				$("#closePieInfo").trigger("click");
			}
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
		// clicks on pathways
		$(".pathway-link").click(function(){
			$(".pathway-link").css({color: "blue", fontFamily: "Lato-Light"})
			$(this).css({color: "#3C454A", fontFamily: "Lato-Regular"})
			cd.pathway = this.classList[1];
			var h = cd.highArray.indexOf(cd.pathway + "_high");
			var ceVal = cd.highVals[h];
			var m = cd.maxArray.indexOf(cd.pathway + "_max");
			var mpVal = cd.maxVals[m];
			var bh = ceVal/mpVal*50;
			$("#cd_pwbd-chart").animate({height: bh + "px"}, 500 );
			$("#ceVal").html( commaSeparateNumber(roundTo(ceVal/mpVal*100,0)));
			$("#mpVal").html( commaSeparateNumber(roundTo(mpVal,1)) );
			var position = $(this).offset().top + 22;
			$("#pieChartDiv").css( {position:"absolute", top:position, left: 78}).show();
		})
		$("#closePieInfo").click(function(){
			$(".pathway-link").css({color: "blue", fontFamily: "Lato-Light"})
			$("#pieChartDiv").hide()
		})
		$("#pie-link").click(function(){
			window.open(cd.linkArray[cd.pathway])
		})
	//create chart
	createChart();	
});