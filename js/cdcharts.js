function createChart(){
	// Set global chart variables
	Chart.defaults.global.tooltips.enabled = false;
	Chart.defaults.global.legend.display = false;
	
	// mitigation pathways chart
	var ctx = $("#pathwayChart");
	cd.mitPathChart = new Chart(ctx, {
	    type: 'horizontalBar',
	    data: {
	        labels: ["", "", "", "", "", "", "", "", "", ""],
	        datasets: [{
	            label: '# of Votes',
	            data: [12, 19, 3, 1400, 8, 3, 7, 9, 10, 5],
	            backgroundColor:"#B0D6EA",
	            borderWidth: 0
	        }]
	    },
	    options: {
	    	responsive: true,
			maintainAspectRatio: false,
	        scales: {
	            xAxes: [{ ticks: { beginAtZero:true, max:40 } }]
	        }
	    }
	});
	// Commitment chart
	var ctx1 = $("#commitmentChart");
	var data = {
	  labels: ["", ""],
	  datasets: [{
	      backgroundColor: "#247BB6",
	      borderColor: "#247BB6",
	      data: [0,40]
	    }, {
	      backgroundColor: "#49B2E3",
	      borderColor: "#49B2E3",
	      data: [0,60]
	    }, {
	      backgroundColor: "#3C454A",
	      borderColor: "#3C454A",
	      data: [85,0]
	    }]
	};

	cd.mitParis = new Chart(ctx1, {
	  type: 'bar',
	  data: data,
	  options: {
	  	responsive: true,
		maintainAspectRatio: false,
	    scales: {
	  		xAxes: [{stacked: true}],
	    	yAxes: [{
	      	stacked: true,
	      	ticks: {
	        	beginAtZero: true 
	         }
	      }]
	    }
	  }
	});

	// max value vs cost effective pie chart
	var mcc = $("#mcPieChart");
	var pdata = {
    	datasets: [{
        	data: [10, 20],
        	backgroundColor: ["#247BB6", "#49B2E3"],
        	borderColor: "#247BB6",
        	borderWidth: 0,
        	hoverBackgroundColor: ["#247BB6", "#49B2E3"],
        	hoverBorderColor: "#247BB6",
        	hoverBorderWidth: 0
    	}]
	};
	cd.mcPieChart = new Chart(mcc,{
    	type: 'pie',
    	data: pdata
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
	cd.mitParis.data.datasets[0].data = [0,high];
	cd.mitParis.data.datasets[1].data = [0,max];
	cd.mitParis.data.datasets[2].data = [cd.parisBar,0];
	cd.mitParis.update();
	cd.mitPathChart.data.datasets[0].data = cd.sumVals;
	cd.mitPathChart.update();
	$(" .pathway-label").each(function(i,v){
		if (cd.lblArray[i] == -99){
			$(v).html("N/A")
		}else{
			var y = roundTo(cd.lblArray[i], 4)
			y = commaSeparateNumber(y)
			if (i == 1 || i == 2 || i == 4 || i == 6 || i == 7 || i == 8 || i == 9){
				$(v).html('<img src="images/lowCost.png" height="17px" width="17px" style="margin-top:-2px; margin-right:2px;">' + y)	
			}else{
				$(v).html(y)	
			}
		}
	})
}			