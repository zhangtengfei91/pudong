//初始化地图
//初始化地图
var myMap, view, map_layer;

function initScript_indexMap(){
    require(["esri/map","esri/geometry/Point", "esri/SpatialReference","esri/layers/GraphicsLayer","esri/symbols/PictureMarkerSymbol",
            "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol","esri/symbols/TextSymbol",
            "esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol",
            "esri/graphic","esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/Color",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "dojo/dom", "dojo/on",
            "dojo/domReady!"],
        function(Map,Point, SpatialReference,GraphicsLayer,PictureMarkerSymbol,
                 SimpleMarkerSymbol, SimpleLineSymbol,TextSymbol,
                 PictureFillSymbol, CartographicLineSymbol,
                 Graphic,ArcGISDynamicMapServiceLayer,
                 Color,
                 ArcGISTiledMapServiceLayer,dom, on) {
            var map = new Map("mapDiv",{logo:false});
            var picGraphicLayer = new GraphicsLayer({"id":"picGraphicLayer"});//监测站位
            //var baseMap = new ArcGISDynamicMapServiceLayer("http://172.3.11.34:6080/arcgis/rest/services/BaseMap/MapServer");
            var tield=new ArcGISTiledMapServiceLayer("http://31.16.10.194:6080/arcgis/rest/services/2000_JiChuDT_20170505/MapServer")
            var thematicMap = new ArcGISDynamicMapServiceLayer("http://172.3.11.34:6080/arcgis/rest/services/ThematicMap/MapServer");
            var baseEqu = new ArcGISDynamicMapServiceLayer("http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer");
            map.addLayer(tield);
            map.addLayers([thematicMap,baseEqu]);

            var point = new Point(122, 31.5);

            var stationPts = [
                {"stationNo":"MF06003","stationName":"特殊海域","lon":"120.71","lat":"26.03"},
                {"stationNo":"MF06007","stationName":"科技项目站位","lon":"121.8","lat":"26.6"},
                {"stationNo":"MF05003","stationName":"D-09","lon":"121.6","lat":"31.4"},
                {"stationNo":"MF06004","stationName":"台湾海峡北口","lon":"119.8","lat":"25.8"},
                {"stationNo":"MF14001","stationName":"台湾海峡南口","lon":"117.3","lat":"22.5"},
                {"stationNo":"MF06002","stationName":"温州外海","lon":"122.5","lat":"27"},
                {"stationNo":"MF05001","stationName":"长江口外","lon":"122.4","lat":"31"},
                {"stationNo":"MF06001","stationName":"舟山外海","lon":"123","lat":"29.5"}
            ];

            var boatsPts = [
                {"stationName":"渔政33205","lon":"122.1","lat":"31.114"},
                {"stationName":"渔政33220","lon":"121.9","lat":"31.2"}
            ];

            var drainPts = [
                {"station":"G2","lon":"121.9","lat":"31.1","content":"水质"},

                {"station":"L4","lon":"121.7","lat":"30.8'","content":"水质"},

                {"station":"L7","lon":"121.8","lat":"30.8","content":"水质"}
            ];

            /*
           * 坐标从http://richuriluo.qhdi.com/poi/185609.html获得
           * 没有三甲港的坐标，用浦东大桥坐标替代
           * */
            var observePos = [
                {"name":"芦潮港","lon":"121.84652499999993","lat":"30.85666","publishdate":"","publishtime":"08","weather":"","wavedirection":"SW明晨→N'","waveheight":"0.6-1.2","OutDIRECTION":"SW4∇5明晨→N'4-5∇6","comfort":"","tidehtime1":null,"tidehtime2":null,"waterw":"","networkforecast":"","windspeed":"4∇5明晨↑4-5∇6","winddirection":"SW明晨→N'"},
                {"name":"大洋山","lon":"122.07684100000006","lat":"30.586624","publishdate":"","publishtime":"08","weather":"","wavedirection":"SW明晨→N'","waveheight":"0.6-1.2","OutDIRECTION":"SW4∇5明晨→N'4-5∇6","comfort":"","tidehtime1":null,"tidehtime2":null,"waterw":"","networkforecast":"","windspeed":"4∇5明晨↑4-5∇6","winddirection":"SW明晨→N'"},
                {"name":"小洋山","lon":"121.48219700000004","lat":"31.23353","publishdate":"","publishtime":"08","weather":"","wavedirection":"SW明晨→N'","waveheight":"0.6-1.2","OutDIRECTION":"SW4∇5明晨→N'4-5∇6","comfort":"","tidehtime1":null,"tidehtime2":null,"waterw":"","networkforecast":"","windspeed":"4∇5明晨↑4-5∇6","winddirection":"SW明晨→N'"},
                {"name":"外高桥","lon":"121.63468139999998","lat":"31.3341201","publishdate":"","publishtime":"08","weather":"","wavedirection":"SW明晨→N'","waveheight":"0.6-1.2","OutDIRECTION":"SW4∇5明晨→N'4-5∇6","comfort":"","tidehtime1":null,"tidehtime2":null,"waterw":"","networkforecast":"","windspeed":"4∇5明晨↑4-5∇6","winddirection":"SW明晨→N'"},
                {"name":"三甲港","lon":"121.76432799999998","lat":"31.211286","publishdate":"","publishtime":"08","weather":"","wavedirection":"SW明晨→N'","waveheight":"0.6-1.2","OutDIRECTION":"SW4∇5明晨→N'4-5∇6","comfort":"","tidehtime1":null,"tidehtime2":null,"waterw":"","networkforecast":"","windspeed":"4∇5明晨↑4-5∇6","winddirection":"SW明晨→N'"}
            ];

            Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }

            observePos.map(function (obj) {
                var point = new Point(obj.lon,obj.lat);
                var picGraphic = new Graphic(point,new PictureMarkerSymbol('/img/observe.png', 20, 20),obj.name);
                var textGraphic = new Graphic(point,new TextSymbol(obj.name,new Color([0, 0, 0])).setOffset(0,-30));
                picGraphicLayer.add(picGraphic);
                picGraphicLayer.add(textGraphic);
            })


            for(var i=0;i<boatsPts.length;i++) {
                var point = new Point(boatsPts[i].lon,boatsPts[i].lat);
                var picGraphic = new Graphic(point,new PictureMarkerSymbol('/img/boat.png', 20, 20),boatsPts[i].stationName);
                var textGraphic = new Graphic(point,new TextSymbol(boatsPts[i].station,new Color([0,0,0])).setOffset(0,-40));
                picGraphicLayer.add(picGraphic);
                picGraphicLayer.add(textGraphic);
            }
            for(var i=0;i<stationPts.length;i++) {
                var point = new Point(stationPts[i].lon,stationPts[i].lat);
                var picGraphic = new Graphic(point,new PictureMarkerSymbol('/img/buoy.png', 30, 30),[stationPts[i].stationNo,stationPts[i].stationName]);
                var textGraphic = new Graphic(point,new TextSymbol(stationPts[i].stationName,new Color([0,0,0])).setOffset(0,-40));
                picGraphicLayer.add(picGraphic);
                picGraphicLayer.add(textGraphic);
            }
            for(var i=0;i<drainPts.length;i++) {
                var point = new Point(drainPts[i].lon,drainPts[i].lat);
                var picGraphic = new Graphic(point,new PictureMarkerSymbol('/img/drain.png', 20, 20),drainPts[i].station);
                var textGraphic = new Graphic(point,new TextSymbol(drainPts[i].station,new Color([0,0,0])).setOffset(0,-40));
                picGraphicLayer.add(picGraphic);
                picGraphicLayer.add(textGraphic);
            }

            dojo.connect(picGraphicLayer,"onMouseOver",function(e){
                //浮标
                if(e.graphic.symbol.url == "/img/buoy.png") {
                    var symbolMarker=new PictureMarkerSymbol('/img/buoy.png', 40, 40);
                    event.graphic.setSymbol(symbolMarker);
                    if(!!document.getElementById("showBuoyInfo")) {
                        var stationNo = e.graphic.attributes[0];
                        var stationName = e.graphic.attributes[1];
                        var lon = e.graphic.geometry.x;
                        var lat = e.graphic.geometry.y;
                        var str1 = 80 + ~~(Math.random()*20);
                        var str2 = 1000 + ~~(Math.random()*10);
                        var str3 = 10 + ~~(Math.random()*10);
                        var str4 = 100 + ~~(Math.random()*20);
                        document.getElementById("showBuoyInfo").innerHTML = "&nbsp&nbsp浮标编号：" + stationNo +"<br />" + "&nbsp&nbsp浮标名称：" +  stationName + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp气压：" + str2 + "Pa" + "<br />"+"&nbsp&nbsp浪高："+ str3 +"m/s" + "<br />" + "&nbsp&nbsp深度：" + str4 + "m";
                        window.t = setInterval(function(){
                            var stationNo = e.graphic.attributes[0];
                            var stationName = e.graphic.attributes[1];
                            var lon = e.graphic.geometry.x;
                            var lat = e.graphic.geometry.y;
                            var str1 = 80 + ~~(Math.random()*20);
                            var str2 = 1000 + ~~(Math.random()*10);
                            var str3 = 10 + ~~(Math.random()*10);
                            var str4 = 100 + ~~(Math.random()*20);
                            document.getElementById("showBuoyInfo").innerHTML = "&nbsp&nbsp浮标编号：" + stationNo +"<br />" + "&nbsp&nbsp浮标名称：" +  stationName + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp气压：" + str2 + "Pa" + "<br />"+"&nbsp&nbsp浪高："+ str3 +"m/s" + "<br />" + "&nbsp&nbsp深度：" + str4 + "m";
                        },2000);
                        document.getElementById("showBuoyInfo").style.top = -100 + e.pageY + "px";
                        document.getElementById("showBuoyInfo").style.left = 30 + e.pageX + "px";
                        document.getElementById("showBuoyInfo").style.display = "block";
                    } else {
                        var node = document.createElement("DIV");
                        node.id = "showBuoyInfo";
                        node.style.position = "absolute";
                        node.style.top = -100 + e.pageY + "px";
                        node.style.left = 30 + e.pageX + "px";
                        node.style.height = "150px";
                        node.style.width = "160px";
                        node.style.lineHeight = "1.2";
                        node.style.color = "white";
                        node.style.borderRadius = "15px";
                        node.style.backgroundColor = "rgb(36, 104, 170)";
                        var stationNo = e.graphic.attributes[0];
                        var stationName = e.graphic.attributes[1];
                        var lon = e.graphic.geometry.x;
                        var lat = e.graphic.geometry.y;
                        var str1 = 80 + ~~(Math.random()*20);
                        var str2 = 1000 + ~~(Math.random()*10);
                        var str3 = 10 + ~~(Math.random()*10);
                        var str4 = 100 + ~~(Math.random()*20);
                        node.innerHTML = "&nbsp&nbsp浮标编号：" + stationNo +"<br />" + "&nbsp&nbsp浮标名称：" +  stationName + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp气压：" + str2 + "Pa" + "<br />"+"&nbsp&nbsp浪高："+ str3 +"m/s" + "<br />" + "&nbsp&nbsp深度：" + str4 + "m";

                        (function() {
                            window.t = setInterval(function(){
                                var stationNo = e.graphic.attributes[0];
                                var stationName = e.graphic.attributes[1];
                                var lon = e.graphic.geometry.x;
                                var lat = e.graphic.geometry.y;
                                var str1 = 80 + ~~(Math.random()*20);
                                var str2 = 1000 + ~~(Math.random()*10);
                                var str3 = 10 + ~~(Math.random()*10);
                                var str4 = 100 + ~~(Math.random()*20);
                                node.innerHTML = "&nbsp&nbsp浮标编号：" + stationNo +"<br />" + "&nbsp&nbsp浮标名称：" +  stationName + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp气压：" + str2 + "Pa" + "<br />"+"&nbsp&nbsp浪高："+ str3 +"m/s" + "<br />" + "&nbsp&nbsp深度：" + str4 + "m";
                            },2000);
                        })();
                        document.body.appendChild(node);
                    }
                }
                else {
                    if(e.graphic.symbol.url == "/img/boat.png") {  //船舶
                        var symbolMarker=new PictureMarkerSymbol('/img/boat.png', 25, 25);
                        event.graphic.setSymbol(symbolMarker);
                        if(!!document.getElementById("showBoatInfo")) {
                            var stationName = e.graphic.attributes;
                            var lon = e.graphic.geometry.x;
                            var lat = e.graphic.geometry.y;
                            document.getElementById("showBoatInfo").innerHTML = "&nbsp&nbsp船舶名称：" +  stationName + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />";
                            document.getElementById("showBoatInfo").style.top = -100 + e.pageY + "px";
                            document.getElementById("showBoatInfo").style.left = 30 + e.pageX + "px";
                            document.getElementById("showBoatInfo").style.display = "block";
                        } else {
                            var node = document.createElement("DIV");
                            node.id = "showBoatInfo";
                            node.style.position = "absolute";
                            node.style.top = -100 + e.pageY + "px";
                            node.style.left = 30 + e.pageX + "px";
                            node.style.height = "67px";
                            node.style.width = "179px";
                            node.style.lineHeight = "1.2";
                            node.style.color = "white";
                            node.style.borderRadius = "15px";
                            node.style.backgroundColor = "rgb(36, 104, 170)";
                            var stationName = e.graphic.attributes;
                            var lon = e.graphic.geometry.x;
                            var lat = e.graphic.geometry.y;
                            node.innerHTML =  "&nbsp&nbsp船舶名称：" +  stationName + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />";

                            (function() {
                                window.t = setInterval(function(){
                                    var stationName = e.graphic.attributes;
                                    var lon = e.graphic.geometry.x;
                                    var lat = e.graphic.geometry.y;
                                    node.innerHTML =  "&nbsp&nbsp船舶名称：" +  stationName + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />";
                                },2000);
                            })();
                            document.body.appendChild(node);
                        }
                    }
                    else {
                        if(e.graphic.symbol.url == "/img/drain.png") {    //排污口
                            var symbolMarker=new PictureMarkerSymbol('/img/drain.png', 30, 30);
                            event.graphic.setSymbol(symbolMarker);
                            if(!!document.getElementById("showDrainInfo")) {
                                var station = e.graphic.attributes;
                                var lon = e.graphic.geometry.x;
                                var lat = e.graphic.geometry.y;
                                var str1 = 20 + ~~(Math.random()*50);
                                var str2 = 30 + ~~(Math.random()*5);
                                var str3 = 5 + (Math.random()+1).toFixed(1);
                                var str4 = 90 + ~~(Math.random()*10);
                                document.getElementById("showDrainInfo").innerHTML =  "&nbsp&nbsp名称：" +  station + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp盐度：" + str2 + "%" + "<br />"+"&nbsp&nbspPH："+ str3 +" " + "<br />" + "&nbsp&nbsp透明度：" + str4 + "m";
                                window.t = setInterval(function(){
                                    var station = e.graphic.attributes;
                                    var lon = e.graphic.geometry.x;
                                    var lat = e.graphic.geometry.y;
                                    var str1 = 20 + ~~(Math.random()*50);
                                    var str2 = 30 + ~~(Math.random()*5);
                                    var str3 = 5 + (Math.random()+1).toFixed(1);
                                    var str4 = 90 + ~~(Math.random()*10);
                                    document.getElementById("showDrainInfo").innerHTML =  "&nbsp&nbsp名称：" +  station + "<br />"+ "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp盐度：" + str2 + "%" + "<br />"+"&nbsp&nbspPH："+ str3 +" " + "<br />" + "&nbsp&nbsp透明度：" + str4 + "m";
                                },2000);
                                document.getElementById("showDrainInfo").style.top = -100 + e.pageY + "px";
                                document.getElementById("showDrainInfo").style.left = 30 + e.pageX + "px";
                                document.getElementById("showDrainInfo").style.display = "block";
                            } else {
                                var node = document.createElement("DIV");
                                node.id = "showDrainInfo";
                                node.style.position = "absolute";
                                node.style.top = -100 + e.pageY + "px";
                                node.style.left = 30 + e.pageX + "px";
                                node.style.height = "134px";
                                node.style.width = "133px";
                                node.style.lineHeight = "1.2";
                                node.style.color = "white";
                                node.style.borderRadius = "15px";
                                node.style.backgroundColor = "rgb(36, 104, 170)";
                                var station = e.graphic.attributes;
                                var lon = e.graphic.geometry.x;
                                var lat = e.graphic.geometry.y;
                                var str1 = 80 + ~~(Math.random()*20);
                                var str2 = 1000 + ~~(Math.random()*10);
                                var str3 = 10 + ~~(Math.random()*10);
                                var str4 = 100 + ~~(Math.random()*20);
                                node.innerHTML = "&nbsp&nbsp名称：" + station +"<br />" + "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp气压：" + str2 + "Pa" + "<br />"+"&nbsp&nbsp浪高："+ str3 +"m/s" + "<br />" + "&nbsp&nbsp深度：" + str4 + "m";
                                (function() {
                                    window.t = setInterval(function(){
                                        var station = e.graphic.attributes;
                                        var lon = e.graphic.geometry.x;
                                        var lat = e.graphic.geometry.y;
                                        var str1 = 80 + ~~(Math.random()*20);
                                        var str2 = 1000 + ~~(Math.random()*10);
                                        var str3 = 10 + ~~(Math.random()*10);
                                        var str4 = 100 + ~~(Math.random()*20);
                                        node.innerHTML = "&nbsp&nbsp名称：" + station +"<br />" + "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp水温："+ str1 + "℃" + "<br />" + "&nbsp&nbsp气压：" + str2 + "Pa" + "<br />"+"&nbsp&nbsp浪高："+ str3 +"m/s" + "<br />" + "&nbsp&nbsp深度：" + str4 + "m";
                                    },2000);
                                })();
                                document.body.appendChild(node);
                            }
                        }
                        else {
                            if(e.graphic.symbol.url == "/img/observe.png") {    //监测站点
                                var symbolMarker=new PictureMarkerSymbol('/img/observe.png', 30, 30);
                                event.graphic.setSymbol(symbolMarker);
                                if(!!document.getElementById("showObserveInfo")) {
                                    var station = e.graphic.attributes;
                                    var lon = (+e.graphic.geometry.x).toFixed(3);
                                    var lat = (+e.graphic.geometry.y).toFixed(3);
                                    document.getElementById("showObserveInfo").innerHTML =  "&nbsp&nbsp名称：" + station +"<br />" + "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp时间："+new Date().Format("yyyy年MM月dd日") + "<br />"+ "&nbsp&nbsp风向：西南风,明晨转偏北风"+"<br />" + "&nbsp&nbsp风速：4级阵风5级,明晨增大到4-5级阵风6级" + "<br />" + "&nbsp&nbsp浪向：西南明晨转偏北 " + "<br />" + "&nbsp&nbsp浪高： 0.6米-1.2米";
                                    document.getElementById("showObserveInfo").style.top = -100 + e.pageY + "px";
                                    document.getElementById("showObserveInfo").style.left = 30 + e.pageX + "px";
                                    document.getElementById("showObserveInfo").style.display = "block";
                                } else {
                                    var node = document.createElement("DIV");
                                    node.id = "showObserveInfo";
                                    node.style.position = "absolute";
                                    node.style.top = -100 + e.pageY + "px";
                                    node.style.left = 30 + e.pageX + "px";
                                    node.style.height = "177px";
                                    node.style.width = "210px";
                                    node.style.lineHeight = "1.2";
                                    node.style.color = "white";
                                    node.style.borderRadius = "15px";
                                    node.style.backgroundColor = "rgb(36, 104, 170)";
                                    var station = e.graphic.attributes;
                                    var lon = (+e.graphic.geometry.x).toFixed(3);
                                    var lat = (+e.graphic.geometry.y).toFixed(3);
                                    node.innerHTML = "&nbsp&nbsp名称：" + station +"<br />" + "&nbsp&nbsp经度：" + lon +"<br />"+ "&nbsp&nbsp纬度：" + lat +"<br />" + "&nbsp&nbsp时间："+new Date().Format("yyyy年MM月dd日") + "<br />"+"&nbsp&nbsp风向：西南风,明晨转偏北风"+"<br />" + "&nbsp&nbsp风速：4级阵风5级,明晨增大到4-5级阵风6级" + "<br />" + "&nbsp&nbsp浪向：西南明晨转偏北 " + "<br />" + "&nbsp&nbsp浪高： 0.6米-1.2米";
                                    document.body.appendChild(node);
                                }
                            }
                        }
                    }
                }

            });

            dojo.connect(picGraphicLayer,"onMouseOut",function(e){
                (typeof t != "undefined") && clearInterval(t);
                if(e.graphic.symbol.url == "/img/buoy.png") {    //浮标
                    var symbolMarker=new PictureMarkerSymbol('/img/buoy.png', 30, 30);
                    event.graphic.setSymbol(symbolMarker);
                    document.getElementById("showBuoyInfo").style.display = "none";
                } else {     //船舶
                    if(e.graphic.symbol.url == "/img/boat.png") {
                        var symbolMarker=new PictureMarkerSymbol('/img/boat.png', 20, 20);
                        event.graphic.setSymbol(symbolMarker);
                        document.getElementById("showBoatInfo").style.display = "none";
                    } else {
                        if(e.graphic.symbol.url == "/img/drain.png") {
                            var symbolMarker=new PictureMarkerSymbol('/img/drain.png', 20, 20);
                            event.graphic.setSymbol(symbolMarker);
                            document.getElementById("showDrainInfo").style.display = "none";
                        } else {
                            if(e.graphic.symbol.url == "/img/observe.png") {
                                var symbolMarker=new PictureMarkerSymbol('/img/observe.png', 20, 20);
                                event.graphic.setSymbol(symbolMarker);
                                document.getElementById("showObserveInfo").style.display = "none";
                            }
                        }
                    }
                }
            });

            baseEqu.on("load",bulidOceanLine);
            map.addLayers([thematicMap,baseEqu]);
            function bulidOceanLine() {
                layer_info =  baseEqu.layerInfos;
                var tempArr = [];
                baseEqu.setVisibleLayers(tempArr.concat([4,5]));
            }
            // var point = new Point(111, 25);
            //  map.centerAndZoom(point, 1);

            map.on('load',function(){
                $("#mapDiv_zoom_slider").css("left","308px");
                map.addLayer(picGraphicLayer);
            });


        }
    );
}

