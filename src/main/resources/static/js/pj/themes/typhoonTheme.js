/**
 * 台风专题对象(此模块需要放在tools/jQuery/kendo/arcgisAPI之后加载)
 *
 * @constructor dsy 20170826
 */
var Typhoon = function() {
    /** 以下允许初始化时更改 */
    this._sets = {
        theme: "台风专题", // 专题名称
        title: "历史台风一览", // 专题主面板名称
        curIndex: 0, // 初次展示的台风序号
        basicLayer: null, // 基础底图图层
        yourMap:null, // 地图对象
        filePath:null, // 文件路径
        pathAlpha: 0.25, // 虚化路径的透明度
        holoAlpha: 0.25, // 风圈透明度
        pointsNum: 20, // 图形精度
        infoGrid: null, // 台风主面板
        pathGrid: null, // 台风路径面板
        setsGrid: null, // 预报机构面板
        legendGrid: null, // 图例面板
        floatPathGrid: null, //浮动路径面板
        floatForecastGrid: null, // 浮动预报路径面板
        overviewGrid: null, // 一览面板
        spatialStd: 4490, // 坐标标准
        drawSpeed: 100,   // 绘图速度
        floatShowTime: 200, // 浮动面板显示时间
        floatCloseTime: 100, // 浮动面板关闭时间
        isZoom: true, // 是否缩放至台风所在位置
        ratio: 1.5, // 移入点时的扩大倍数
        castInBegin: true, // 开始时播放台风
        details: {
            infoGrid_pageSize: 5, //主面板--页显示数目
            infoGrid_buttonCount: 4, // 主面板--页控制按钮数目
            pathGrid_pageSize: 20, // 路径面板--页显示数目
            pathGrid_buttonCount: 8 // 路径面板--页控制按钮数目
        }
    };
    /** 以下只允许专题运行时更改 */
    const self = this;
    this._typhoonAllLayers = []; //所有台风图层
    this._timer = []; // 绘图触发器数组
    this._setsForcast = [
        {"id": 'cn',"content":'中国'},
        {"id": 'zhk',"content":'中国香港'},
        {"id": 'jp',"content":'日本'},
        {"id": 'ztw',"content":'中国台湾'},
        {"id": 'am',"content":'美国'},
        {"id": 'kg',"content":'韩国'},
        {"id": 'eu',"content":'欧洲'}
    ]; // 预报机构
    this._selectSets = []; // 点选的预报机构序列
    this._sectors = [{
        "dir": 'ne',  //东北方向
        "start": 0,
        "end": 90
    }, {
        "dir": 'nw', //西北方向
        "start": 90,
        "end": 180
    }, {
        "dir": 'sw', //西南方向
        "start": 180,
        "end": 270
    }, {
        "dir": 'se', // 东南方向
        "start": 270,
        "end": 360
    }]; //绘制台四个扇形参数
    this._margin = 0; // 视点边界
    this._typhoonData = null; // 台风数据
    this._windStrength = [
        {name:"亚热带低压", power:6},
        {name:"热带风暴", power: 9},
        {name:"强热带风暴", power: 11},
        {name:"台风", power: 13},
        {name:"强台风", power: 15},
        {name:"超强台风", power: 17}
    ]; // 风级面板内容
    this._forecastCols = [
        {col: "forecastSets",          value:["sets"],                  name: "预报机构：", unit: [""],        type: Util.STRING},
        {col: "forecastPastTime",      value:["time"],                  name: "当前时间：", unit: [""],        type: Util.TIME2},
        {col: "forecastCenterPoint",   value:["longitude", "latitude"], name: "中心位置：", unit: ["°E", "°N"],type: Util.NUMBER, split: ","},
        {col: "forecastMaxWindPower",  value:["power"],                 name: "最大风级：", unit: ["级"],      type: Util.NUMBER},
        {col: "forecastMaxWindSpeed",  value:["speed"],                 name: "最大风速：", unit: ["米/秒"],   type: Util.NUMBER},
        {col: "forecastCenterPressure",value:["pressure"],              name: "中心气压：", unit: ["百帕"],    type: Util.NUMBER},
        {col: "forecastMoveSpeed",     value:["move_speed"],            name: "移动速度：", unit: ["公里/小时"],type: Util.NUMBER},
        {col: "forecastMoveDirection", value:["move_dir"],              name: "移动方向：", unit: [""],        type: Util.STRING}
    ]; // 预报列表项
    this._pathCols = [
        {col: "tfPastTime",      value:["time"],                  name: "当前时间：",    unit:[""],         type: Util.TIME2},
        {col: "tfCenterPoint",   value:["longitude", "latitude"], name: "中心位置：",    unit:["°E", "°N"], type: Util.NUMBER, split: ","},
        {col: "tfMaxWindPower",  value:["power"],                 name: "最大风级：",    unit:["级"],       type: Util.NUMBER},
        {col: "tfCenterPressure",value:["pressure"],              name: "中心气压：",    unit:["百帕"],     type: Util.NUMBER},
        {col: "tfMoveSpeed",     value:["speed"],                 name: "移动速度：",    unit:["公里/小时"], type: Util.NUMBER},
        {col: "tfMoveDirection", value:["move_dir"],              name: "移动方向：",    unit:[""],         type: Util.STRING},
        {col: "tfRadius_7",      value:["radius7_quad"],          name: "七级风圈半径：", unit:["公里"],     type: Util.DEFINED},
        {col: "tfRadius_10",     value:["radius10_quad"],         name: "十级风圈半径：", unit:["公里"],     type: Util.DEFINED},
        {col: "tfRadius_12",     value:["radius12_quad"],         name: "十二级风圈半径：",unit:["公里"],    type: Util.DEFINED}
    ]; // 路径列表项
    this._overviewCols = [
        {col: "overviewTitle", value:["tfbh","name","ename"], unit:["","",""] , type:Util.STRING}
    ]; // 一览表项
}

