/**
 * Created by seky on 2017/8/12.
 * 绘制玫瑰图
 */
function basicPolarSpider(container,title,xAxis,nearSea,outSea){
    $('#'+container).highcharts({
        chart: {
            polar: true,
            type: 'line',
            height: "32%"
        },
        title: {
            text: title+"月平均值",
            x: -80
        },
        pane: {
            size: '80%'
        },
        exporting: {
            width: 600
        },
        xAxis: {
            categories: ['北', '北东北', '东北', '东东北','东','东东南','东南','南东南','南','南西南','西南','西西南','西','西西北',
                '西北', '北西北'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },
        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.2f}米/每秒</b><br/>'
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
        },
        series: [{
            name: '近岸月平均',
            data: nearSea,
            pointPlacement: 'on'
        }, {
            name: '外海月平均',
            data: outSea,
            pointPlacement: 'on'
        }],
        credits: {
            enabled: false//去除水印链接
        }
    });
}