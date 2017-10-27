/**
 * Created by seky on 2017/8/12.
 * 绘制各类型的柱状图
 */
//基础的柱状图
function basicColumn(container,title,xAxis,unit,data) {
    $("#"+container).highcharts({
        chart: {
            type: 'column',
            height:"31%"
        },
        title: {
            text: title+'月平均值'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories:  xAxis,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: unit
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data,
        credits: {
            enabled: false//去除水印链接
        },
        exporting: {
            height:"32%"
        },
    });
}
