/**
 * 行船路径专题(此模块需要放在tools/jQuery/kendo/arcgisAPI之后加载)
 *
 * @constructor dsy 20170829
 */
var BoatsPath = function() {
    /** 以下允许初始化时更改 */
    this._sets = {
        theme: "航迹展示", // 专题名称
        title: "航迹一览", // 航迹展示面板标题
        basicLayer: null, // 基础底图图层
        yourMap: null, // 地图对象
        filePath: null, // 文件路径
        trackColor: "#050302", // 航迹样式
        pointColor: "#67d1ff", // 航迹点颜色
        pointOutlineColor: "#010100", // 航迹点外边线颜色
        playColor: "#5075ff", // 播放按钮颜色
        pauseColor: "#ff9427", // 暂停按钮颜色
        pointOutlineWidth: 1, // 航迹外边线宽度
        pointSize: 5, // 航迹点大小
        controlGrid: null, // 行船控制面板
        pathGrid: null, // 航迹控制面板
        floatGrid: null, // 浮动面板
        goSpeed: 2500, // 航行速度
        spatialStd: 4490, // 坐标标准
        pointsNum: 20, // 航迹扇形点精度
        trackAngle: 40, // 航迹扇形开合角度(单边)
        showSpeed: 200, // 默认显示速度
        castInBegin: true, // 开始播放航迹
        ratio: 1.5, // 点移入时的扩大倍数
        isZoom: true, // 播放时是否缩放至船航行开始位置
        boatObj:{url: "/img/boat1.png", width: 30, height:30}, // 船的图形显示
        trackSwitchGrid: "boatTheme_trackSwitchGrid" // 航迹切换面板
    };
    /** 以下只允许专题运行时更改 */
    this._boatsAllLayers = {
        trackLayer: null,   // 航迹-下层
        boatLayer: null,    // 船标-中层
        pointLayer: null   // 航点-上层
    };
    this._showTrackId = 0; // 当前展示的航迹Id号
    this._curBoatSpeed = this._sets.goSpeed; // 实际播放速度
    this._drawComplete = false; // 是否绘制完成标志
    this._timer = null; // 触发器
    this._boatPath = []; // 行船路径组
    this._basicController = {
        defaultId: "myController",
        castButton: {
            id: "boatController_castButton",
            wrap: "<button id='boatController_castButton' " +
            "style='margin-left: 9px;margin-right: 6px;border-radius: 10px;background-color: #e0e0e0;outline:none;" +
            "'></button>",
            start: "<label style='color:" + this._sets.pauseColor + "'>■</label>",
            stop: "<label style='color:" + this._sets.playColor + "'>►</label>"
        },
        speedButton: {
            id: "boatController_speedButton",
            wrap: "<input type='button' " +
            "style='background-color: #e0e0e0;border-radius: 20px;outline: none;'" +
            " id='boatController_speedButton' value='x1'/>"
        }
    } // 播放控制器
    var self = this;
    this._basicController.cast = function (isStart) {
        $("#" + self._basicController.castButton.id).empty();
        if (isStart) {
            $("#" + self._basicController.castButton.id).append(self._basicController.castButton.start);
            $("#" + self._basicController.speedButton.id).css("color", self._sets.playColor);
        } else {
            $("#" + self._basicController.castButton.id).append(self._basicController.castButton.stop);
            $("#" + self._basicController.speedButton.id).css("color", self._sets.pauseColor);
        }
    }; // 播放控制方法
    this._trackSectors = [
        {sectorColor: Util.hexToArrays("#3ad4c9".substr(1)), radius: 20,  text: "20海里"},
        {sectorColor: Util.hexToArrays("#d5ff6f".substr(1)), radius: 50,  text: "50海里"},
        {sectorColor: Util.hexToArrays("#f2ed8a".substr(1)), radius: 100, text: "100海里"},
        {sectorColor: Util.hexToArrays("#f2a01d".substr(1)), radius: 200, text: "200海里"},
        {sectorColor: Util.hexToArrays("#f05b66".substr(1)), radius: 300, text: "300海里"}
    ]; // 航迹扇形
    this._pathCols = [
        {col: "boatTrack_site", value:["x", "y"],  name: "当前位置：",  unit: ["°E", "°N"], type: Util.NUMBER, split: ","},
        {col: "boatTrack_dir",  value:["shipDir"], name: "航向：",     unit: ["°"],        type: Util.NUMBER},
        {col: "boatTrack_wind", value:["wind"],    name: "当前风：",   unit: ["m/s"],         type: Util.STRING},
        {col: "boatTrack_wave", value:["wave"],    name: "当前浪：",   unit: ["m"],         type: Util.STRING},
        {col: "boatTrack_flow", value:["flow"],    name: "当前流：",   unit: ["m/s"],         type: Util.STRING}
    ]; // 浮动面板表项
    this._toolControl = "<div>" +
        "<span style='vertical-align: -webkit-baseline-middle'>" + self._sets.title + "</span>" + // 航迹标题
        "<div style='display: inline;margin-bottom: 4px;vertical-align: -webkit-baseline-middle;' id='" + this._basicController.defaultId + "'></div>" + // 播放面板
        "<div id='"+ this._sets.trackSwitchGrid +"' style='float: right;width:45%;'></div>" // 航迹切换面板
        "</div>";
    // 路径面板标题栏
};

