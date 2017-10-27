/**
 * 风浪流专题(此模块需要放在tools/jQuery/kendo/arcgisAPI之后加载)
 *
 * @constructor dsy 20170902
 */
var WWF = function () {
    /** 以下允许初始化时更改 */
    this._sets = {
        theme: "风浪流展示", // 专题名称
        title: "风浪流一览", // 航迹展示面板标题
        basicLayer: null, // 基础底图图层
        yourMap: null,     // 地图对象
        showMeDiv: null,   // 专题按钮的DivId
        controlDiv: null,   // 控制面板的DivId
        sliderType: "CustomSliderH", // 滑动条类型
        switchGridDiv: null, //切换面板的DivId
        castSpeed: 2000,   // 播放时间
        showSpeed: 500,   // 面板显示时间
        closeSpeed: 200,  // 面板关闭时间
        isCircle: true,   // 是否支持重复播放
        isZoom: true, // 允许缩放至大面显示
        spatialStd: 4490, // 坐标标准
        playColor: "#5075ff", // 播放按钮颜色
        pauseColor: "#ff9427", // 暂停按钮颜色
        sleepB: {id:"sleep_button", url:"/img/wwf.png", width: "100px", height: "80px"}, // 默认按钮
        wakeB: {id:"wake_button", url:"/img/wwf2.png", width: "100px", height: "80px"} // 唤醒按钮
    };
    /** 以下只允许专题运行时更改 */
    const self= this;
    this._fruits= {
        nwpWind: {promise: true, id:'NWP_wind',    opacity: 0.9, service: null, pubData: null, info: null, step: 7, nc_url: "myData/TESTWIND2_2017083012_WQWINDNWP_V.nc",
            url: "http://172.3.11.34:6080/arcgis/rest/services/WQWINDNWP/MapServer", cName: "风"},
        maxWind: {promise: false, id:'MAX_wind',    opacity: 0.9, service: null, pubData: null, info: null, step: 3, nc_url: "",
            url: null, cName: "最大过程场风"},
        dydWave: {promise: false, id:'DYD_wave',    opacity: 0.9, service: null, pubData: null, info: null, step: 7, nc_url: "",
            url: null, cName: "钓鱼岛浪"},
        ecsWave: {promise: false, id:'ECS_wave',    opacity: 0.9, service: null, pubData: null, info: null, step: 7, nc_url: "",
            url: null, cName: "东海浪"},
        maxWave: {promise: false, id:'MAX_wave',    opacity: 0.9, service: null, pubData: null, info: null, step: 3, nc_url: "",
            url: null, cName: "最大过程场浪"},
        nwpWave: {promise: true,  id:'NWP_wave',    opacity: 0.9, service: null, pubData: null, info: null, step: 7, nc_url: "myData/TESTWAVE2_2017083106_WQWAVENWP_V.nc",
            url: "http://172.3.11.34:6080/arcgis/rest/services/WQWAVENWP/MapServer", cName: "浪"},
        dydwaveFlow: {promise: false,id:'DYD_waveFlow',opacity: 0.9, service: null, pubData: null, info: null, step: 6, nc_url: "",
            url: null, cName: "钓鱼岛海流"},
        nwpWaveFlow: {promise: true, id:'NWP_waveFlow',opacity: 0.9, service: null, pubData: null, info: null, step: 6, nc_url: "myData/TESTCURRENT2_2017083112_WQCURRENTNWP_V.nc",
            url: "http://172.3.11.34:6080/arcgis/rest/services/WQCURRENTNWP/MapServer", cName: "流"},
        fishVis: {promise: false,  id:'visibility',  opacity: 0.9, service: null, pubData: null, info: null, step: 3, nc_url: "",
            url: null, cName: "能见度"},
        OceanArea: {promise: false,  id:'ocean_area',  opacity:   1, service: null, pubData: null, info: null, step: 0, nc_url: "",
            url: null, cName: "海区"}
    }; // 成品展示
    this._fruitsNames = []; // 成品名称列表
    this._curCastSpeed = this._sets.castSpeed; // 实际播放速度
    this._infosDataMaker = {
        find000Index: function (name) {
            var list = self._fruits[name].service.layerInfos;
            for(var i=list.length - 1; i>=0; i--) {
                if (list[i].name.match(/000/)) {
                    return list[i].id;
                }
            }
            return -1;
        }
    }; // 数据整理
    this._basicController = {
        defaultId: "myController",
        castButton: {
            id: "wwfController_castButton",
            wrap: "<div style='position: inherit;margin-top:2%;margin-left:2%;display: inline;'>" +
            "<button id='wwfController_castButton' " +
            "style='border-radius: 5px;background-color: #fafafa;outline:none;" +
            "'></button></div>",
            start: "<label style='color:" + this._sets.pauseColor + "'>■</label>",
            stop: "<label style='color:" + this._sets.playColor + "'>►</label>"
        }, // 播放按钮
        speedButton: {
            id: "wwfController_speedButton",
            wrap: "<div style='position: inherit;margin-top:2%;margin-left:7%;display: inline;'>" +
            "<input type='button' " +
            "style='background-color: #fafafa;border-radius: 5px;outline: none;'" +
            " id='wwfController_speedButton' value='x1'/></div>"
        }, // 调速按钮
        slider: {
            id: "wwfControlDiv_slider",
            wrap: "<input id='wwfControlDiv_slider' class='balSlider'  style='width: 540px;position: inherit;margin-top:2%;margin-left:13%;display: inline;' />"
        }, // 播放条
        switcher: {
            id: "wwfControlDiv_switcher",
            wrap: "<div>" +
            "<div id='wwfControlDiv_switcher' style='width:8%;float: right;position: inherit;margin-right: 2%;margin-top: 1%;'></div>" +
            "</div>"
        }, // 切换按钮
        floatShowWin: {
            id: "wwfControlDiv_floatShowWin",
            wrap: "<div id='wwfControlDiv_floatShowWin'>" +
            "</div>"
        } // 浮动展示窗口
    } // 播放控制器
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
    this._yourExtent = new esri.geometry.Extent({
        "xmax":148,"xmin":114,
        "ymax":37,"ymin":14,
        "spatialReference":{"wkid":self._sets.spatialStd}
    }); // 比例尺缩放范围
    this._timer = null; // 触发器
    this._curValue = 0; // 当前播放的刻度
    this._selectLayer = 0; // 选择的图层序号
    this._relativeWidth = 0.375; // 滑动条相对宽度比例
    this._compelete = false; // 加载完成
};

