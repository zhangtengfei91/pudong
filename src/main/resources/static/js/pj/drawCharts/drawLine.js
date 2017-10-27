/**
 * Created by seky on 2017/8/12.
 * 绘制各类线状图
 */
function basicLine(container,title,xAxis,unit,data) {
    $("#"+container).highcharts({
        title: {
            text: title+'月平均值',
            x: -20
        },
        chart: {
            height:"31%"
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: unit
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: unit
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: data,
        credits: {
            enabled: false//去除水印链接
        }
    });
}
