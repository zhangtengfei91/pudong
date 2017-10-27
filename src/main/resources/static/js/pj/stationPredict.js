/**
 * Created by seky on 17/3/18.
 * 站点预报
 * points 站点 [[121.50,32.10],[121.50,32.10]]
 */
var stationLayerGraphic;//预报点
var stationTxtSymLayerGraphic;//预报点文本Symbol
function stationPrdict_createPoint(points,picUrl,picWidth,picHeight,att) {
    require([
        "esri/layers/GraphicsLayer",
        "dojo/domReady!"
    ], function (GraphicsLayer) {
        //站位数据链接
        var stationUrl = "http://wx.dhybzx.org:18080/forecast/shanghai_sea_env/";
        //创建站点
        stationLayerGraphic = new GraphicsLayer({"id":"station"
        });
        for (var i = 0; i < points.length; ++i) {
            var pointNo = points[i].id;//站点编号
            var datas = getJsonDataFromRomate(stationUrl + pointNo);//获取到站位数据对象
            var symbol = commonFun_picMarkerSymbol(picUrl[i], picWidth[i], picHeight[i]);//创建PictureMarkerSymbol
            var pt = commonFun_createPoint(points[i].position[0], points[i].position[1]);//创建点
            //发布日期转换成Date
            var publishdate = commonFun_DealPublishDate(datas[0].publishdate);//发布日期
            var publishTime = datas[0].publishtime;//发布时间
            var tide1Time = datas[0].tidehtime1;//第一次潮汐时间
            var tide2Time = datas[0].tidehtime2;//第二次潮汐时间
            var waterw = datas[0].waterw;//流速
            var wavedirection = datas[0].wavedirection;//浪向
            var waveheight = datas[0].waveheight;//浪高

            //弹窗内容 可以是html内容
            var content = "<div>" +
                "<div id='publishDiv'><label>发布时间：</label><label id='pubDate'>" + publishdate + " " + publishTime + "时</label></div>" +
                "<div id='tideDiv1'><label>第一次潮汐时间：</label><label id='tide1'>" + tide1Time + "</label></div>" +
                "<div id='tideDiv2'><label>第二次潮汐时间：</label><label id='tide1'>" + tide2Time + "</label></div>" +
                "<div id='waterDiv'><label>海流速：</label><label id='waterw'>" + waterw + "</label></div>" +
                "<div id='WaveDirDiv'><label>海浪向：</label><label id='wavedirection'>" + wavedirection + "</label></div>" +
                "<div id='WaveHeightDiv'><label>海浪高：</label><label id='waveheight'>" + waveheight + "</label></div>" +
                "</div>";
            var popupTemplate = commonFun_createPopupTemplate(points[i].name + "站", content);//设置弹窗
            var picGraphic = commonFun_createGraphic(pt, symbol, att, popupTemplate);
            stationLayerGraphic.graphics.add(picGraphic);
        }
        myMap.removeMany([marinEnviLayerGraphic,marinEnviTxtSymLayerGraphic,drainOutletLayerGraphic,drainOutTxtSymLayerGraphic]);//清除环境监测、排污口
        myMap.add(stationLayerGraphic);

    });
}
    //创建文本symbol
    function stationPrdict_createTxtSymbol(points,txtColor,att,fontSize) {
        require([
            "esri/layers/GraphicsLayer",
            "dojo/domReady!"
        ], function (GraphicsLayer) {
            stationTxtSymLayerGraphic = new GraphicsLayer({"id":"stationTxtSym"
            });
            for (var i = 0; i < points.length; ++i) {
                var pointName = points[i].name;//站点编号
                var symbol = commonFun_txtSymbol(txtColor, pointName, fontSize);//textSymbol
                var pt = commonFun_createPoint(points[i].position[0], points[i].position[1]);//创建点
                var picGraphic = commonFun_createGraphic(pt, symbol, att, null);
                stationTxtSymLayerGraphic.graphics.add(picGraphic);

            }
            myMap.add(stationTxtSymLayerGraphic);
        });
    }