/**
 * 台风专题函数汇总
 *
 * @type {{
 * theme: (string), 获得专题名称
 * defaultDrawSpeed: (number), 获得默认播放速度
 * typhoonData: (*),
 * map: Map, 获得Map对象
 * removeLayersByIndex: Typhoon.removeLayersByIndex, 删除指定图层序号的台风的所有图层
 * properties, 配置
 * destroyTyphoons: Typhoon.destroyTyphoons, 清理台风专题
 * runNow: Typhoon.runNow, 运行台风专题
 * loadOverviewGrid: Typhoon.loadOverviewGrid, 加载一览面板
 * loadFloatPathGrid: Typhoon.loadFloatPathGrid, 加载浮动路径面板
 * loadFloatForecastGrid: Typhoon.loadFloatForecastGrid, 加载浮动预报面板
 * loadTyphoonInfoGrid: Typhoon.loadTyphoonInfoGrid, 加载台风主面板
 * loadTyphoonGrid: Typhoon.loadTyphoonGrid, 加载台风面板
 * loadTyphoonSetsGroups: Typhoon.loadTyphoonSetsGroups, 加载台风预报机构面板
 * loadTyphoonLegend: Typhoon.loadTyphoonLegend, 加载台风图例面板
 * getTyphoonLayer: Typhoon.getTyphoonLayer, 获取台风图层
 * setTyphoonExtent: Typhoon.setTyphoonExtent, 设置台风视点位置
 * typhoonDraw: Typhoon.typhoonDraw, 绘制台风路径
 * getTyphoonColor: Typhoon.getTyphoonColor, 获取台风路径点颜色
 * drawTyphoonHolo: Typhoon.drawTyphoonHolo, 绘制风圈
 * getSetsColor: Typhoon.getSetsColor, 获取预报机构颜色
 * forecastDraw: Typhoon.forecastDraw, 绘制预报路径
 * refresh_forecast: Typhoon.refresh_forecast, 重绘预报路径
 * getMaxMinValueStr: Typhoon.getMaxMinValueStr, 获取台风半径最大最小值
 * controlTyphoonDraw: Typhoon.controlTyphoonDraw 控制台风绘图
 * }}
 */
