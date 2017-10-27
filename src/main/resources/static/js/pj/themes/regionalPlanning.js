/**
 * Created by seky on 17/9/5.
 */
var AreaSwitch = function () {
    this._sets = {
        spatialStd : 4490,
        map: null,
        baseEqu: null,
        thematicMap: null,
        basicMap: null,
        isZoom: true
    };
    const self = this;
    this._queryLayerURLs=[
        {id:"4",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/4"},
        {id:"5",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/5"},
        {id:"6",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/6"},
        {id:"8",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/8"},
        {id:"11",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/11"},
        {id:"15",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/15"},
        {id:"19",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/19"},
        {id:"36",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/36"},
        {id:"39",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/39"},
        {id:"46",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/46"},
        {id:"51",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/51"},
        {id:"57",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/57"},
        {id:"72",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/72"},
        {id:"75",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/75"},
        {id:"79",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/79"},
        {id:"82",path:"http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer/82"}
    ];
    this._removeEquListen = [];
    this._loadListener = null;
    this.X = 0;
    this.Y = 0;
    this._myExtent = new esri.geometry.Extent({
        "xmax":122.92654951075039,"xmin":120.54708850492011,
        "ymax":31.592517109329318,"ymin":30.06490314358627,
        "spatialReference":{"wkid":self._sets.spatialStd}
    }); // 比例尺缩放范围
};

AreaSwitch.prototype = {
    get map() {
        return this._sets.map;
    },
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
        }
    },
    init: function () {
        const self = this;
        require([
            "esri/arcgis/utils", "esri/dijit/LayerList", "dojo/promise/all", "esri/geometry/Extent", "esri/symbols/SimpleFillSymbol",
            "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISImageServiceLayer",
            "dojo/dom", "dojo/on", "dojo/_base/array", "esri/tasks/query",
            "esri/tasks/QueryTask", "esri/geometry/Point", "esri/SpatialReference",
            "dojo/domReady!"
        ], function (arcgisUtils, LayerList, all, Extent, SimpleFillSymbol,
                     Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, ArcGISImageServiceLayer,
                     dom, on, arrayUtils, Query, QueryTask, Point, SpatialReference) {
                self.map.removeAllLayers();
                if (self._sets.isZoom)
                     self.map.setExtent(self._myExtent);
                //self._loadListener = self.map.on("load", function () {
                self._loadListener = self._sets.baseEqu.on("load", function () {
                    self.queryTaskFun(self.map, self._sets.baseEqu, self._queryLayerURLs);
                    self._removeEquListen.push(self.map.on('click', function (e) {
                        self.X = e.mapPoint.x;
                        self.Y = e.mapPoint.y;
                    }));
                    document.getElementById("map_layer_zoomIn").addEventListener('click', function (e) {
                        var point = new Point(self.X, self.Y, new SpatialReference({wkid: self._sets.spatialStd}));
                        self.map.centerAndZoom(point, 2);
                    });

                    window.layer_info = self._sets.baseEqu.layerInfos;
                    for (var i = 0; i < layer_info.length; i++) {
                        if (!!!layer_info[i].subLayerIds) {  // 强制转换为bool类型并取反
                            layer_info[i]["image"] = "/img/logo/" + layer_info[i].id + ".png";
                        }
                    }
                    var jsonDataTree = transData(layer_info, 'id', 'parentLayerId', 'items');

                    $("#treeview").kendoTreeView({
                        checkboxes: {
                            checkChildren: true,
                            template: "<input type='checkbox' id='#= item.id #'  />"
                        },
                        dataImageUrlField: "image",
                        dataTextField: "name",
                        dataSource: jsonDataTree,
                        check: function (e) {
                            tempArr = [];
                            for (var i = 0; i < layer_info.length; i++) {
                                document.getElementById(i).checked && tempArr.push(i);
                            }
                            self._sets.baseEqu.setVisibleLayers(tempArr);
                        }
                    });
                    var treeview = $("#treeview").data("kendoTreeView");
                    treeview.expandTo(1);

                    for (var i = 0; i < layer_info.length; i++) {
                        if (layer_info[i].defaultVisibility && document.getElementById(i)) {
                            document.getElementById(i).checked = true;
                        }
                    }
                    var tempArr = [];
                    for (var i = 0; i < layer_info.length; i++) {
                        if (document.getElementById(i)) {
                            document.getElementById(i).checked && tempArr.push(i);
                        }
                    }
                    self._sets.baseEqu.setVisibleLayers(tempArr);

                    document.getElementById("layer_list_closeInfo").addEventListener('click', function (e) {
                        $("#layer_list_closeInfo_window").css('display', 'none');
                    });
                });
                self.map.addLayers([self._sets.basicMap, self._sets.baseEqu, self._sets.thematicMap]);
        });
    },
    destroy: function() {
        if (this._loadListener) {
            this._loadListener.remove();
        }
        if (this._removeEquListen) {
            while(this._removeEquListen.length != 0) {
                this._removeEquListen.pop().remove();
            }
        }
        this.map.graphics.clear();
        if (this._sets.basicMap) {
            this.map.removeLayer(this._sets.basicMap);
        }
        if (this._sets.baseEqu) {
            this.map.removeLayer(this._sets.baseEqu);
        }
        if (this._sets.thematicMap) {
            this.map.removeLayer(this._sets.thematicMap);
        }
    },
    //执行条件查询 yj 0829
    queryTaskFun : function(map,layer,queryLayerURLs) {
        const self = this;
        require([
            "esri/arcgis/utils", "esri/dijit/LayerList","dojo/promise/all","esri/geometry/Extent", "esri/symbols/SimpleFillSymbol",
            "esri/map", "esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ArcGISImageServiceLayer",
            "dojo/dom", "dojo/on", "dojo/_base/array","esri/tasks/query",
            "esri/tasks/QueryTask",
            "dojo/domReady!"
        ], function(
            arcgisUtils, LayerList,all,Extent,SimpleFillSymbol,
            Map, ArcGISTiledMapServiceLayer,ArcGISDynamicMapServiceLayer,ArcGISImageServiceLayer,
            dom, on, arrayUtils,Query,QueryTask
        ){
            var queryTskLyaerArr = [],
                queryLayerArr = [],
                result=[];
            for(var i=0;i<queryLayerURLs.length;i++) {
                queryLayerArr[i] = new Query();
                queryLayerArr[i].returnGeometry=true;
                queryLayerArr[i].outFields=["*"];
                queryTskLyaerArr[i]=new QueryTask(queryLayerURLs[i].path);
            }
            self._removeEquListen.push(map.on("click", executeQueries));

            function  executeQueries(e) {
                $("#layer_list_closeInfo_window").css('display','block');
                var parcels, buildings, promises,
                    qGeom, point, pxWidth, padding;
                point = e.mapPoint;
                pxWidth = map.extent.getWidth() / map.width;
                padding = 3 * pxWidth;
                qGeom = new Extent({
                    "xmin": point.x - padding,
                    "ymin": point.y - padding,
                    "xmax": point.x + padding,
                    "ymax": point.y + padding,
                    "spatialReference": point.spatialReference
                });
                for(var i=0;i<queryLayerURLs.length;i++){
                    queryLayerArr[i].geometry=qGeom;
                    result[i]=queryTskLyaerArr[i].execute(queryLayerArr[i]);
                }
                promises=all(result);
                promises.then(handleQueryResults);
            }
            function handleQueryResults(results) {
                console.log("queries finished: ", results);
                var parcels = [];
                for(var i=0;i<queryLayerURLs.length;i++) {
                    parcels[i] = results[i].features;
                }
                map.graphics.clear();
                for(var i=0;i<queryLayerURLs.length;i++) {
                    arrayUtils.forEach(parcels[i], function(feat) {
                        feat.setSymbol(new SimpleFillSymbol());
                        map.graphics.add(feat);
                    });
                }
                showInfoWindow(results);
            }
        });
    }
};