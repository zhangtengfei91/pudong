/**
 * Created by seky on 17/3/16.
 * 常用函数
 */
//创建点
function commonFun_createPoint(lon,lat){
    var point;
    require(["esri/geometry/Point","dojo/domReady!"],function(Point){
        var pt = new Point({
            x: lon,
            y: lat
        });
        point= pt;
    });
    return point;
}
//创建线
function commonFun_createPolyline(paths){
    var rePolyLin;
    require(["esri/geometry/Polyline","dojo/domReady!"],function(Polyline){

        var polyline = new Polyline({
            paths: paths
        });
        rePolyLin=polyline;
    });
    return rePolyLin;
}
//创建SimpleLineSymbol
function commonFun_createSimpleLineSymbol(col,widths){
    var reSimpleLineSymbol;
    require(["esri/symbols/SimpleLineSymbol","dojo/domReady!"],function(SimpleLineSymbol){
        var lineSymbol = new SimpleLineSymbol({
            color: col,
            width: widths
        });
        reSimpleLineSymbol=lineSymbol;
    });
    return reSimpleLineSymbol;
}
//创建PictureMarkerSymbol
function commonFun_picMarkerSymbol(picUrl,widths,heights){
    var reSymbol;//返回symbol对象
    require(["esri/symbols/PictureMarkerSymbol","dojo/domReady!"],function(PictureMarkerSymbol){
        var symbol = new PictureMarkerSymbol({
            url: picUrl,
            width: widths,
            height: heights
        });
        reSymbol=symbol;
    });
    return reSymbol;
}
//创建textSymbol
function commonFun_txtSymbol(txtColor,txtStr,fontSize){
    var reTxtSymbol;
    require(["esri/symbols/TextSymbol","dojo/domReady!"],function(TextSymbol){
        var txtSymbol = new TextSymbol({
            color: txtColor,
            haloColor: "black",
            haloSize: "1px",
            text: txtStr,
            xoffset: 3,
            yoffset: 3,
            font: {  // autocast as esri/symbols/Font
                size: fontSize,
                family: "sans-serif",
                weight: "bolder"
            }
        });
        reTxtSymbol=txtSymbol;
    });
    return reTxtSymbol;
}
//创建Graphic
function commonFun_createGraphic(geo,sym,att,popupTemplate){
    var reGraphic;
    require([
        "esri/Graphic","esri/PopupTemplate","dojo/domReady!"],function(Graphic,PopupTemplate){
        // Create the graphic
        var picGraphic = new Graphic({
            geometry: geo,   // Add the geometry created in step 4
            symbol: sym,   // Add the symbol created in step 5
            attributes: att,   // Add the attributes created in step 6
            popupTemplate: popupTemplate
        });
        reGraphic=picGraphic;

    });
    return reGraphic;
}
//创建PopupTemplate
function commonFun_createPopupTemplate(title,content){
    var rePopupTemplate;
    require(["esri/PopupTemplate","dojo/domReady!"],function(PopupTemplate){
        var popupTemplate=new PopupTemplate({
            actions:[],
            title: title,
            content: commonFun_setPopupTemplateContent(content),
            width:"100px"
        });
        rePopupTemplate=popupTemplate;
    });
    return rePopupTemplate;
}
//设置popupTemplate的内容
function commonFun_setPopupTemplateContent(content){
    // create a chart for example
    return content;
}
//获取远程Json数据
function getJsonDataFromRomate(dataUrl){
    var datas=new Array();
    $.ajaxSettings.async = false;//同步 需要返回数据 所以关闭异步
    $.getJSON(dataUrl, function(data) {
        $.each(data, function(i, item) {
            datas[i]=item;
        });
    });
    $.ajaxSettings.async = true;//异步 异步打开 否则影响其他的异步操作
    return datas;//返回对象
}
//处理发布日期
//日期格式 "2017-03-19T00:00:00.000Z"
function commonFun_DealPublishDate(str){
    var index=str.indexOf('T');//获取到字符T的位置 然后截取
    var reDate=str.substring(0,index);//获取T之前的字符
    return reDate;
}