Typhoon.prototype = {
    /**
     * 专题标题
     *
     * @return {string}
     */
    get theme() {
       return this._sets.theme;
    },
    /**
     * 默认绘图速度
     *
     * @return {number}
     */
    get defaultDrawSpeed() {
        return this._sets.drawSpeed;
    },
    /**
     * 获得台风数据
     *
     * @return {*|JSON}
     */
    get typhoonData() {
        return this._typhoonData;
    },
    /**
     * 获得地图对象
     *
     * @return {Map}
     */
    get map() {
      return this._sets.yourMap;
    },
    /**
     * 删除指定图层序号的台风的所有图层
     *
     * @param index 图层序号
     */
    removeLayersByIndex: function(index) {
        if (this._typhoonAllLayers[index]) {
            this.map.removeLayer(this._typhoonAllLayers[index].typhoon);
            this.map.removeLayer(this._typhoonAllLayers[index].holo);
            this.map.removeLayer(this._typhoonAllLayers[index].path);
            this.map.removeLayer(this._typhoonAllLayers[index].forecast_points);
            this.map.removeLayer(this._typhoonAllLayers[index].forecast_path);
            this._typhoonAllLayers[index].drawComplete = false;
        }
    },
    /**
     * 台风专题初始化
     *
     * @param {sets} 初始化设置
     */
    set properties(sets) {
        if (sets) {
            for (var props in sets) {
                for (var elem in this._sets) {
                    if (props == elem) {
                        this._sets[elem] = sets[props];
                    }
                }
            }
            if (!this._sets.yourMap || !this._sets.filePath) {
                console.error("Map and FilePath can't be null or undefined.");
                return;
            }
        }
        this._selectSets = [].concat(this._setsForcast); // 默认选择全部预报机构
        this._typhoonData = Util.getLocalJSON(this._sets.filePath); // 从文件路径中读取文件数据
    },
    /**
     * 清理台风专题
     */
    destroyTyphoons: function () {
        // 停止全部的触发器
        for (var i=0; i<this._timer.length; i++) {
            if (this._timer[i]) {
                this._timer[i].stop();
            }
        }

        // 清除所有图层
        for (var i=0; i<this._typhoonAllLayers.length; i++) {
            this.removeLayersByIndex(i);
        }

        // 隐藏全部面板
        if (this._sets.infoGrid)
            $("#" + this._sets.infoGrid).hide();
        if (this._sets.pathGrid)
            $("#" + this._sets.pathGrid).hide()
        if (this._sets.legendGrid)
            $("#" + this._sets.legendGrid).hide();
        if (this._sets.setsGrid)
            $("#" + this._sets.setsGrid).hide();
        if (this._sets.floatPathGrid) {
            $("#" + this._sets.floatPathGrid).hide();
        }
        if (this._sets.floatForecastGrid) {
            $("#" + this._sets.floatForecastGrid).hide();
        }
        if (this._sets.overviewGrid) {
            $("#" + this._sets.overviewGrid).hide();
        }
    },
    /**
     * 依据配置开始运行主题
     */
    runNow: function() {
        if (this._sets.basicLayer != null && !this.map.getLayer(this._sets.basicLayer)) {
            this.map.addLayer(this._sets.basicLayer);
        }
        if (this._sets.infoGrid != null) {
            // 显示并加载台风信息面板
            $("#" + this._sets.infoGrid).show();
            this.loadTyphoonInfoGrid();
        } else {
            console.log("not exist infoGrid.");
        }
        if (this._sets.setsGrid != null) {
            // 显示并加载台风预报机构面板
            $("#" + this._sets.setsGrid).show();
            this.loadTyphoonSetsGroups();
        } else {
            console.log("not exist setsGrid.");
        }
        if (this._sets.legendGrid != null) {
            // 显示并加载台风图例面板
            $("#" + this._sets.legendGrid).show();
            this.loadTyphoonLegend();
        } else {
            console.log("not exist legendGrid.");
        }
        if (this._sets.floatForecastGrid != null) {
            // 隐藏并加载浮动预报路径面板
            $("#" + this._sets.floatForecastGrid).hide();
            this.loadFloatForecastGrid();
        } else {
            console.log("not exist floatForecastGrid.");
        }
        if (this._sets.floatPathGrid != null) {
            // 隐藏并加载浮动台风路径面板
            $("#" + this._sets.floatPathGrid).hide();
            this.loadFloatPathGrid();
        } else {
            console.log("not exist floatPathGrid.");
        }
        if (this._sets.castInBegin) {
            Util.controlItem(this._sets.infoGrid, this._sets.curIndex);
        }
    },
    /**
     * 加载一览面板
     */
    loadOverviewGrid: function(index) {
        var overviewGrid = $("#" + this._sets.overviewGrid);
        if (!overviewGrid.length || overviewGrid.length !== 1) {
            console.error("overviewGrid isn't exist or is named!");
            return;
        }

        Util.initFloatPanel(overviewGrid, this._overviewCols);
        Util.dynamicFloatPanel(this._overviewCols, this.typhoonData[index]);
        overviewGrid.show(this._sets.floatShowTime);
    },
    /**
     * 加载浮动路径面板
     */
    loadFloatPathGrid: function() {
        var pathGrid = $("#" + this._sets.floatPathGrid);
        if (!pathGrid.length || pathGrid.length !== 1) {
            console.error("floatForecastGrid isn't exist or is named!");
            return;
        }
        Util.initFloatPanel(pathGrid, this._pathCols);
    },
    /**
     * 加载浮动预报面板
     */
    loadFloatForecastGrid: function() {
        var floatForecast = $("#" + this._sets.floatForecastGrid);
        if (!floatForecast.length || floatForecast.length !== 1) {
            console.error("floatForecastGrid isn't exist or is named!");
            return;
        }
        Util.initFloatPanel(floatForecast, this._forecastCols);
    },
    /**
     * 加载图层信息选择列表
     */
    loadTyphoonInfoGrid: function () {
        // 记录全部台风的选择状态，开始默认为0
        var typhoonOldLogicTable = [];
        for (var i=0; i<this.typhoonData.length; i++) {
            typhoonOldLogicTable[i] = 0;
        }
        // 记录值
        var record = 0;

        var self = this;
        var infoGrid = $("#" + this._sets.infoGrid);
        if (!infoGrid.length || infoGrid.length !== 1) {
            console.error("infoGrid isn't exist or is named!");
            return;
        }
        infoGrid.kendoGrid({
            columns: [
                {selectable: true, width: 29},
                {field:"tfbh", title:"编号", width: 64},
                {field:"name", title:"中文名", width: 70},
                {field:"ename", title:"英文名", width: 55}
            ],
            toolbar: self._sets.title,
            dataSource: {
                data: self.typhoonData,
                pageSize: self._sets.details.infoGrid_pageSize
            },
            pageable: {
                buttonCount: self._sets.details.infoGrid_buttonCount
            },
            change: function(e) {
                var selectRows = this.select();
                // 初始化一个新的纪录表
                var typhoonNewLogicTable = [];
                for (var i=0; i<self.typhoonData.length; i++) {
                    typhoonNewLogicTable[i] = 0;
                }
                // 记录选择的台风的新状态，将选择的台风序号对应的记录表值赋为1
                for (var k =0; k<selectRows.length; k++) {
                    typhoonNewLogicTable[selectRows[k].sectionRowIndex] = 1;
                }
                // 新旧记录表对比
                for (var j=0; j<self.typhoonData.length; j++) {
                    // 如果上次选择了台风而本次未选择，则执行取消选择操作
                    if (typhoonOldLogicTable[j] == 1 && typhoonNewLogicTable[j] == 0) {
                        // 删除图层操作
                        self.removeLayersByIndex(j);
                        // 更新记录表
                        typhoonOldLogicTable[j] = 0;
                        // 记录最后一个选中的台风
                        if (selectRows.length != 0) {
                            record = selectRows[selectRows.length - 1].sectionRowIndex;
                        } else {
                            record = 0;
                        }
                    }
                    // 如果上次未选择台风而本次选择，则执行选择操作
                    else if (typhoonOldLogicTable[j] == 0 && typhoonNewLogicTable[j] == 1) {
                        // 新建图层并绘制台风
                        self.typhoonDraw(self.typhoonData, j);
                        // 记录当前选择的台风
                        record = j;
                        // 更新记录表
                        typhoonOldLogicTable[j] = 1;
                    }

                }

                // 根据记录值更新台风路径面板
                self.loadTyphoonGrid(record);

                // 更新一览面板
                self.loadOverviewGrid(record);
            },
            scrollable:true
        });
    },
    /**
     * 加载台风路径面板
     *
     * @param index 台风数组序号
     */
    loadTyphoonGrid: function (index) {
        var pathGrid = $("#" + this._sets.pathGrid);
        if (!pathGrid.length || pathGrid.length !== 1) {
            console.error("pathGrid isn't exist or is named!");
            return;
        }

        pathGrid.show();
        pathGrid.kendoGrid({
            columns:[
                {field:"time", title:"时间", width:"60%", template:'#=Util.dateFormat_1(time)#'},
                {field:"power", title:"风力(级)", width:"20%"},
                {field:"speed", title:"风速(m/s)", width:"20%"}
            ],
            pageable: {
                buttonCount: this._sets.details.pathGrid_buttonCount
            },
            toolbar: "<span id='typhoonPathGrid_titlebar'></span>",
            dataSource:{
                data:this.typhoonData[index].points,
                pageSize: this._sets.details.pathGrid_pageSize
            }
        });
        var typhoonPoint = this.typhoonData[index];
        if (typhoonPoint.hasOwnProperty("tfbh") && typhoonPoint.hasOwnProperty("name")) {
            $("#typhoonPathGrid_titlebar").html(typhoonPoint.tfbh + "《" + typhoonPoint.name + "》" + "路径信息");
        }
    },
    /**
     * 加载台风预报机构面板
     */
    loadTyphoonSetsGroups: function () {
        var setsPanel = $("#" + this._sets.setsGrid);
        if (!setsPanel.length || setsPanel.length !== 1) {
            console.error("setsPanel isn't exist or is named!");
            return;
        }
        var cache = ["<table>","<caption>" + "预报机构" + "</caption>", "<tbody>"];
        for (var i=0; i <this._setsForcast.length; i++) {
            if (i%2 == 0)
                cache.push("<tr>");
            var color = Util.arrayToHexString(this.getSetsColor(this._setsForcast[i].content, 255));
            cache.push("<td><input type='checkbox' checked id='"+ this._setsForcast[i].id +"' value='" + i + "'>"+ this._setsForcast[i].content + "</input></td>");
            cache.push("<td><div  style='display: inline;color:"+ color +"'> --</div></td>");
            if (i%2 != 0)
                cache.push("</tr>");
        }
        cache.push("</tbody></table>");

        setsPanel.empty();
        setsPanel.append(cache.join(''));
        var self = this;
        setsPanel.bind("change", function() {
            var cache = [];
            for (var i=0; i<self._setsForcast.length; i++) {
                var setsModel = $("#"+self._setsForcast[i].id);
                if(setsModel.is(':checked')) {
                    cache.push(setsModel.val());
                }
            }
            while(self._selectSets.length != 0)
                self._selectSets.pop();
            while (cache.length != 0) {
                self._selectSets.push(self._setsForcast[cache.pop()]);
            }
            self.refresh_forecast();
        });
    },
    /**
     * 加载图例面板
     */
    loadTyphoonLegend: function () {
        var legendGrid = $("#" + this._sets.legendGrid);
        if (!legendGrid.length || legendGrid.length !== 1) {
            console.error("legendGrid isn't exist or is named!");
            return;
        }
        var cache = ["<table>","<caption>" + "风级强度" + "</caption>", "<tbody>"];
        for (var i=0; i <this._windStrength.length; i++) {
            if (i%2 == 0)
                cache.push("<tr>");
            var color = Util.arrayToHexString(this.getTyphoonColor(this._windStrength[i].power, 255));
            cache.push("<td><div style='display: inline;color:"+ color +"'> ●</div></td>");
            cache.push("<td><label>" + this._windStrength[i].name + "</label></td>");
            if (i%2 != 0)
                cache.push("</tr>");
        }
        cache.push("</tbody></table>");
        legendGrid.empty();
        legendGrid.append(cache.join(''));
    },
    /**
     * 获得台风层级对象
     *
     * @param typhoon 台风点图层
     * @param path 台风路径图层
     * @param holo 台风风圈图层
     * @param forecastPoints 台风预报点图层
     * @param forecastPath 台风预报路径图层
     * @return {{typhoon: *, path: *, holo: *, forecast_points: *, forecast_path: *, drawComplete: boolean}}
     */
    getTyphoonLayer: function (typhoon, path, holo, forecastPoints, forecastPath) {
        return {"typhoon":typhoon, "path":path, "holo": holo, "forecast_points": forecastPoints, "forecast_path":forecastPath, "drawComplete": false};
    },
    /**
     * 设置台风的初始视点
     *
     * @param extent 视点
     */
    setTyphoonExtent: function (points){
        if (!points || !(points instanceof Array)) {
            console.log("points can't be null!");
            return;
        }
        var xmax = points[0].longitude;
        var xmin = points[0].longitude;
        var ymax = points[0].latitude;
        var ymin = points[0].latitude;
        for (var i=1; i<points.length; i++) {
            if (points[i].longitude > xmax) {
                xmax = points[i].longitude;
            } else if (points[i].longitude < xmin) {
                xmin = points[i].longitude;
            }
            if (points[i].latitude > ymax) {
                ymax = points[i].latitude;
            } else if (points[i].latitude < ymin) {
                ymin = points[i].latitude;
            }
        }
        var yourExtent = new esri.geometry.Extent({
            "xmax":xmax + this._margin,"xmin":xmin - this._margin,
            "ymax":ymax + this._margin,"ymin":ymin - this._margin,
            "spatialReference":{"wkid": this._sets.spatialStd}
        });

        this.map.setExtent(yourExtent);
    },
    /**
     * 绘制台风路径
     *
     * @param typhoonData 台风数据数组
     * @param select 绘制的台风数据编号
     */
    typhoonDraw: function(typhoonData, select) {
        var self = this;
        require([
            "esri/geometry/Circle",
            "esri/symbols/PictureMarkerSymbol",
            "esri/layers/GraphicsLayer",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/SpatialReference",
            "dojo/on",
            "dojo/dom",
            "dojo/domReady!"
        ], function(Circle,PictureMarkerSymbol,GraphicsLayer,SimpleMarkerSymbol,SimpleLineSymbol, SpatialReference, on ,dom) {
            //需要导入图层服务新建图层
            var typhoonLayer = new GraphicsLayer({"id": typhoonData[select].ename + "-point"});
            var typhoonPathLayer = new GraphicsLayer({"id": typhoonData[select].ename + "-path"});
            var typhoonHoloLayer = new GraphicsLayer({"id": typhoonData[select].ename + "-holo"});
            var typhoonForecastLayer = new GraphicsLayer({"id": typhoonData[select].ename + "-forecast_points"});
            var typhoonForecastPathLayer = new GraphicsLayer({"id": typhoonData[select].ename + "-forecast_path"});
            self.map.addLayer(typhoonHoloLayer);   // 风圈图层-最底层
            self.map.addLayer(typhoonForecastPathLayer); // 预报路径图层-中层
            self.map.addLayer(typhoonForecastLayer); // 预报点图层-中层
            self.map.addLayer(typhoonPathLayer); // 台风路径图层-上层
            self.map.addLayer(typhoonLayer); // 台风点图层-上层
            self._typhoonAllLayers[select] = self.getTyphoonLayer(
                typhoonLayer,
                typhoonPathLayer,
                typhoonHoloLayer,
                typhoonForecastLayer,
                typhoonForecastPathLayer
            );
            var typhoonPath = typhoonData[select].points; // 台风路径信息
            var typhoonStyles = []; // 图层样式数组
            var sr = new SpatialReference({wkid: self._sets.spatialStd}); // 坐标标准

            var styles = {
                "alphalLineStyle": new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([0, 0, 0, self._sets.pathAlpha]),
                    3
                ),
                "solidLineStyle": new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([0, 0, 0, 1]),
                    3
                ),
                "alphaPointOlStyle": new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([0, 0, 0, self._sets.pathAlpha]),
                    1
                ),
                "solidPointOlStyle": new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([0, 0, 0, 1]),
                    1
                )}; //样式

            // 台风节点点击触发事件
            dojo.connect(typhoonLayer, "onClick", function (e) {
                if (e.target.tagName == 'circle' && self._typhoonAllLayers[select].drawComplete) {
                    var tfObj = e.target.e_graphic.attributes.obj;
                    // 清空风圈图层
                    typhoonHoloLayer.clear();
                    // 绘制风圈
                    self.drawTyphoonHolo(tfObj, tfObj.longitude, tfObj.latitude, typhoonHoloLayer);
                    // 绘制预报路径
                    self.forecastDraw(tfObj, typhoonForecastLayer, typhoonForecastPathLayer);
                    // 虚化路径点
                    var tfIndex = e.target.e_graphic.attributes.index;
                    for (var i = 0; i < typhoonPath.length; i++) {
                        if (i > 0) {
                            if (i < tfIndex) {
                                typhoonStyles[i].point.setSymbol(new esri.symbol.SimpleMarkerSymbol({
                                    "color": self.getTyphoonColor(typhoonPath[i].power, 255),
                                    "size": 7,
                                    "type": "esriSMS",
                                    "style": "esriSMSCircle",
                                    "outline": styles.solidPointOlStyle
                                }));
                                typhoonStyles[i].line.setSymbol(styles.solidLineStyle);
                            } else if (i == tfIndex) {
                                // 解决鼠标点击台风点后移出时台风点变小的问题
                                typhoonStyles[i].point.setSymbol(new esri.symbol.SimpleMarkerSymbol({
                                    "color": self.getTyphoonColor(typhoonPath[i].power, 255),
                                    "size": 7 * self._sets.ratio,
                                    "type": "esriSMS",
                                    "style": "esriSMSCircle",
                                    "outline": styles.solidPointOlStyle
                                }));
                                typhoonStyles[i].line.setSymbol(styles.solidLineStyle);
                            } else {
                                typhoonStyles[i].point.setSymbol(new esri.symbol.SimpleMarkerSymbol({
                                    "color": self.getTyphoonColor(typhoonPath[i].power, 255),
                                    "size": 7,
                                    "type": "esriSMS",
                                    "style": "esriSMSCircle",
                                    "outline": styles.alphaPointOlStyle
                                }));
                                typhoonStyles[i].line.setSymbol(styles.alphalLineStyle);
                            }
                        }
                    }
                }
            });

            // 预报台风节点移入触发事件
            dojo.connect(typhoonForecastLayer, "onMouseOver", function (e) {

                if (e.target.tagName == 'circle') {
                    var forecastPanel = $("#" + self._sets.floatForecastGrid);
                    var newSymbol = new SimpleMarkerSymbol();
                    var oldSymbol = e.target.e_graphic.symbol;
                    var forecastObject = e.target.e_graphic.attributes.obj;
                    forecastObject.sets = e.target.e_graphic.attributes.sets;
                    newSymbol.setColor(oldSymbol.color);
                    newSymbol.setOutline(oldSymbol.outline);
                    newSymbol.setSize(oldSymbol.size * self._sets.ratio);
                    event.graphic.setSymbol(newSymbol);
                    forecastPanel.css("left", e.pageX + 3);
                    forecastPanel.css("top", e.pageY + 3);
                    forecastPanel.show(self._sets.floatShowTime);
                    forecastPanel.css("background-color", Util.arrayToHexString(self.getTyphoonColor(forecastObject.power, 0.6)));
                    Util.dynamicFloatPanel(self._forecastCols, forecastObject);
                }

            });

            // 预报台风节点移开触发事件
            dojo.connect(typhoonForecastLayer, "onMouseOut", function (e) {

                if (e.target.tagName == 'circle') {
                    var newSymbol = new SimpleMarkerSymbol();
                    var oldSymbol = e.target.e_graphic.symbol;
                    newSymbol.setColor(oldSymbol.color);
                    newSymbol.setOutline(oldSymbol.outline);
                    newSymbol.setSize(oldSymbol.size / self._sets.ratio);
                    event.graphic.setSymbol(newSymbol);
                    $("#" + self._sets.floatForecastGrid).hide(self._sets.floatCloseTime);
                }

            });

            // 台风节点移入触发事件
            dojo.connect(typhoonLayer, "onMouseOver", function (e) {

                if (e.target.tagName == 'circle') {
                    var pathPanel = $("#" + self._sets.floatPathGrid);
                    var newSymbol = new SimpleMarkerSymbol();
                    var oldSymbol = e.target.e_graphic.symbol;
                    var tfObject = e.target.e_graphic.attributes.obj;
                    var arrange;
                    newSymbol.setColor(oldSymbol.color);
                    newSymbol.setOutline(oldSymbol.outline);
                    newSymbol.setSize(oldSymbol.size * self._sets.ratio);
                    event.graphic.setSymbol(newSymbol);
                    pathPanel.css("left", e.pageX + 3);
                    pathPanel.css("top", e.pageY + 3);
                    pathPanel.css("background-color", Util.arrayToHexString(self.getTyphoonColor(tfObject.power, 0.6)));
                    pathPanel.show(self._sets.floatShowTime);
                    Util.DEFINED = self.getMaxMinValueStr;  // 设定默认处理方式
                    Util.dynamicFloatPanel(self._pathCols, tfObject);
                }

            });

            // 台风节点移开触发事件
            dojo.connect(typhoonLayer, "onMouseOut", function (e) {

                if (e.target.tagName == 'circle') {
                    var newSymbol = new SimpleMarkerSymbol();
                    var oldSymbol = e.target.e_graphic.symbol;
                    newSymbol.setColor(oldSymbol.color);
                    newSymbol.setOutline(oldSymbol.outline);
                    newSymbol.setSize(oldSymbol.size / self._sets.ratio);
                    event.graphic.setSymbol(newSymbol);
                    $("#" + self._sets.floatPathGrid).hide(self._sets.floatCloseTime);
                }

            });

            // 设置台风的初始视点
            if (self._sets.isZoom) {
                self.setTyphoonExtent(typhoonPath);
            }
            self._timer[select] = new Timer(function (timer) {
                var index = timer.params.current;
                if (index == 0) {
                    var ptStart = new esri.geometry.Point(typhoonPath[index].longitude, typhoonPath[index].latitude, sr);
                    var originSms = new esri.symbol.SimpleMarkerSymbol({
                        "color": self.getTyphoonColor(typhoonPath[index].power, 255),
                        "size": 7,
                        "type": "esriSMS",
                        "style": "esriSMSCircle",
                        "outline": styles.solidPointOlStyle
                    });

                    // 定义图形的几何形状
                    var typhoonPoint = new esri.Graphic(
                        ptStart,
                        originSms,
                        {"obj": typhoonPath[index], "index": index}
                    );
                    typhoonLayer.add(typhoonPoint);
                    // 保存起始点样式
                    typhoonStyles.push({"point": typhoonPoint});
                } else if (index < typhoonPath.length) {
                    // 终止点
                    var ptEnd = new esri.geometry.Point(typhoonPath[index].longitude, typhoonPath[index].latitude, sr);
                    var endSms = new esri.symbol.SimpleMarkerSymbol({
                        "color": self.getTyphoonColor(typhoonPath[index].power, 255),
                        "size": 7,
                        "type": "esriSMS",
                        "style": "esriSMSCircle",
                        "outline": styles.solidPointOlStyle
                    });

                    // 绘制线路径
                    var polylineJson = {
                        "paths": [[[typhoonPath[index - 1].longitude, typhoonPath[index - 1].latitude], // 开始点
                            [typhoonPath[index].longitude, typhoonPath[index].latitude]]], // 结束点
                        "spatialReference": {"wkid": self._sets.spatialStd}

                    };

                    // 绘台风线
                    var typhoonLine = new esri.Graphic(
                        new esri.geometry.Polyline(polylineJson),
                        styles.solidLineStyle
                    );
                    typhoonPathLayer.add(typhoonLine);

                    // 清空风圈图层
                    typhoonHoloLayer.clear();
                    self.drawTyphoonHolo(typhoonPath[index],
                        typhoonPath[index].longitude,
                        typhoonPath[index].latitude,
                        typhoonHoloLayer);

                    // 绘制台风路径点
                    var typhoonPoint = new esri.Graphic(
                        ptEnd,
                        endSms,
                        {"obj": typhoonPath[index], "index": index}
                    );
                    typhoonLayer.add(typhoonPoint);
                    typhoonStyles.push({"point": typhoonPoint, "line": typhoonLine});
                } else {
                    self._typhoonAllLayers[select].drawComplete = true;
                    self.forecastDraw(typhoonPath[index - 1],
                        typhoonForecastLayer,
                        typhoonForecastPathLayer);
                    timer.stop();
                }
                timer.params.current = ++index;
            });
            self._timer[select].params = {current: 0};
            self._timer[select].start(self._sets.drawSpeed);
        });
    },
    /**
     * 依据风级强度获得台风路径点颜色
     *
     * @param power 风级
     * @param t 透明度
     * @return {[number,number,number,number]}
     */
    getTyphoonColor: function (power,t) {
        switch(power) {
            case 5:
            case 6:
                return [0,255,3,t];  // 亚热带低压
            case 7:
            case 8:
            case 9:
                return [0, 98 ,254, t]; // 热带风暴
            case 10:
            case 11:
                return [253,250,0,t]; // 强热带风暴
            case 12:
            case 13:
                return [253,172,3,t]; // 台风
            case 14:
            case 15:
                return [240,114,246,t]; // 强台风
            case 16:
            case 17:
                return [253,0,2,t]; // 超强台风
            default:
                console.log("the level of wind is undefined.");
                return [250,250,250,t];  // 未定义风级
        }
    },
     /**
     * 绘制风圈
     *
     * @param obj 台风路径点
     * @param x 坐标X
     * @param y 坐标Y
     * @param layout 图层
     */
    drawTyphoonHolo: function (obj, x, y, layout) {
        var radius = [{"radius_name": 'radius7_quad',"power": 7},
            {"radius_name": 'radius10_quad',"power": 10},
            {"radius_name": 'radius12_quad',"power": 12}];
        for (var i = 0; i < radius.length; i++) {
            if (radius[i].radius != 0) {
                // 绘制风圈
                for (var j = 0; j < this._sectors.length; j++) {
                    // 台风半径不为0的时候绘制扇形
                    if (obj && // 存在台风对象
                        obj[radius[i].radius_name] && // 存在级别风圈
                        obj[radius[i].radius_name][this._sectors[j].dir] && // 存在风圈方位
                        obj[radius[i].radius_name][this._sectors[j].dir] != 0) {
                        layout.add(Util.drawSector(
                            x,
                            y,
                            Util.seaMileFormat(obj[radius[i].radius_name][this._sectors[j].dir]),
                            this._sectors[j].start,
                            this._sectors[j].end,
                            {'lineColor': [0, 255, 255, 0], 'symbolColor': this.getTyphoonColor(radius[i].power, this._sets.holoAlpha)},
                            this._sets.spatialStd,
                            this._sets.pointsNum
                        ));
                    }
                }
            }
        }
    },
    /**
     * 依据预报机构填充颜色
     */
    getSetsColor: function (sets, alpha) {
    var _sets = sets.trim();
        if (_sets == '中国') {
            return [249, 76, 92, alpha];
        } else if (_sets == '中国香港') {
            return [240, 124, 251, alpha];
        } else if (_sets == '美国') {
            return [74, 220, 253, alpha];
        } else if (_sets == '日本') {
            return [96, 244, 115, alpha];
        } else if (_sets == '中国台湾') {
            return [239,171,99, alpha];
        } else if (_sets == '韩国') {
            return [110,159,161,alpha];
        } else if (_sets == '欧洲') {
            return [55,53,145, alpha];
        } else {
            return [250,250,250,alpha];
        }
    },
    /**
     * 绘制预报路径
     *
     * @param curPt 预报路径点
     * @param pointLayout 点图层
     * @param lineLayout 线图层
     */
    forecastDraw: function(curPt, pointLayout, lineLayout) {
        pointLayout.forecastPoint = curPt;
        var self = this;
        require([
            "esri/geometry/Circle",
            "esri/layers/GraphicsLayer",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/SpatialReference",
            "dojo/on",
            "dojo/dom",
            "dojo/domReady!"
        ], function(Circle,GraphicsLayer,SimpleMarkerSymbol,SimpleLineSymbol,SpatialReference) {
            pointLayout.clear();
            lineLayout.clear();
            var forecastData = curPt.forecast;
            if (!forecastData) {
                return;
            }
            var sr = new SpatialReference({wkid: self._sets.spatialStd}); // 坐标标准
            for (var i = 0; i < forecastData.length; i++) {
                var sets = forecastData[i].sets;
                if (!Util.containsByContent(self._selectSets,"content",sets)) {
                    continue;
                }
                var forecastPoints = [curPt].concat(forecastData[i].points);
                for (var j = 1; j < forecastPoints.length; j++) {
                    // 台风线样式
                    var solidLineStyle = new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_DASH,
                        new esri.Color(self.getSetsColor(sets, 255)), // 颜色需要根据预报机构获得
                        2
                    );

                    // 绘制线路径
                    var polylineJson = {
                        "paths":[[[forecastPoints[j-1].longitude,forecastPoints[j-1].latitude], [forecastPoints[j].longitude,forecastPoints[j].latitude]]],
                        "spatialReference":{"wkid":self._sets.spatialStd}
                    };

                    // 绘台风线
                    var typhoonLine = new esri.Graphic(
                        new esri.geometry.Polyline(polylineJson),
                        solidLineStyle
                    );
                    lineLayout.add(typhoonLine);

                    // 点样式设置
                    var solidPointOlStyle = new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new esri.Color([0,0,0,1]),
                        1
                    );
                    var pointStyle = new esri.symbol.SimpleMarkerSymbol({//draw points and multipoints
                        "color": self.getTyphoonColor(forecastPoints[j].power,255),
                        "size": 7,
                        "type": "esriSMS",
                        "style": "esriSMSCircle",
                        "outline": solidPointOlStyle
                    });
                    // 点位置
                    var pt   = new esri.geometry.Point(forecastPoints[j].longitude, forecastPoints[j].latitude, sr);
                    // 绘制台风路径点
                    var fPoint = new esri.Graphic(
                        pt,
                        pointStyle,
                        {"obj":forecastPoints[j], "index":j, "sets": sets}
                    );
                    pointLayout.add(fPoint);
                }
            }
        });
    },
    /**
     * 重新绘制所有台风的预报路径
     */
    refresh_forecast: function() {
        for(var i=0; i<this._typhoonAllLayers.length; i++) {
            if (this._typhoonAllLayers[i]) {
                var pointLayout = this._typhoonAllLayers[i].forecast_points;
                var curPoint = pointLayout.forecastPoint;
                var lineLayout = this._typhoonAllLayers[i].forecast_path;
                var drawSign = this._typhoonAllLayers[i].drawComplete;
                if (curPoint && pointLayout && lineLayout && drawSign) {
                    this.forecastDraw(curPoint,pointLayout,lineLayout);
                }
            }
        }
    },
    /**
     * 获得风圈半径范围字符串
     *
     * @param radius_quad 风圈半径
     * @return {*}
     */
    getMaxMinValueStr: function(radius_quad) {
        var arr = [radius_quad.ne, radius_quad.se, radius_quad.sw, radius_quad.nw];
        var max = arr[0], min = arr[0];
        for (var i=1; i<arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
            if (arr[i] < min) {
                min = arr[i];
            }
        }
        if (max == 0) {
            return undefined;
        } else if (max == min) {
            return max;
        } else {
            return min + '-' + max;
        }
    },
    /**
     * 控制台风绘制
     *
     * @param index
     */
    controlTyphoonDraw: function (index, switcher, speed) {
        // 如果图层存在且图层绘图未完成时
        if (this._typhoonAllLayers[index] && !this._typhoonAllLayers[index].drawComplete) {
            if (switcher) {
                this._timer[index].start(speed);
            } else {
                this._timer[index].stop();
            }

        }
    }
};