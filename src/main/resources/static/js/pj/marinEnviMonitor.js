/**
 * Created by seky on 17/3/20.
 * 海域环境监测
 */
//海域环境监测站点
var marinEnviLayerGraphic;//环境监测点
var marinEnviTxtSymLayerGraphic;//环境监测点文本Symbol
function marinEnviMonitor_stations(points,picUrl,picWidth,picHeight,att){
    require([
        "esri/layers/GraphicsLayer",
        "dojo/domReady!"
    ], function (GraphicsLayer) {
        //创建站点
        marinEnviLayerGraphic = new GraphicsLayer({"id":"mainEnvi"
        });
        for (var i = 0; i < points.length; ++i) {
            var symbol = commonFun_picMarkerSymbol(picUrl[i], picWidth[i], picHeight[i]);//创建PictureMarkerSymbol
            var pt = commonFun_createPoint(points[i].position[0], points[i].position[1]);//创建点

            //弹窗内容 可以是html内容
            var content = "<div>" +
                "<div id='latLonDiv'><label>东经(E)：</label><label id='lon'>"+att[i].lon+"</label>&nbsp;&nbsp;" +
                "<label>北纬(N)：</label><label id='lon'>"+att[i].lat+"</label></div>" +
                "<div id='monitorDiv'><label>监测要素：</label><label id='monitorE'>"+att[i].monitorE+"</label></div>"+
                "<div id='domainDiv'><label>所属海洋功能区：</label><label id='domain'>"+att[i].domain+"</label></div>"+
                "<div id='areaDiv'><label>区域：</label><label id='area'>"+att[i].area+"</label></div>"+
                "</div>";
            var popupTemplate = commonFun_createPopupTemplate(points[i].name + "监测站", content);//设置弹窗
            var picGraphic = commonFun_createGraphic(pt, symbol, att[i], popupTemplate);
            marinEnviLayerGraphic.graphics.add(picGraphic);
        };
        //清除站点预报的站位图层
        myMap.removeMany([stationLayerGraphic,stationTxtSymLayerGraphic,drainOutletLayerGraphic,drainOutTxtSymLayerGraphic]);//清除预报站点、排污口
        myMap.add(marinEnviLayerGraphic);
    });
}
//创建文本symbol
function marinEnviMonitor_createTxtSymbol(points,txtColor,att,fontSize) {
    require([
        "esri/layers/GraphicsLayer",
        "dojo/domReady!"
    ], function (GraphicsLayer) {
        marinEnviTxtSymLayerGraphic = new GraphicsLayer({"id":"marinEnvTxtSym"
        });
        for (var i = 0; i < points.length; ++i) {
            var pointName = points[i].name;//站点编号
            var symbol = commonFun_txtSymbol(txtColor, pointName, fontSize);//textSymbol
            var pt = commonFun_createPoint(points[i].position[0], points[i].position[1]);//创建点
            var picGraphic = commonFun_createGraphic(pt, symbol, att, null);
            marinEnviTxtSymLayerGraphic.graphics.add(picGraphic);

        }
        myMap.add(marinEnviTxtSymLayerGraphic);
    });
}