function init_mapLayerController_map(){
    require(["esri/map","esri/geometry/Point", "esri/SpatialReference",
            "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol",
            "esri/graphic",
            "esri/Color",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "dojo/dom", "dojo/on",
            "dojo/domReady!"],
        function(Map,Point, SpatialReference,
                 SimpleMarkerSymbol, SimpleLineSymbol,
                 PictureFillSymbol, CartographicLineSymbol,
                 Graphic,
                 Color,
                 ArcGISTiledMapServiceLayer,ArcGISDynamicMapServiceLayer,dom, on) {
            myMap = new Map("map_layer_list", {
                "logo": false
            });
            var testMap = new Map("map_layer_test", {
                "logo": false
            });
            var smallLayer = new ArcGISTiledMapServiceLayer("http://31.16.10.194:6080/arcgis/rest/services/2000_JiChuDT_20170505/MapServer");
            var basicLayer = new ArcGISDynamicMapServiceLayer("http://172.3.11.34:6080/arcgis/rest/services/BaseMap/MapServer");
            var dynamicLayer = new ArcGISDynamicMapServiceLayer("http://31.16.10.194:6080/arcgis/rest/services/HaiYuDongGuan/2000SheShiTu_20170505_1041/MapServer");
            var thematicMap = new ArcGISDynamicMapServiceLayer("http://172.3.11.34:6080/arcgis/rest/services/ThematicMap/MapServer");

           // var point = new Point(123, 28);
           // myMap.centerAt(point);
           // myMap.centerAndZoom(point,12)

            //下面代码无效？？？
            var point = new Point(123, 28 , new SpatialReference({wkid: 4490}));
            myMap.centerAndZoom(point, 2);

            // 初始化台风专题
            var typhoon = new Typhoon();
            typhoon.properties = {
                yourMap: testMap,
                filePath: './js/testData/tydata.json',
                basicLayer: basicLayer,
                infoGrid: 'typhoonSelectGrid',
                pathGrid: 'typhoonPathGrid',
                setsGrid: 'typhoonSetsGrid',
                legendGrid: 'typhoonLegendGrid',
                floatForecastGrid: 'forecastPanel',
                floatPathGrid: 'pathPanel',
                overviewGrid: 'overviewPanel'
            };
            // 初始化航迹专题
            var boats = new BoatsPath();
            boats.properties = {
                yourMap: testMap,
                basicLayer: basicLayer,
                filePath: 'js/testData/boats.json',
                floatGrid: 'boatFloatPanel',
                pathGrid: 'boatPathGrid'
            };
            // 初始化风浪流专题
            var wwf = new WWF();
            wwf.properties = {
                yourMap: testMap,
                basicLayer: basicLayer,
                showMeDiv: 'WWFPanel',
                controlDiv: 'wwfControlPanel'
            };

            var area = new AreaSwitch();
            area.properties = {
                map: myMap,
                baseEqu: dynamicLayer,
                thematicMap: thematicMap,
                basicMap: smallLayer
            };
            area.init();
            $("#superStrip").kendoTabStrip({
                activate: function (e) {
                    var title = $(e.item).text().trim();

                    // if (title == '海域动管') {
                    //     $("#map_layer_test").hide();
                    //     $("#map_layer_list").show();
                    //     wwf.destroyWWF();
                    //     area.init();
                    // } else {
                    //     $("#map_layer_list").hide();
                    //     area.destroy();
                    // }

                    //下面为临时代码,使用上面代码后从其它功能切换到海域动管后无法点击地图信息,暂时没有找到原因
                    if (title == '海域动管') {
                        window.location.reload();
                    } else {
                        $("#map_layer_list").hide();
                        area.destroy();
                    }

                    if (title == '台风专题') {
                        $("#map_layer_test").show();
                        wwf.runNow();
                        typhoon.runNow();
                    } else {
                        typhoon.destroyTyphoons();
                    }
                    if (title == '航迹展示') {
                        $("#map_layer_test").show();
                        wwf.runNow();
                        boats.runNow();
                    } else {
                        boats.destroyBoats();
                    }
                }
            });

            $("#funcSplit").kendoSplitter({
                panes: [{collapsed: false, size: "28%"}, {size: "72%"}]
            });
        }
    );
}

/**
 * 初始化二级页面
 */