/**
 * 将平行的记录转换成层级记录 yj 0829
 *
 * @param a JSON数组
 * @param idStr JSON每条记录的Id数组
 * @param pidStr JSON每条记录的父节点的Id
 * @param childrenStr 子记录数组
 * @returns {Array} 树形结构
 */
function transData(a, idStr, pidStr, childrenStr) {
    var r = [], hash = {}, id = idStr, pid = pidStr, children = childrenStr, i = 0, j = 0, len = a.length;
    for (; i < len; i++) {
        hash[a[i][id]] = a[i];
    }
    for (; j < len; j++) {
        var aVal = a[j], hashVP = hash[aVal[pid]];
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
        } else {
            r.push(aVal);
        }
    }
    return r;
}

//图层信息 yj 0830
function showInfoWindow(results) {
    var len = results.length,
        str = "";
    for(var i=0;i<len;i++) {
        if(!!results[i].features.length) {
            var obj =  results[i].features[0].attributes;
            $.each(obj,function(key,value){
                console.log("typeof:"+typeof value+" len:"+value);
                if(typeof value == "string" && value.length > 25) {
                    var valueStr = "\n";
                    for(var j=0;j<value.length;j+=25) {
                        valueStr += value.substr(j,25)+'\n';
                    }
                    value = valueStr;
                }
                value == null && (value = "无");
                key == "Shape_Length" && (key = "长度");
                key == "Shape_Area" && (key = "面积");
                (!!key.match(/([a-z]*\.)(.+)/)) && (key = key.replace(RegExp.$1,""));
                str += key + ':' + value + '\n';
            });
        }
    }
    !!!str && (str = "无数据，请浏览其它地区!");
    $("#showInfo").html("<pre>" + str + "</pre>");
}
//获取左侧菜单的数据以及加载菜单
function commonFun_getSiderbar(data,dataStation){
    var arr=[];
    $.ajax({
        type : "GET",
        url : '/js/json/'+data,
        dataType : "json",
        contentType : "application/json;charset=utf-8",
        async: false,
        success : function(data) {
            arr = data;
        },
        error:function (error) {
            console.log(error)
        }
    });
    $("#sidebarBox").kendoListBox({
        dataSource: arr,
        template: "<div id='#:id #'name='#:name#'accessKey='#:name#'/>#:name #</div>",
        dataTextField: "name",
        dataValueField: "id",
        height:400,
        change:function(){
            sidebarId = event.target.children[0].id;
            sidebarName;
            if(sidebarId ==''){
                switch(data){
                    case "seaSurVailJson.js" :
                        sidebarId = "dataSpeed";
                        sidebarName = "风速";
                        break;
                    case "seaBioCondiJson.js" :
                        sidebarId = "dataFloatPlant";
                        sidebarName = "浮游植物";
                        break;
                    case "seaIntrusionJson.js":
                        sidebarId = "dataGroWater";
                        sidebarName = "地下水埋深";
                        break;
                    case "seaOutfallJson.js":
                        sidebarId = "dataSalt";
                        sidebarName = "盐度";
                        break;
                    case "seaSedimentJson.js":
                        sidebarId = "dataOxygen";
                        sidebarName = "氧化还原电位";
                        break;
                }

            }else{
                sidebarName = $("#"+sidebarId)[0].accessKey;
            }
            commonFun_getAndShowData(sidebarId,sidebarName);
            commonFun_initStations(dataStation);
        }
    });
    var sidebarBox = $("#sidebarBox").data("kendoListBox");
    sidebarBox.select(sidebarBox.items().first());
}
//加载json数据
function commonFun_getAndShowData(typeId,typeName) {
    var arr=[];
    var nearSea = [];
    var outSea = [];
    var month = [];
    $.ajax({
        type : "GET",
        url : '/js/json/'+typeId+'.js',
        dataType : "json",
        contentType : "application/json;charset=utf-8",
        async: false,
        success : function(data) {
            arr = data;
            //stationPointData=data;//返回数据
            for(var i= 0;i<arr.length;i++){
                nearSea.push(Number(arr[i].近岸监测值));
                outSea.push(Number(arr[i].外海监测值));
                month.push(arr[i].月份);
            }
            stationPointData=nearSea;//返回map上的popup数据
        },
        error:function (error) {
            console.log(error)
        }
    });
    //commonFun_showPopupTemplate(stationPts,nearSea);
    if($("#dataGrid").data("kendoGrid")){
        var g = $("#dataGrid").data("kendoGrid");
        g.destroy();
    }
    $("#dataGrid").kendoGrid({
        dataSource: {
            data: arr,
            pageSize: 15
        },
        height: 500,
        scrollable: true,
        pageable: {
            input: true,
            numeric: false
        },
        column: {
            attributes: {
                "class": "table-cell",
                style: "text-align: right; font-size: 14px"
            }
        }
    })//表格
    basicLine("dataLine",typeName,month,nearSea,outSea);//线状图
    basicBar("dataBar",typeName,month,nearSea,outSea);//条状图
    basicColumn("dataColumn",typeName,month,nearSea,outSea);//柱状图
    basicPolarSpider("dataPolarSpider",typeName,month,nearSea,outSea);//玫瑰图//pointsData= nearSea;
}
//绘制站位
var txtDataGraphicStation;
function commonFun_initStations(station){
    require(["esri/graphic","dojo/_base/Color","esri/layers/GraphicsLayer","dojo/_base/array","esri/symbols/TextSymbol","esri/geometry/Point","dojo/domReady!"],
        function(Graphic,Color,GraphicsLayer,arrayUtils,TextSymbol,Point){
            var stationPts = [];//站位经纬度
            var picGraphicStation = new GraphicsLayer({"id":"picGraphicStation"});//监测站位popup
            var txtGraphicStation = new GraphicsLayer({"id":"txtGraphicStation"});//监测站位名称
            txtDataGraphicStation = txtDataGraphicStation||new GraphicsLayer({"id":"txtDataGraphicStation"})  ;//根据左侧菜单栏，在popup显示数据
            //绘制点及加载
            $.ajax({
                type : "GET",
                url : '/js/json/'+station,
                dataType : "json",
                async: false,
                success : function(data) {
                    stationPts = data;
                },
                error:function (error) {
                    console.log(error)
                }
            });
            arrayUtils.forEach(stationPts, function(point) {
                var pointTextSymbol = new TextSymbol(point.name).setSize("14").setOffset(0,-10);//显示站位名称
                var txtGraphic = new Graphic(new Point(point.lon,point.lat),pointTextSymbol);
                var picGraphic = new Graphic(new Point(point.lon,point.lat),commonFun_createPictureSymbol('/img/blueBubble.png', 0, 20,50,55));
                txtGraphicStation.add(txtGraphic);
                picGraphicStation.add(picGraphic);
                mapSec.addLayers([picGraphicStation,txtGraphicStation]);
            });
            if(!!txtDataGraphicStation.graphics.length){
                txtDataGraphicStation.clear();
            }
            for (var i = 0; i < stationPts.length; i++) {
                var pointDataTextSymbol = new TextSymbol(stationPointData[i]).setOffset(0,20).setSize("12").setColor(
                    new Color([255,255,255]));//显示站位信息
                if (pointDataTextSymbol.text == "") {
                    pointDataTextSymbol.text = "无";
                }
                var txtDataGraphic = new Graphic(new Point(stationPts[i].lon, stationPts[i].lat), pointDataTextSymbol);
                txtDataGraphicStation.add(txtDataGraphic);
                mapSec.addLayer(txtDataGraphicStation);
            }
            setInterval(function() {
                if(!!txtDataGraphicStation.graphics.length ){
                    txtDataGraphicStation.clear();
                }
                for (var j=0;j<stationPts.length;j++){
                    pointDataTextSymbol.text = (Math.random()*6+2).toFixed(2);
                    var txtDataGraphic = new Graphic(new Point(stationPts[j].lon, stationPts[j].lat), pointDataTextSymbol);
                    txtDataGraphicStation.add(txtDataGraphic);
                    mapSec.addLayer(txtDataGraphicStation);
                }
            },3000);
            //点击监测站位加载窗体
            dojo.connect(picGraphicStation,"onClick",function(e){
                //$("#popupTemplate").css({"display":"block","left":e.pageX,"top": e.pageY});
            });
            //鼠标移到监测站位，图片变大
            dojo.connect(picGraphicStation,"onMouseOver",function(e){
                var symbolMarker=commonFun_createPictureSymbol('/img/blueBubble.png', 0, 20, 60,65);
                event.graphic.setSymbol(symbolMarker);
            })
            //鼠标移到监测站位，图片变小
            dojo.connect(picGraphicStation,"onMouseOut",function(e){
                var symbolMarker=commonFun_createPictureSymbol('/img/blueBubble.png', 0, 20, 50,55);
                event.graphic.setSymbol(symbolMarker);
            })
        })
}
//不同图表以及数据表之间的切换
function commonFun_ChangeDataExpress(typeId,typeName,dataId) {
    switch(dataId){
        case "dataGridBtn":
            commonFun_getAndShowData(typeId,typeName);
            $("#dataGrid").css("display","block");//表格数据显示
            $("#dataColumn").css("display","none");//柱状图隐藏
            $("#dataLine").css("display","none");//线状图隐藏
            $("#dataPolarSpider").css("display","none");//点状图隐藏
            $("#dataBar").css("display","none");//条状图隐藏
            break;
        case "dataColumnBtn":
            commonFun_getAndShowData(typeId,typeName);
            $("#dataGrid").css("display","none");//表格数据隐藏
            $("#dataColumn").css("display","block");//柱状图显示
            $("#dataLine").css("display","none");//线状图隐藏
            $("#dataPolarSpider").css("display","none");//点状图隐藏
            $("#dataBar").css("display","none");//条状图隐藏
            break;
        case "dataPolarSpiderBtn":
            commonFun_getAndShowData(typeId,typeName);
            $("#dataGrid").css("display","none");//表格数据隐藏
            $("#dataColumn").css("display","none");//柱状图隐藏
            $("#dataLine").css("display","none");//线状图隐藏
            $("#dataPolarSpider").css("display","block");//点状图显示
            $("#dataBar").css("display","none");//条状图隐藏
            break;
        case "dataLineBtn":
            commonFun_getAndShowData(typeId,typeName);
            $("#dataGrid").css("display","none");//表格数据隐藏
            $("#dataColumn").css("display","none");//柱状图隐藏
            $("#dataLine").css("display","block");//线状图显示
            $("#dataPolarSpider").css("display","none");//点状图隐藏
            $("#dataBar").css("display","none");//条状图隐藏
            break;
        case "dataBarBtn":
            commonFun_getAndShowData(typeId,typeName);
            $("#dataGrid").css("display","none");//表格数据隐藏
            $("#dataColumn").css("display","none");//柱状图隐藏
            $("#dataLine").css("display","none");//线状图隐藏
            $("#dataPolarSpider").css("display","none");//点状图隐藏
            $("#dataBar").css("display","block");//条状图显示
            break;
    }
}
//创建PictureSymbol
function commonFun_createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight)  {
    var reSymbol;//返回symbol对象
    require(["esri/symbols/PictureMarkerSymbol","dojo/domReady!"], function (PictureMarkerSymbol) {
        var symbol= new PictureMarkerSymbol(
            {
                "xoffset": xOffset, "yoffset": yOffset, "type": "esriPMS",
                "url": url,
                "contentType": "image/png",
                "width":xWidth, "height": yHeight
            });
        reSymbol=symbol;
    });
    return reSymbol;
}
//海水环境监测六大模块
function allSeaFunction(){
    var mapSec;//二级页面的map
    var sidebarId ;//左侧菜单栏Id
    var sidebarName;//左侧菜单栏名称
    var stationPointData =[];//站位数据
    var stationDropDownName = [];//下拉列表站位名称
    var stationName = [];//站位名称
    var arrSea=[];//grid 数据源 DataSource
    var month = [];
    var stationValue=[];//存储站位名称和站位值
    var unit='';//监测值单位
    var chartId ='dataGrid'// 数据类型的id ,默认值是dataGrid
    var seaStation = "";//海洋生物状况与其它模块的数据不一致，需判断
    var pieData =[];
    //初始化二级页面地图
    function initSecMap(mapDiv,lon,lat,zoom) {
        require([
                "esri/map",
                "esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ArcGISTiledMapServiceLayer",
                "esri/layers/GraphicsLayer",
                "esri/symbols/PictureMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "dojo/_base/Color",
                "esri/graphic",
                "esri/geometry/Point",
                "esri/symbols/TextSymbol",
                "dojo/_base/array",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/SpatialReference",
                "esri/symbols/Font",
                "dojo/on",
                "dojo/dom",
                "dojo/domReady!"],
            function(Map,ArcGISDynamicMapServiceLayer,ArcGISTiledMapServiceLayer,
                     GraphicsLayer,
                     PictureMarkerSymbol,
                     SimpleLineSymbol,
                     Color,
                     Graphic,Point,TextSymbol, arrayUtils,SimpleMarkerSymbol,SimpleFillSymbol,SpatialReference,Font,
                     on,dom) {
                mapSec = new Map(mapDiv,{
                    center:[122,32.57],
                    logo:false,
                },new SpatialReference({wkid:4490}));
                var baseMap = new ArcGISTiledMapServiceLayer("http://31.16.10.194:6080/arcgis/rest/services/2000_JiChuDT_20170505/MapServer");
                mapSec.addLayer(baseMap);
                var pt = new Point(lon,lat,new SpatialReference({wkid:4490}));
                mapSec.centerAndZoom(pt,zoom);
            })
    }

    //获取左侧菜单的数据以及加载菜单
    function getSiderbar(data,dataStation){
        seaStation = dataStation;
        var dataSource = getJsonData(data);
        $("#sidebarBox").kendoListBox({
            dataSource: dataSource,
            template: "<div id='#:id #'name='#:name#'accessKey='#:name#'/>#:name #</div>",
            dataTextField: "name",
            dataValueField: "id",
            height:400,
            change:function(){
                sidebarId = event.target.children[0].id;
                sidebarName;
                if(sidebarId ==''){
                    switch(data){
                        case "seaSurVailJson" :
                            sidebarId = "dataSpeed";
                            sidebarName = "风速";
                            break;
                        case "seaBioCondiJson" :
                            sidebarId = "dataFloatPlant";
                            sidebarName = "浮游植物";
                            break;
                        case "seaIntrusionJson":
                            sidebarId = "dataGroWater";
                            sidebarName = "地下水埋深";
                            break;
                        case "seaOutfallJson":
                            sidebarId = "dataSalt";
                            sidebarName = "盐度";
                            break;
                        case "seaSedimentJson":
                            sidebarId = "dataOxygen1";
                            sidebarName = "氧化还原电位";
                            break;
                    }
                }else{
                    sidebarName = $("#"+sidebarId)[0].accessKey;
                }
                getAndShowData(chartId);
                initStations(seaStation);
            }
        });
        var sidebarBox = $("#sidebarBox").data("kendoListBox");
        sidebarBox.select(sidebarBox.items().first());
    }
    function getAndShowData(chartId) {
        stationPointData =[];//站位数据
        arrSea=[];
        stationValue=[];
        var bValue =[];
        var arr=getJsonData(sidebarId);
        if(seaStation == "seaBioCondiStation"){
            for(var i= 0;i<arr.length;i++){
                stationPointData.push(arr[i].近岸);
                stationValue.push([arr[i].类群,Number(arr[i].全海域)]);
                arrSea.push({监测时间:arr[i].监测时间,类群:arr[i].类群,近岸:arr[i].近岸,外海:arr[i].外海,全海域:arr[i].全海域})
            }
        }else{
            for(var i=0;i<arr.length;i++){
                for(var j=0;j<arr[i].length;j++){
                    arrSea.push({监测时间:arr[i][j].监测时间,月份:arr[i][j].月份,监测站位:arr[i][j].监测站位,监测值:arr[i][j].监测值,单位:(arr[i][j].单位!= "" ? arr[i][j].单位:"/")});
                    month.push(arr[i][j].月份);
                    stationName.push(arr[i][j].监测站位);
                    bValue.push(Number([arr[i][j].监测值]));
                }
                //月份
                month=month.filter(function(ele,index,arr){
                    return index == arr.indexOf(ele);
                });
                //站位名称
                stationName=stationName.filter(function(ele,index,arr){
                    return index == arr.indexOf(ele);
                });
                stationPointData.push(arr[i][0].监测值);
                stationValue.push({"name":stationName[i].toString(),"data":bValue.slice(i*arr[i].length,(i+12)*arr[i].length)});
                unit=arr[0][0].单位;
            }

        }
        basicCharts(chartId,stationValue);
    }
    function basicCharts(dataType,dropDownStationName) {
        var stationValData=[];
        var stationValName =[];
        for(var i=0;i<stationValue.length;i++){
            if (dropDownStationName == stationValue[i].name){
                stationValName = dropDownStationName;
                stationValData.push({"name":stationValName,"data":stationValue[i].data});
            }
            if(dropDownStationName == "所有站位"){
                stationValName = stationValue[i].name;
                stationValData.push({"name":stationValName,"data":stationValue[i].data});
            }
        }
        stationValData.length == 0 ? stationValData = stationValue : stationValData = stationValData;
        switch (dataType){
            case "dataLine":
                basicLine("dataLine",sidebarName,month,unit,stationValData);
                break;
            case "dataColumn":
                basicColumn("dataColumn",sidebarName,month,unit,stationValData);
                break;
            case "dataGrid":
                $("#toolBar > span").hide();//dropdownlist 隐藏
                if($("#dataGrid").data("kendoGrid")){
                    var g = $("#dataGrid").data("kendoGrid");
                    g.destroy();
                }
                $("#dataGrid").kendoGrid({
                    dataSource: {
                        data: arrSea,
                        pageSize: 15
                    },
                    height:360,
                    scrollable: true,
                    pageable: {
                        input: true,
                        numeric: false
                    },
                    column: {
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: right; font-size: 14px"
                        }
                    }
                })//表格
                break;
            case "dataArea":
                basicArea("dataArea",sidebarName,month,unit,stationValData);
                break;
            case "dataPie":
                basicPie("dataPie",sidebarName,stationValue);
                break;
        }
    }
    function loadDropDownList(dataType) {
        if($("#dataDropDownList").data("kendoDropDownList")){
            var dropDownList = $("#dataDropDownList").data("kendoDropDownList");
            dropDownList.select(0);
            /*dropDownList.destroy();*/
        }else{
            stationDropDownName.push({text:"所有站位",value:"所有站位"});
            for(var i=0;i<stationName.length;i++){
                stationDropDownName.push({text:stationName[i],value:stationName[i]});
            }
        }
        $("#dataDropDownList").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: stationDropDownName,
            index: 0,
            change: function() {
                var dropDownStationName =  $("#dataDropDownList").val();
                basicCharts(dataType,dropDownStationName);
            }
        });
    }
    //绘制站位
    var txtDataGraphicStation;//根据左侧菜单栏，在popup显示数据
    function initStations(station){
        var popup = changePopupImg(station);//不同模块 展示的popup不同
        require(["esri/graphic","dojo/_base/Color","esri/layers/GraphicsLayer","dojo/_base/array","esri/symbols/TextSymbol","esri/geometry/Point","dojo/domReady!"],
            function(Graphic,Color,GraphicsLayer,arrayUtils,TextSymbol,Point){
                var picGraphicStation = new GraphicsLayer({"id":"picGraphicStation"});//监测站位popup
                var txtGraphicStation = new GraphicsLayer({"id":"txtGraphicStation"});//监测站位名称
                txtDataGraphicStation = txtDataGraphicStation || new GraphicsLayer({"id":"txtDataGraphicStation"})  ;//根据左侧菜单栏，在popup显示数据
                //绘制点及加载
                var stationPts = getJsonData(station);//站位经纬度
                arrayUtils.forEach(stationPts, function(point) {
                    var pointTextSymbol = new TextSymbol(point.name).setSize("12").setOffset(0,-10);//显示站位名称
                    var txtGraphic = new Graphic(new Point(point.lon,point.lat),pointTextSymbol);
                    var picGraphic = new Graphic(new Point(point.lon,point.lat),commonFun_createPictureSymbol(popup[0],popup[1], popup[2],popup[3],popup[4]));
                    txtGraphicStation.add(txtGraphic);
                    picGraphicStation.add(picGraphic);
                    mapSec.addLayers([picGraphicStation,txtGraphicStation]);
                });
                if(!!txtDataGraphicStation.graphics.length){
                    txtDataGraphicStation.clear();
                }
                for (var i = 0; i < stationPts.length; i++) {
                    var pointDataTextSymbol = new TextSymbol(stationPointData[i]).setOffset(5,7).setSize("12").setColor(
                        new Color([0,0,0]));//显示站位信息
                    if (pointDataTextSymbol.text == "") {
                        pointDataTextSymbol.text = "无";
                    }
                    var txtDataGraphic = new Graphic(new Point(stationPts[i].lon, stationPts[i].lat), pointDataTextSymbol);
                    txtDataGraphicStation.add(txtDataGraphic);
                    mapSec.addLayer(txtDataGraphicStation);
                }
                /*setInterval(function() {
                    if(!!txtDataGraphicStation.graphics.length ){
                        txtDataGraphicStation.clear();
                    }
                    for (var j=0;j<stationPts.length;j++){
                        pointDataTextSymbol.text = (Math.random()*6+2).toFixed(2);
                        var txtDataGraphic = new Graphic(new Point(stationPts[j].lon, stationPts[j].lat), pointDataTextSymbol);
                        txtDataGraphicStation.add(txtDataGraphic);
                        mapSec.addLayer(txtDataGraphicStation);
                    }
                },3000);*/
                //点击监测站位加载窗体
                /*dojo.connect(picGraphicStation,"onClick",function(e){
                    var symbolMarker=commonFun_createPictureSymbol('/img/popup.png', 0, 8,70,64);
                    event.graphic.setSymbol(symbolMarker);
                    //$("#popupTemplate").css({"display":"block","left":e.pageX,"top": e.pageY});
                });*/
                //鼠标移到监测站位，图片变大
                dojo.connect(picGraphicStation,"onMouseOver",function(e){
                    var symbolMarker=commonFun_createPictureSymbol(popup[0],popup[1],popup[2],popup[3]*popup[5],popup[4]*popup[5]);
                    event.graphic.setSymbol(symbolMarker);
                })
                //鼠标移到监测站位，图片变小
                dojo.connect(picGraphicStation,"onMouseOut",function(e){
                    var symbolMarker=commonFun_createPictureSymbol(popup[0],popup[1],popup[2],popup[3],popup[4]);
                    event.graphic.setSymbol(symbolMarker);
                })
            })
    }
    //不同图表以及数据表之间的切换
    function ChangeDataExpress(dataId) {
        chartId = dataId.slice(0,-3);
        switch(dataId){
            case "dataGridBtn":
                getAndShowData(chartId);
                $("#dataGrid").css("display","block");//表格数据显示
                $("#dataColumn").css("display","none");//柱状图隐藏
                $("#dataLine").css("display","none");//线状图隐藏
                $("#dataPolarSpider").css("display","none");//点状图隐藏
                $("#dataBar").css("display","none");//条状图隐藏
                $("#dataPie").css("display","none");//饼图隐藏
                $("#dataArea").css("display","none");//面积图隐藏
                break;
            case "dataColumnBtn":
                getAndShowData(chartId);
                loadDropDownList(chartId);
                $("#dataGrid").css("display","none");//表格数据隐藏
                $("#dataColumn").css("display","block");//柱状图显示
                $("#dataLine").css("display","none");//线状图隐藏
                $("#dataPolarSpider").css("display","none");//点状图隐藏
                $("#dataBar").css("display","none");//条状图隐藏
                $("#dataPie").css("display","none");//饼图隐藏
                $("#dataArea").css("display","none");//面积图隐藏
                break;
            case "dataPolarSpiderBtn":
                getAndShowData(chartId);
                $("#dataGrid").css("display","none");//表格数据隐藏
                $("#dataColumn").css("display","none");//柱状图隐藏
                $("#dataLine").css("display","none");//线状图隐藏
                $("#dataPolarSpider").css("display","block");//点状图显示
                $("#dataBar").css("display","none");//条状图隐藏
                $("#dataPie").css("display","none");//饼图隐藏
                $("#dataArea").css("display","none");//面积图隐藏
                break;
            case "dataLineBtn":
                getAndShowData(chartId);
                loadDropDownList(chartId);
                $("#dataGrid").css("display","none");//表格数据隐藏
                $("#dataColumn").css("display","none");//柱状图隐藏
                $("#dataLine").css("display","block");//线状图显示
                $("#dataPolarSpider").css("display","none");//点状图隐藏
                $("#dataBar").css("display","none");//条状图隐藏
                $("#dataPie").css("display","none");//饼图隐藏
                $("#dataArea").css("display","none");//面积图隐藏
                break;
            case "dataBarBtn":
                getAndShowData(chartId);
                loadDropDownList(chartId);
                $("#dataGrid").css("display","none");//表格数据隐藏
                $("#dataColumn").css("display","none");//柱状图隐藏
                $("#dataLine").css("display","none");//线状图隐藏
                $("#dataPolarSpider").css("display","none");//点状图隐藏
                $("#dataBar").css("display","block");//条状图显示
                $("#dataPie").css("display","none");//饼图隐藏
                $("#dataArea").css("display","none");//面积图隐藏
                break;
            case "dataPieBtn":
                getAndShowData(chartId);
                $("#dataGrid").css("display","none");//表格数据隐藏
                $("#dataColumn").css("display","none");//柱状图隐藏
                $("#dataLine").css("display","none");//线状图隐藏
                $("#dataPolarSpider").css("display","none");//点状图隐藏
                $("#dataBar").css("display","none");//条状图隐藏
                $("#dataPie").css("display","block");//饼图显示
                $("#dataArea").css("display","none");//面积图隐藏
                break;
            case "dataAreaBtn":
                getAndShowData(chartId);
                loadDropDownList(chartId);
                $("#dataGrid").css("display","none");//表格数据隐藏
                $("#dataColumn").css("display","none");//柱状图隐藏
                $("#dataLine").css("display","none");//线状图隐藏
                $("#dataPolarSpider").css("display","none");//点状图隐藏
                $("#dataBar").css("display","none");//条状图隐藏
                $("#dataPie").css("display","none");//饼图隐藏
                $("#dataArea").css("display","block");//面积图显示
                break;
        }
    }
    return {
        initSecMap:initSecMap,
        getSiderbar:getSiderbar,
        ChangeDataExpress:ChangeDataExpress
    }
}
//不同模块 展示的popup不同
function changePopupImg(station){
    var imgType = "";
    switch(station){
        case "seaEnvirStation"://海水环境入侵
            imgType =['/img/blueBubble.png',3,7,48,45,1.2];//url xoffset yoffset xwith yheight multple
            break;
        case "seaSedimentStation"://海洋沉积物监测
            imgType =['/img/redTriangle.png',0,5,6,6,2];
            break;
        case "seaBioCondiStation"://海洋生物状况
            imgType =['/img/blueTriangle.png',0,5,6,6,2];
            break;
        case "seaIntrusionStation"://海水入侵环境
            imgType =['/img/redCircle.png',0,5,6,6,2];
            break;
        case "seaOutfallStation":// 排污口环境监测
            imgType =['/img/redPlus.png',0,5,12,12,2];
            break;
    }
    return imgType;
}
//通过ajax 获取json数据
function getJsonData(data) {
    var arr=[];
    $.ajax({
        type : "GET",
        url : '/js/json/'+data+".js",
        dataType : "json",
        async: false,
        success : function(data) {
            arr = data;
        },
        error:function (error) {
            console.log(error)
        }
    });
    return arr;
}