/**
 * 航迹函数汇总
 *
 * @type {{
 * theme: string,  // 专题名称
 * defaultDrawSpeed: number, // 默认绘图速度
 * track: (*), // 航迹
 * map: Map, // 地图
 * properties, // 配置
 * runNow: BoatsPath.runNow, // 开始运行
 * loadTrackSwitchGrid: BoatsPath.loadTrackSwitchGrid, // 加载航迹切换面板
 * loadPathGrid: BoatsPath.loadPathGrid, // 加载路径面板
 * loadFloatGrid: BoatsPath.loadFloatGrid, // 加载浮动面板
 * loadControlGrid: BoatsPath.loadControlGrid, // 加载控制面板
 * removeAllLayers: BoatsPath.removeAllLayers, // 删除所有图层
 * destroyBoats: BoatsPath.destroyBoats, // 注销专题
 * drawTrackSector: BoatsPath.drawTrackSector, // 绘制航迹扇形
 * sailing: BoatsPath.sailing // 绘制航迹
 * }}
 */
BoatsPath.prototype = {
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
    get drawSpeed() {
        return this._curBoatSpeed;
    },
    /**
     * 获得航迹数据
     *
     * @return {*|JSON}
     */
    get track() {
        return this._boatPath;
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
     * 航迹展示初始化
     *
     * @param sets 配置
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
        var rawData = Util.getLocalJSON(this._sets.filePath);
        for(var i=0;i<rawData.length;i++){
            var tracks = [];
            var winds = this.testRandWWF(5,15,rawData[i].track.length);
            var waves = this.testRandWWF(0.1,2.9,rawData[i].track.length);
            var flows = this.testRandWWF(1,9,rawData[i].track.length);
            for (var j=0; j<rawData[i].track.length; j++) {
                var testData = this.testRandWWF(); // 生成测试数据 TODO
                tracks.push({
                    "x":parseFloat(rawData[i].track[j][0]),
                    "y":parseFloat(rawData[i].track[j][1]),
                    "shipDir":parseFloat(rawData[i].track[j][2]),
                    "wind": winds[j],
                    "wave": waves[j],
                    "flow": flows[j]
                });
            }
            this._boatPath.push({start: rawData[i].start, end: rawData[i].end, path: tracks});
        } // 初始化航迹数据
    },
    /**
     *  依据配置开始运行主题
     */
    runNow: function() {
        if (this._sets.basicLayer && !this.map.getLayer(this._sets.basicLayer)) {
            this.map.addLayer(this._sets.basicLayer);
        }
        if (this._sets.pathGrid) {
            // 加载并显示路径面板
            $("#" + this._sets.pathGrid).show();
            this.loadPathGrid();
            this.loadTrackSwitchGrid();
        }
        if (this._sets.floatGrid) {
            // 加载并隐藏浮动面板
            $("#" + this._sets.floatGrid).hide();
            this.loadFloatGrid();
        }
        if (this._sets.controlGrid) {
            // 加载并显示控制面板
            var controlGrid = $("#" + this._sets.controlGrid);
            if (!controlGrid.length || controlGrid.length !== 1) {
                console.error("controlGrid isn't exist or is named!");
                return;
            } else {
                controlGrid.show();
                this.loadControlGrid(controlGrid);
            }
        } else if(this._sets.pathGrid) {
            var defaultGrid = $("#" + this._basicController.defaultId);
            if (!defaultGrid.length || defaultGrid.length !== 1) {
                console.error("defaultGrid isn't exist or is named!");
                return;
            } else {
                defaultGrid.show();
                this.loadControlGrid(defaultGrid);
            }
        }
        if (this._sets.castInBegin) {
            this.sailing();
        }
    },
    /**
     * 航迹切换面板
     */
    loadTrackSwitchGrid: function () {
        var switchGrid = $("#" + this._sets.trackSwitchGrid);
        if (!switchGrid.length || switchGrid.length !== 1) {
            console.error("switchGrid isn't exist or is named!");
            return;
        }
        var data = [];
        for (var i=0; i<this._boatPath.length; i++) {
            data.push({text:this._boatPath[i].start + "-->" + this._boatPath[i].end, value: i});
        }
        const self = this;
        switchGrid.kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            index: 0,
            change: function () {
                var newId = switchGrid.val();
                if (newId != self._showTrackId) {
                    // 更改展示航迹Id
                    self._showTrackId = switchGrid.val();
                    // 清除所有图层
                    self.removeAllLayers();
                    // 停止触发器
                    self._timer.stop();
                    // 重置播放键
                    self._basicController.cast(true);
                    // 重新加载航迹面板
                    self.loadPathGrid();
                    // 重新启航
                    self.sailing();
                }
            }
        });
    },
    /**
     * 加载航迹面板
     */
    loadPathGrid: function () {
        var pathGrid = $("#" + this._sets.pathGrid);
        if (!pathGrid.length || pathGrid.length !== 1) {
            console.error("pathGrid isn't exist or is named!");
            return;
        }
        const self = this;
        pathGrid.kendoGrid({
            columns: [
                {field:"x", title:"经度", width: "20%"},
                {field:"y", title:"纬度", width: "20%"},
                {field:"shipDir", title:"航向", width: "15%"},
                {field:"wind", title:"风", width: "15%"},
                {field:"wave", title:"浪", width: "15%"},
                {field:"flow", title:"流", width: "15%"}
            ],
            toolbar: self._toolControl,
            dataSource: {
                data: self._boatPath[this._showTrackId].path
            }
        });
    },
    /**
     * 加载浮动面板
     */
    loadFloatGrid: function () {
        var floatGrid = $("#" + this._sets.floatGrid);
        if (!floatGrid.length || floatGrid.length !== 1) {
            console.error("floatGrid isn't exist or is named!");
            return;
        }
        Util.initFloatPanel(floatGrid, this._pathCols);
    },
    /**
     * 加载控制面板
     */
    loadControlGrid: function (controlGrid) {
        // 生成控制面板
        var controller = [this._basicController.castButton.wrap,
            this._basicController.speedButton.wrap];
        controlGrid.empty();
        controlGrid.append(controller.join(""));

        // 添加事件
        const self = this;
        var castButton = $("#" + this._basicController.castButton.id);
        var speedButton = $("#" + this._basicController.speedButton.id);
        var times = 1;
        this._basicController.cast(this._sets.castInBegin);
        castButton.click(function () {
            if (self._timer && !self._drawComplete) {
                if (self._timer.state.cast) {
                    self._timer.stop();
                    self._basicController.cast(false);
                }  else {
                    self._timer.start(self._curBoatSpeed);
                    self._basicController.cast(true);
                }
            } else {
                self.sailing();
                self._basicController.cast(true);
            }
        });
        speedButton.click(function () {
            if (self._timer) {
                self._timer.stop();
                self._basicController.cast(false);
            }
            switch (times) {
                case 1:
                case 2:
                case 4:
                    times *= 2;
                    self._curBoatSpeed /= times;
                    break;
                default:
                    times = 1;
                    self._curBoatSpeed = self._sets.goSpeed;
            }
            speedButton.val('x' + times);
        });
    },
    /**
     * 清除所有图层
     */
    removeAllLayers: function () {
        for(var layerNm in this._boatsAllLayers) {
            if (this._boatsAllLayers[layerNm]) {
                this.map.removeLayer(this._boatsAllLayers[layerNm]);
            }
        }
    },
    /**
     * 清理航迹专题
     */
    destroyBoats: function() {
        // 清理图层
        this.removeAllLayers();
        // 隐藏面板
        if (this._sets.controlGrid) {
            $("#" + this._sets.controlGrid).hide();
        }
        if (this._sets.pathGrid) {
            $("#" + this._sets.pathGrid).hide();
        }
        // 停止触发器
        if (this._timer) {
            this._timer.stop();
        }
        // 恢复行船速度
        this._curBoatSpeed = this._sets.goSpeed;
    },
    /**
     * 绘制航迹扇形
     *
     * @param x 坐标X
     * @param y 坐标Y
     * @param dir 方向
     * @return {*}
     */
    drawTrackSector: function(layout, x, y, dir) {
        var sAngle = dir - this._sets.trackAngle;
        var eAngle = dir + this._sets.trackAngle;
        const self = this;
        this._trackSectors.forEach(function (elem) {
            var realRadius = Util.seaMileFormat(elem.radius);
            layout.add(Util.drawSector(
                x,
                y,
                realRadius,
                sAngle,
                eAngle,
                {'lineColor': elem.sectorColor,
                    'symbolColor': [0,255,255,0]},
                self._sets.spatialStd,
                self._sets.pointsNum
            ));
            var xStep = x + realRadius*Util.cos(dir);
            var yStep = y + realRadius*Util.sin(dir);
            layout.add(Util.drawText(
                xStep,
                yStep,
                elem.text,
                "10pt",
                [0,0,0],
                self._sets.spatialStd));
        });
    },
    /**
     * 航行
     *
     * @param site 播放位置
     */
    sailing: function(_site) {
        var site = !_site || _site < 1 ? 1 : _site;
        // 清理图层
        this.removeAllLayers();
        // 设置未播放完成
        this._drawComplete = false;
        // 获得航迹
        var path = this._boatPath[this._showTrackId].path;
        // 定位当前播放的数据条目
        Util.controlItem(this._sets.pathGrid);
        Util.controlItem(this._sets.pathGrid,0);
        const self = this;
        require([
                "esri/layers/GraphicsLayer",
                "esri/geometry/Circle",
                "esri/symbols/PictureMarkerSymbol",
                "esri/SpatialReference",
                "esri/symbols/SimpleMarkerSymbol"
            ], function(GraphicsLayer,Circle,PictureMarkerSymbol,SpatialReference,SimpleMarkerSymbol) {
            var sms =  new esri.symbol.SimpleMarkerSymbol({
                "color": Util.hexToArrays(self._sets.pointColor.substr(1)),
                "size": self._sets.pointSize,
                "type": "esriSMS",
                "style": "esriSMSCircle",
                "outline": {
                    "color": Util.hexToArrays(self._sets.pointOutlineColor.substr(1)),
                    "width": self._sets.pointOutlineWidth,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                }
            }); //航迹端点的样式
            var trackStyle = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color(Util.hexToArrays(self._sets.trackColor.substr(1))),
                1
            ); // 航迹样式
            var pms = new PictureMarkerSymbol(
                self._sets.boatObj.url,
                self._sets.boatObj.width,
                self._sets.boatObj.height); // 初始化船的图形
            var sr = new SpatialReference({wkid: self._sets.spatialStd}); // 初始化坐标标准
            self._boatsAllLayers.boatLayer = new GraphicsLayer({id: "boatLayer"});
            self._boatsAllLayers.trackLayer = new GraphicsLayer({id: "trackLayer"});
            self._boatsAllLayers.pointLayer = new GraphicsLayer({id: "pointLayer"});
            for(var layer in self._boatsAllLayers) {
                self.map.addLayer(self._boatsAllLayers[layer]);
            }

            // 航迹点移入触发事件
            dojo.connect(self._boatsAllLayers.pointLayer, "onMouseOver", function (event) {

                if (event.target.tagName == 'circle') {
                    var floatPanel = $("#" + self._sets.floatGrid);
                    var newSymbol = new SimpleMarkerSymbol();
                    var oldSymbol = event.target.e_graphic.symbol;
                    var track = event.target.e_graphic.attributes.obj;
                    newSymbol.setColor(oldSymbol.color);
                    newSymbol.setOutline(oldSymbol.outline);
                    newSymbol.setSize(oldSymbol.size * self._sets.ratio);
                    event.graphic.setSymbol(newSymbol);
                    floatPanel.css("left", event.pageX + 3);
                    floatPanel.css("top", event.pageY + 3);
                    floatPanel.show(self._sets.showSpeed);
                    Util.dynamicFloatPanel(self._pathCols, track);
                }

            });

            // 航迹点移开触发事件
            dojo.connect(self._boatsAllLayers.pointLayer, "onMouseOut", function (event) {

                if (event.target.tagName == 'circle') {
                    var newSymbol = new SimpleMarkerSymbol();
                    var oldSymbol = event.target.e_graphic.symbol;
                    newSymbol.setColor(oldSymbol.color);
                    newSymbol.setOutline(oldSymbol.outline);
                    newSymbol.setSize(oldSymbol.size / self._sets.ratio);
                    event.graphic.setSymbol(newSymbol);
                    $("#" + self._sets.floatGrid).hide(self._sets.showSpeed);
                }

            });

            // 初始位置设定 init
            var maidenVoyage = new esri.geometry.Point(path[0].x, path[0].y, sr);
            if (self._sets.isZoom) {
                self.map.centerAndZoom(maidenVoyage); // 缩放至船航行起点
            }
            var gPtStart = new esri.Graphic(
                maidenVoyage,
                sms,
                {obj: path[0]}
            );
            self._boatsAllLayers.pointLayer.add(gPtStart);
            var gBoat = new esri.Graphic(maidenVoyage,pms);
            self._boatsAllLayers.boatLayer.add(gBoat);
            self.drawTrackSector(self._boatsAllLayers.boatLayer, path[0].x, path[0].y, path[0].shipDir);
            // init end
            self._timer = new Timer(function (timer) {
                var index = timer.params.current;
                 if (index < path.length) {
                     // 绘制点 step1
                     var ptEnd = new esri.geometry.Point(path[index].x, path[index].y, sr);
                     var gPtEnd = new esri.Graphic(
                         ptEnd,
                         sms,
                         {obj: path[index]}
                     );
                     self._boatsAllLayers.pointLayer.add(gPtEnd);
                     // step1 end

                     // 绘制线 step2
                     var polylineJson = {
                         "paths":[[[path[index-1].x,path[index-1].y], [path[index].x,path[index].y]]],
                         "spatialReference":{"wkid":self._sets.spatialStd}
                     };
                     var gLine = new esri.Graphic(
                         new esri.geometry.Polyline(polylineJson),
                         trackStyle
                     );
                     self._boatsAllLayers.trackLayer.add(gLine);
                     // step2 end

                     // 绘制船和航迹扇形 step3
                     self._boatsAllLayers.boatLayer.clear();
                     var gShip = new esri.Graphic(ptEnd,pms);
                     self._boatsAllLayers.boatLayer.add(gShip);
                     self.drawTrackSector(self._boatsAllLayers.boatLayer, path[index].x, path[index].y, path[index].shipDir);
                     // step3 end

                     // 设置选择一览列表表项 step4
                     Util.controlItem(self._sets.pathGrid);
                     Util.controlItem(self._sets.pathGrid, index);
                     // step4 end
                } else {
                    timer.stop();
                    self._drawComplete = true;
                    self._basicController.cast(false);
                }
                timer.params.current = ++index;
            });
            self._timer.params = {current: site};
            self._timer.start(self._curBoatSpeed);
        });
    },
    /**
     * 测试生成风浪流数据
     *
     * @param begin 开始
     * @param end 结束
     * @param num 数量
     * @return {Array} 测试数据
     */
    testRandWWF: function (begin, end, num) {
        if (begin >= end || !num) {
            console.log("param is invalid.");
            return;
        }
        var step = Math.random() * 0.35;
        var offset = Math.random() * 1000;
        var valueScale = (end - begin);
        var points = [];
        for (var i=offset; i<offset+num*step; i+=step) {
            points.push((valueScale * Math.abs(Math.cos(i))).toFixed(1));
        }
        return points;
    }
};