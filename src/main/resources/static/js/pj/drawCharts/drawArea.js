function basicArea(container,title,xAxis,unit,data) {
    $('#'+container).highcharts({
        chart: {
            type: 'area',
            height:"31%"
        },
        title: {
            text: title+'月平均值'
        },
        xAxis: {
            categories: xAxis,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: unit
            }
        },
        tooltip: {
            split: true,
            valueSuffix: unit
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series:data,
        credits: {
            enabled: false//去除水印链接
        }
    });
}