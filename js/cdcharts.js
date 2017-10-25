function createChart(){
	// Set global chart variables
	Chart.defaults.global.tooltips.enabled = false;
	Chart.defaults.global.legend.display = false;
	
	// mitigation pathways chart
	// var ctx = $("#pathwayChart");
	// cd.mitPathChart = new Chart(ctx, {
	//     type: 'horizontalBar',
	//     data: {
	//         labels: ["", "", "", "", "", "", "", "", "", ""],
	//         datasets: [{
	//             data: [12, 19, 3, 14, 8, 3, 7, 9, 10, 5],
	//             backgroundColor:"#81d08f",
	//             borderWidth: 0
	//         }]
	//     },
	//     options: {
	//     	responsive: true,
	// 		maintainAspectRatio: false,
	//         scales: {
	//             xAxes: [{ ticks: { beginAtZero:true, max:40, fontFamily:"Lato-Light" } }],
	//             yAxes:[{ ticks: { beginAtZero:true} }]
	//         },
	//         events: false,
	// 		showTooltips: false
	//     }
	// });
	// Commitment chart
	var ctx1 = $("#commitmentChart");
	var commitData = {
			labels: [""],
			datasets: [{
			borderWidth: 2,
			borderColor: "#252b2e",
			data: [7],
			type: "line",
			pointStyle: "line",
			pointRadius: 105
		}, {
			label: "First",
			backgroundColor: '#39984a',
			borderWidth: 1,
			data: [5],
			xAxisID: "bar-x-axis1",
		}, {
			label: "Second",
			backgroundColor: '#81d08f',
			borderWidth: 1,
			data: [10],
			xAxisID: "bar-x-axis2",
		}]
	};

	var commitOptions = {
		responsive: true,
		maintainAspectRatio: false,
		tooltips: {enabled: false},
		hover: {mode: null},
		scales: {
		xAxes: [{
			stacked: false
		}, {
			display: false,
			stacked: true,
			id: "bar-x-axis1",
			barThickness: 156,
			type: 'category',
			categoryPercentage: 1,
			barPercentage: 1,
			gridLines: {
				offsetGridLines: true
			}
	    }, {
			display: false,
			stacked: true,
			id: "bar-x-axis2",
			barThickness: 170,
			type: 'category',
			categoryPercentage: 1,
			barPercentage: 1,
			gridLines: {
				offsetGridLines: true
			}
		}],
		yAxes: [{
			stacked: false,
			ticks: {
				beginAtZero: true, fontFamily:"Lato-Light"
			},
			afterFit: function(scaleInstance) {
        		scaleInstance.width = 40; // sets the width to 100px
      		}
		}]
	  }
	};
	cd.mitParis = new Chart(ctx1, {
	  type: 'bar',
	  data: commitData,
	  options: commitOptions 
	});
}
function updateChart(){
	var max = 0;
	$.each(cd.maxVals,function(i,v){
		max = max + v;
	})
	var high = 0;
	$.each(cd.highVals,function(i,v){
		high = high + v;
	})
	var per = roundTo(high/max*100, 0);
	$("#cd_perCe").html(per);
	//max = max - high;
	cd.mitParis.data.datasets[0].data = [cd.parisBar];
	cd.mitParis.data.datasets[1].data = [high];
	cd.mitParis.data.datasets[2].data = [max];
	cd.mitParis.update();
	// cd.mitPathChart.data.datasets[0].data = cd.maxVals;
	// cd.mitPathChart.update();
	var w = $(".pw-grid-wrap").children().eq(0).children().eq(1).outerWidth() * 8
	$(" .pw-bar").each(function(i,v){
		var x = 0;
		if (cd.maxVals[i] > 40){
			x = w;
			$(v).addClass("over-forty")
		}else{
			x = cd.maxVals[i] / 40 * w;
			$(v).removeClass("over-forty")
		}
		$(v).animate({width: x + "px"}, 500 );
	})
	$(" .pathway-label").each(function(i,v){
		if (cd.lblArray[i] == -99){
			$(v).html("N/A")
		}else{
			var y = roundTo(cd.lblArray[i], 4)
			y = commaSeparateNumber(y)
			if (i == 1 || i == 2 || i == 4 || i == 6 || i == 7 || i == 8 || i == 9){
				$(v).html('<img src="images/lowCost.png" height="17px" width="17px" style="margin-top:2px; margin-right:2px;">' + y)	
			}else{
				$(v).html(y)	
			}
		}
	})
}			