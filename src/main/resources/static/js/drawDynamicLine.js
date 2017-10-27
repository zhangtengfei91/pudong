//实时绘制线性
function initDynamicChart(){
	Highcharts.setOptions({
	    global: {
	        useUTC: false
	    }
	});
	function activeLastPointToolip(chart) {
	    var points = chart.series[0].points;
	    chart.tooltip.refresh(points[points.length -1]);
	}
	$('#container').highcharts({
	    chart: {
	        type: 'spline',
	        animation: Highcharts.svg, // don't animate in old IE
	        marginRight: 10,
	        width:285,
	        height:250,
	        events: {
	            load: function () {
	                // set up the updating of the chart each second
	                var series = this.series[0],
	                    chart = this;
	                setInterval(function () {
	                    var x = (new Date()).getTime(), // current time
	                        y = Math.random()*5+1;
	                    series.addPoint([x, y], true, true);
	                    activeLastPointToolip(chart)
	                }, 2000);
	            }
	        }
	    },
	    title: {
	        text: '海面风实时数据变化情况'
	    },
	    xAxis: {
	        type: 'datetime',
	        tickPixelInterval: 150
	    },
       	credits: {
            enabled: false//去除水印链接
        },
	    yAxis: {
	        title: {
	            text: '风速(米/秒)'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }],
	         plotBands: [{ // Light air
                from: 0.3,
                to: 1.5,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: '轻空气',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 1.5,
                to: 3.3,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: '微风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 3.3,
                to: 5.5,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: '柔和风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Moderate breeze
                from: 5.5,
                to: 8,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: '温和风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Fresh breeze
                from: 8,
                to: 11,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: '清新风',
                    style: {
                        color: '#606060'
                    }
                }
            }]
	    },
	    tooltip: {
	        formatter: function () {
	            return '<b>' + this.series.name + '</b><br/>' +
	                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
	                Highcharts.numberFormat(this.y, 2);
	        }
	    },
	    legend: {
	        enabled: false
	    },
	    exporting: {
	        enabled: false
	    },
	    series: [{
	        name: '海面风',
	        data: (function () {
	            // generate an array of random data
	            var data = [],
	                time = (new Date()).getTime(),
	                i;
	            for (i = -19; i <= 0; i += 1) {
	                data.push({
	                    x: time + i * 10000,
	                    y: Math.random()*5+1
	                });
	            }
	            return data;
	        }())
	    }]
	}, function(c) {
	    activeLastPointToolip(c)
	}); 
}