/**
 * 风浪流函数汇总
 *
 * @type {{
 * theme: string, // 专题
 * castSpeed: number, // 播放速度
 * map: Map, properties, // 地图
 * runNow: WWF.runNow, // 运行
 * destroyWWF: WWF.destroyWWF, // 销毁
 * loadInitGrid: WWF.loadInitGrid, // 加载专题面板
 * loadSlider: WWF.loadSlider // 加载进度条
 * }}
 */
WWF.prototype = {
    /**
     * 专题标题
     *
     * @return {string}
     */
    get theme() {
        return this._sets.theme;
    },
    /**
     * 获得控制面板
     *
     * @return {jQuery|HTMLElement}
     */
    get controllerGrid() {
        return $("#" + this._sets.controlDiv);
    },
    /**
     * 默认播放速度
     *
     * @return {number}
     */
    get castSpeed() {
        return this._curCastSpeed;
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
        // 初始化配置
        if (sets) {
            for (var props in sets) {
                for (var elem in this._sets) {
                    if (props == elem) {
                        this._sets[elem] = sets[props];
                    }
                }
            }
            if (!this._sets.yourMap) {
                console.error("Map and FilePath can't be null or undefined.");
                return;
            }
        }
        // 加载成品服务
        const self = this;
        require([
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "dojo/on",
            "dojo/dom",
            "dojo/domReady!"
        ], function (ArcGISDynamicMapServiceLayer) {
            for (var name in self._fruits) {
                if (self._fruits[name].promise) {
                    self._fruits[name].service = new ArcGISDynamicMapServiceLayer(self._fruits[name].url, {
                        "id": self._fruits[name].id,
                        "opacity": self._fruits[name].opacity
                    });
                    self._fruitsNames.push({serName: name, obj: self._fruits[name]});
                }
            }
        });
    },
    /**
     * 依据配置开始运行
     */
    runNow: function () {
        if (!this._compelete) {
            if (this._sets.showMeDiv) {
                $("#" + this._sets.showMeDiv).show();
                this.loadInitGrid();
            }
            if (this._sets.controlDiv) {
                $("#" + this._sets.controlDiv).hide();
            }
            this._compelete = true;
        }
    },
    /**
     * 清除WWF（风、浪、流）专题
     */
    destroyWWF: function () {
        this.destroyGrids();
        if (this._sets.showMeDiv) {
            $("#" + this._sets.showMeDiv).hide(this._sets.closeSpeed);
        }
        this._compelete = false;
    },
    /**
     * 清除所有面板
     */
    destroyGrids: function () {
        // 停止触发器
        if (this._timer) {
            this._timer.stop();
            this._timer = null;
        }

        // 清除所有图层
        for (var name in this._fruits) {
            if (this._fruits[name].service) {
                this.map.removeLayer(this._fruits[name].service);
            }
        }

        // 隐藏全部面板
        if (this._sets.controlDiv) {
            $("#" + this._sets.controlDiv).hide(this._sets.closeSpeed);
        }
        if (this._sets.switchGridDiv) {
            $("#" + this._sets.switchGridDiv).hide(this._sets.closeSpeed);
        }
    },
    /**
     * 加载初始化按钮面板
     */
    loadInitGrid: function () {
        var initGrid = $("#" + this._sets.showMeDiv);
        if (!initGrid.length || initGrid.length !== 1) {
            console.error("initGrid isn't exist or is named!");
            return;
        }
        initGrid.empty();
        var buttons = [];
        buttons.push("<img id='" + this._sets.sleepB.id +
            "' src='" + this._sets.sleepB.url +
            "' width='" + this._sets.sleepB.width +
            "' height='" + this._sets.sleepB.height + "'/>");
        buttons.push("<img id='" + this._sets.wakeB.id +
            "' src='" + this._sets.wakeB.url +
            "' width='" + this._sets.wakeB.width +
            "' height='" + this._sets.wakeB.height + "'/>");
        initGrid.append(buttons.join(""));
        var sleepB = $("#" + this._sets.sleepB.id);
        var wakeB = $("#" + this._sets.wakeB.id);
        const self = this;
        sleepB.show();
        wakeB.hide();
        sleepB.click(function () {
            if (self._sets.isZoom)
                self.map.setExtent(self._yourExtent);
            if (self._sets.basicLayer && !self.map.getLayer(self._sets.basicLayer)) {
                self.map.addLayer(self._sets.basicLayer);
            }
            sleepB.hide(self._sets.closeSpeed);
            wakeB.show(self._sets.showSpeed);
            self.loadSlider(self._selectLayer);
        });
        wakeB.click(function () {
            self.destroyGrids();
            // 切换显隐
            sleepB.show(self._sets.showSpeed);
            wakeB.hide(self._sets.closeSpeed);
        });
    },
    /**
     * 重载控制面板
     *
     * @return {jQuery|HTMLElement}
     */
    reload: function(){
        this.controllerGrid.empty();
        var controllers = [];
        controllers.push(this._basicController.castButton.wrap);
        controllers.push(this._basicController.speedButton.wrap);
        controllers.push(this._basicController.slider.wrap);
        controllers.push(this._basicController.switcher.wrap);
        this.controllerGrid.append(controllers.join(""));
        return this.controllerGrid;
    },
    /**
     * 加载滑动条
     *
     * @param name 服务名称
     */
    loadSlider: function (index) {
        // 控制面板填充
        const self = this;
        var controllerGrid = this.reload();
        // 初始化基本信息
        var name = this._fruitsNames[index].serName;
        this.map.addLayer(this._fruits[name].service);
        var step = this._fruits[name].step;
        var initIndex = this._infosDataMaker.find000Index(name);
        // 各项控制面板声明
        var playButton = $("#" + this._basicController.castButton.id);
        var speedButton = $("#" + this._basicController.speedButton.id);
        var switchGrid = $("#" + this._basicController.switcher.id);
        var slider = $("#" + self._basicController.slider.id);
        // 各项控制面板初始化-滑动条初始化 step1
        slider.kendoSlider({
            min: 0,
            max: initIndex,
            smallStep: step,
            tooltip:{
              enabled: false
            },
            change: function (e) {
                self._curValue = e.value;
                var layerId = initIndex - e.value;
                self._fruits[name].service.setVisibleLayers([layerId]);
            }
        });
        // 新建Timer播放触发器
        if (self._timer)
            self._timer.stop();
        self._timer = new Timer(function (timer) {
            var index = self._timer.params.current + step;
            if (index >= initIndex) {
                if (self._sets.isCircle) {
                    index = 0;
                } else {
                    self._timer.stop();
                    return;
                }
            }
            slider.getKendoSlider().value(index);
            self._curValue = index;
            self._fruits[name].service.setVisibleLayers([initIndex - index]);
            self._timer.params.current = index;
        });
        slider.getKendoSlider().value(self._curValue);
        self._fruits[name].service.setVisibleLayers([initIndex - self._curValue]);
        this._basicController.cast(false);
        // 各项控制面板初始化-播放按钮初始化 step2
        playButton.click(function () {
            if (self._timer.state.cast) {
                slider.getKendoSlider().enable(true);
                self._timer.stop();
                self._basicController.cast(false);
            } else {
                slider.getKendoSlider().enable(false);
                self._timer.params = {current: self._curValue};
                self._timer.start(self._curCastSpeed);
                self._basicController.cast(true);
            }
        });
        // 各项控制面板初始化-速度按钮初始化 step3
        var times = 1;
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
                    self._curCastSpeed /= times;
                    break;
                default:
                    times = 1;
                    self._curCastSpeed = self._sets.castSpeed;
            }
            speedButton.val('x' + times);
        });
        // 各项控制面板初始化-切换下拉框初始化 step4
        var data = [];
        for (var i=0; i<this._fruitsNames.length; i++) {
            data.push({text: self._fruitsNames[i].obj.cName, value: i});
        }
        switchGrid.kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            index: self._selectLayer,
            change: function () {
                var newId = switchGrid.val();
                if (newId != self._selectLayer) {
                    // 停止触发器
                    if (self._timer) {
                        self._timer.stop();
                        self._timer = null;
                    }
                    // 清除当前图层
                    self.map.removeLayer(self._fruits[name].service);
                    // 重置选择图层
                    self._selectLayer = newId;
                    // 滑动位置重置
                    self._curValue = 0;
                    // 初始化滑动条（最后执行）
                    self.loadSlider(newId);
                }
            }
        });
        // 控制面板显示
        controllerGrid.show(this._sets.showSpeed);
        var resizeChangeSlider = function () {
            var width = document.documentElement.clientWidth; // body宽度
            slider.getKendoSlider().wrapper.css("width", width * self._relativeWidth); // 调整滑动条宽度
            slider.getKendoSlider().resize(); // 重置
        }
        window.onresize = resizeChangeSlider;
        resizeChangeSlider();
    }
};
