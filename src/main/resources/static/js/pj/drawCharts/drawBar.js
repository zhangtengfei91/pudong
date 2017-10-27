/**
 * Created by seky on 2017/8/12.
 * 绘制条状图
 */
function basicBar(container,title,xAxis,nearSea,outSea) {
    //var categories = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var outSeaOpp = [];
    for(var i= 0;i<outSea.length;i++){
        outSeaOpp[i] = -outSea[i];
    }
    $('#'+container).highcharts({
        chart: {
            type: 'bar',
            height: "32%"
        },
        title: {
            text:title+ '月平均值'
        },
        xAxis: [{
            categories: xAxis,
            reversed: false,
            labels: {
                step: 1
            }
        }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: xAxis,
            linkedTo: 0,
            labels: {
                step: 1
            }
        }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return (this.value > 0 ? this.value :(-this.value)) + 'm/s';
                }
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ', 月份： ' + this.point.category + '</b><br/>' +
                    title + (this.point.y>0 ?this.point.y:(-this.point.y))+" m/s";
            }
        },
        series: [{
            name: '近岸月平均',
            data: nearSea
        }, {
            name: '外海月平均',
            data: outSeaOpp
        }],
        exporting: {
            width: 600
        },
        credits: {
            enabled: false//去除水印链接
        }
    });
}