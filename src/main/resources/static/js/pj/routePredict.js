/**
 * Created by seky on 17/3/18.
 * 航线预报
 * lines 航线数据 [[121.50,32.10],[122.50,31.10]],[[122.50,32.10],[122.50,31.10]]
 * colors 航线的颜色 widths 航线宽度
 */
function routePredict_createRouteLine(lines,colors,widths){
    require([
        "esri/layers/GraphicsLayer",
        "dojo/domReady!"
    ], function (GraphicsLayer){
        //站位数据链接
        var stationUrl="http://wx.dhybzx.org:18080/forecast/course_line/";
        //绘制航线
        var routeLayerGraphic=new GraphicsLayer({
        });
        for(var i=0;i<lines.length;++i){
            var pointNo=lines[i].id;//站点编号
            var datas=getJsonDataFromRomate(stationUrl+pointNo);//获取到站位数据对象
            var polyLine=commonFun_createPolyline([lines[i].position]);//创建线
            var simpleLineSymbol=commonFun_createSimpleLineSymbol(colors[i],widths[i]);
            //发布日期转换成Date
            var publishdate=commonFun_DealPublishDate(datas[0].publishdate);//发布日期
            var publishTime=datas[0].publishtime;//发布时间

            var wavedirection=datas[0].wavedirection;//浪向
            var waveheight=datas[0].waveheight;//浪高
            var outdirection=datas[0].OutDIRECTION;//浪外向
            var comfort=datas[0].comfort;//舒适度
            var windspeed=datas[0].windspeed;//风速
            var winddirection=datas[0].winddirection;//风向

            //弹窗内容 可以是html内容
            var content = "<div>" +
                "<div id='publishDiv'><label>发布时间：</label><label id='pubDate'>"+publishdate+" "+publishTime+"时</label></div>" +
                "<div id='WaveDirDiv'><label>海浪向：</label><label id='wavedirection'>"+wavedirection+"</label></div>"+
                "<div id='WaveHeightDiv'><label>海浪高：</label><label id='waveheight'>"+waveheight+"</label></div>"+
                "<div id='outDirDiv'><label>浪外向：</label><label id='outdirection'>"+outdirection+"</label></div>"+
                "<div id='comfortDiv'><label>舒适度：</label><label id='comfort'>"+comfort+"</label></div>"+
                "<div id='windSpeedDiv'><label>海风速：</label><label id='windspeed'>"+windspeed+"</label></div>"+
                "<div id='windDirDiv'><label>海风速：</label><label id='winddirection'>"+winddirection+"</label></div>"+
                "</div>";
            var popupTemplate=commonFun_createPopupTemplate(lines[i].name,content);//设置弹窗
            var lineGraphic=commonFun_createGraphic(polyLine,simpleLineSymbol,null,popupTemplate);//创建线
            routeLayerGraphic.graphics.add(lineGraphic);
        }
        myMap.add(routeLayerGraphic);
    });
}