/**
 * 工具类(添加完方法后记得重新生成注释)
 *
 * @constructor dsy 20170829
 * @type {{func: null, accuracy: number, STRING, NUMBER, TIME1, TIME2, DEFINED, DEFINED, format: Util.format, cos: Util.cos, sin: Util.sin, seaMileFormat: Util.seaMileFormat, dateFormat_2: Util.dateFormat_2, dateFormat_1: Util.dateFormat_1, arrayToHexString: Util.arrayToHexString, containsByContent: Util.containsByContent, drawSector: Util.drawSector, drawText: Util.drawText, getPoints: Util.getPoints, slack: Util.slack, leastSquare: Util.leastSquare, getLocalJSON: Util.getLocalJSON, initFloatPanel: Util.initFloatPanel, dynamicFloatPanel: Util.dynamicFloatPanel, hexToArrays: Util.hexToArrays, controlItem: Util.controlItem}}
 */
var Util = {
    func: null,
    accuracy: 2, // 数字精度
    get STRING() {return "string";},
    get NUMBER() {return "number";},
    get TIME1() {return "time1";},
    get TIME2() {return "time2";},
    get DEFINED() {return "defined";},
    set DEFINED(_func) {
        if (_func) {
            this.func = _func;
        }
    },
    /**
     * 格式转换
     *
     * @param _value 传入数值
     * @param type 转换类别
     * @return {undefined}
     */
    format: function(_value, type) {
        if (_value) {
            if (type == this.STRING) {
                return new String(_value);
            } else if (type == this.NUMBER) {
                var value = new String(_value);
                if (value.match(/^[0-9]+$/)) {
                    return parseInt(value);
                }
                if (value.match(/^[0-9]*.[0-9]+$/)) {
                    return parseFloat(value);
                }
            } else if (type == this.TIME1) {
                return this.dateFormat_1(new String(_value));
            } else if (type == this.TIME2) {
                return this.dateFormat_2(new String(_value));
            } else if (type == this.DEFINED && this.func) {
                return this.func(_value);
            } else {
                console.log("type isn't defined!");
            }
        }
        return undefined;
    },
    /**
     * 角度余弦
     *
     * @param angle 角度
     * @return {string}
     */
    cos: function(angle) {
        return Math.cos(angle*Math.PI/180).toFixed(this.accuracy);
    },
    /**
     * 角度正弦
     *
     * @param angle 角度
     * @return {string}
     */
    sin: function (angle) {
        return Math.sin(angle*Math.PI/180).toFixed(this.accuracy);
    },
    /**
     * 海里转经纬度
     *
     * @param sea_mile 海里
     * @return {number}
     */
    seaMileFormat: function(sea_mile) {
        var lonlat = sea_mile / 60; // 一经纬度为60海里
        return lonlat.toFixed(this.accuracy);
    },
    /**
     * 转换时间格式2
     *
     * @param dateStr 日期字符串
     * @return {string} YY月dd日hh时
     */
    dateFormat_2: function (dateStr) {
        var date = new Date(dateStr);
        return (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "时";
    },
    /**
     * 转换时间格式1
     *
     * @param dateStr 时间字符串
     * @return {string} yyyy-mm-dd hh:MM
     */
    dateFormat_1: function (dateStr) {
        var date = new Date(dateStr);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' +minute;
    },
    /**
     * 将数组里面的值转换为16进制的值
     *
     * @param array 数值数组
     * @return {string}
     */
    arrayToHexString: function (array) {
        if (array.length == 3) {
            return "rgb(" + array.join(",") + ")";
        } else if (array.length == 4) {
            return "rgba(" + array.join(",") + ")";
        }
    },
    /**
     * 数组对象的某个属性是否包含
     *
     * @param arr 数组
     * @param tag 数组对象的属性
     * @param content 属性值
     * @return {boolean} 是否存在
     */
    containsByContent: function(arr, tag, content) {
        try {
            for (var i=0; i<arr.length; i++)
                if (arr[i][tag] == content)
                    return true;
        } catch(err) {
            console.error(err);
        }
        return false;
    },
    /**
     * 绘制扇形
     *
     * @param lon 经度
     * @param lat 维度
     * @param radius 半径
     * @param angleStart 开始角度
     * @param angleEnd 终止角度
     * @param sectorSymbol 扇形样式
     * @param spatialStd 坐标标准
     * @param pointsNum 精度点数目
     * @return {Graphic}
     */
    drawSector: function (lon,lat,radius,angleStart,angleEnd,sectorSymbol, spatialStd, pointsNum) {
        var graphic;
        var self = this;
        require([
            "esri/geometry/Circle",
            "esri/symbols/PictureMarkerSymbol",
            "esri/layers/GraphicsLayer",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/graphic",
            "dojo/_base/Color",
            "dojo/on",
            "dojo/dom",
            "dojo/domReady!"
        ], function(Circle,PictureMarkerSymbol,GraphicsLayer,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,Graphic,Color,on ,dom) {
            var circle = self.getPoints([lon,lat],radius,angleStart,angleEnd, pointsNum);
            var po={"rings":[circle],"spatialReference":{"wkid":spatialStd}};
            var polygonSymbol=new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color(sectorSymbol.lineColor),
                    1
                ),
                new Color(sectorSymbol.symbolColor)

            );
            var polygon=new esri.geometry.Polygon(po);

            graphic = new Graphic(polygon,polygonSymbol);
        });
        return graphic;
    },
    /**
     * 绘制文本图形
     *
     * @param x 坐标X
     * @param y 坐标Y
     * @param text 文本
     * @param textSize 文本大小
     * @param textColor 文本颜色
     * @param spatialStd 坐标标准
     */
    drawText: function (x,y,text,textSize,textColor,spatialStd) {
        var graphic = null;
        require([
            "esri/symbols/TextSymbol",
            "esri/graphic",
            "dojo/_base/Color",
            "esri/symbols/Font",
            "esri/SpatialReference"
        ], function (TextSymbol, Graphic, Color, Font, SpatialReference) {
            var textSymbol = new TextSymbol(text);
            var sr = new SpatialReference({wkid: spatialStd});
            textSymbol.setColor(new Color(textColor)).setFont(new Font().setSize(textSize));
            graphic = new Graphic(new esri.geometry.Point(x,y,sr),textSymbol);
        });
        return graphic;
    },
    /**
     * 获取画扇型的所有点集
     *
     * @param center 圆心
     * @param radius 半径
     * @param startAngle 开始角度
     * @param endAngle 终止角度
     * @param pointsNum 精度点数目
     * @return {Array}
     */
    getPoints: function (center,radius,startAngle,endAngle, pointsNum){
        var sin;
        var cos;
        var x;
        var y;
        var angle;

        var points=new Array();
        points.push(center);
        for (var i = 0; i <= pointsNum; i++) {
            //根据pointNum的数值(数量越多，精度越高）获取细分的扇面
            angle=startAngle+(endAngle-startAngle)*i/pointsNum;
            sin=Math.sin(angle*Math.PI/180);
            cos=Math.cos(angle*Math.PI/180);
            x=center[0]+radius*cos;
            y=center[1]+radius*sin;
            points[i]=[x,y];
        }

        var point=points;
        points.push(center);
        return point;
    },
    /**
     * 松弛数组 TODO
     *
     * @param points 二维数组（数组有序）
     * @return {Object} 松弛和还原函数
     */
    slack: function (points, scale) {
        if (scale <= 0) {
            return null;
        }
        var scale1 = endX - beginX;
        var minX=points[0][0], maxX=points[0][0];
        for (var i=1; i<points.length; i++) {
            if (points[i][0] > maxX) {
                maxX = points[i][0];
            }
            if (points[i][0] < minX) {
                minX = points[i][0];
            }
        }
        var scale2 = maxX - minX;
        var scale = scale1 / scale2;
        var move = beginX - points[0][0];
        return {loose: function (arr) {
            var cache = [];
            arr.forEach(function (elem) {
                cache.push({});
            });
        }, recover: function(arr) {

        }};
    },
    /**
     * 最小二乘法曲线拟合
     * y = a0 + a1*x + a2*x^2 +...+ an*x^n
     *
     * @param points 二维数组
     * @param n 方程阶数
     * @return {Function} 拟合出来的曲线方程
     */
    leastSquare: function (points, n) {
        var yAxis = [[]];
        var xAxis = [];
        for (var i=0; i<points.length; i++) {
            yAxis[0].push(points[i][1]);
            var chip = [];
            for (var j=0; j<=n; j++) {
                chip.push(Math.pow(points[i][0], j));
            }
            xAxis.push(chip);
        }
        var yMat = new Matrix(yAxis).transpose(); // y'
        var xMat = new Matrix(xAxis); // x
        var step1 = xMat.transpose().mul(xMat).inverse(); // (x'x)^-1
        var step2 = xMat.transpose().mul(yMat); // x'*y'
        var result = step1.mul(step2); // (x'x)^-1*(x'*y')
        var rFunc = function (x) {
            var sum = 0;
            for (var i=0; i<result.mat.length; i++) {
                sum += result.mat[i][0]*Math.pow(x, i);
            }
            return sum;
        };
        var equation = [];
        for (var i=0; i<result.mat.length; i++) {
            equation.push(result.mat[i][0] + "*x^" + i);
        }
        rFunc["Equation"] = equation.join("+");
        rFunc["A"] = result; // a0,a1,a2...an
        return rFunc;
    },
    /**
     * 获得JSON数据(无法跨域调用)
     *
     * @param path 文件路径
     * @return {JSON}
     */
    getLocalJSON: function (path) {
        var typhoonData = null;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if(xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                typhoonData = xmlHttp.responseText;
            }
        };

        xmlHttp.open('GET',path,false);
        xmlHttp.send();
        if (typhoonData) {
            return JSON.parse(typhoonData);
        } else {
            console.error("can't read data from this path!");
        }
    },
    /**
     * 依据配置填充浮动面板
     *
     * @param floatGrid 浮动面板JQ对象
     * @param list 填充列表（详情参见dynamicFloatPanel函数）
     */
    initFloatPanel: function (floatGrid, list) {
        floatGrid.empty();
        var overview = [];
        for (var i=0; i<list.length; i++) {
            overview.push("<label id='"+ list[i].col +"' style='font-size:12px;'></label>");
        }
        floatGrid.append(overview.join("<br>"));
    },
    /**
     * 将填充对象中相应的属性值按填充列表填充
     * 填充列表表项形如{
     * col:??,  填充对应的DOM-id
     * value:[??], 填充对象的属性值
     * name:??,
     * unit:[??],
     * type:Util.??,
     * default:??
     * }
     *
     * @param list 填充列表
     * @param obj 填充对象
     */
    dynamicFloatPanel: function(list, obj) {
        list.forEach(function (elem) {
            var content = elem.name? elem.name : "";
            var defaultValue = elem.default? elem.default: "";
            var split = elem.split? elem.split : "";
            var type = elem.type? elem.type : Util.STRING;
            var cache = [];
            for (var i=0; i<elem.value.length; i++) {
                var meta = Util.format(obj[elem.value[i]], type);
                var unit = elem.unit[i]? elem.unit[i] : "";
                if (meta) {
                    cache.push(meta + unit);
                } else {
                    cache.push(defaultValue);
                }
            }
            content += cache.join(split);
            $("#" + elem.col).text(content);
        });
    },
    /**
     * 16进制字符串转10进制数组
     *
     * @param str 16进制字符串
     * @return {*}
     */
    hexToArrays: function (str)
    {
        var pos = 0;
        var len = str.length;
        if(len %2 != 0)
            return null;
        len /= 2;
        var hexA = new Array();
        for(var i=0; i<len; i++)
        {
            var s = str.substr(pos, 2);
            var v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
        return hexA;
    },
    /**
     * 控制特殊显示用于展示的数据条目(kendo 专用)
     *
     * 当index未传入时清空所有列表的展示条目
     * @param divId DivId号
     * @param index 控制序号(选填)
     */
    controlItem: function (divId, index) {
        if (divId) {
            var pathGrid = $("#" + divId).data("kendoGrid");
            if (index != undefined && index >= 0) {
                pathGrid.select("tr:eq(" + index + ")");
            } else {
                pathGrid.clearSelection();
                pathGrid.refresh();
            }
        }
    }
};

/**
 * 触发器
 *
 * @param callback 回调函数
 * @constructor dsy 20170829
 */
var Timer = function(callback) {
    this._callback = callback; // 回调函数
    this._interval = null; // 触发器实体
    this._speed = null; // 调用速度
    this._params = null; // 参数
    this._count = 0; // 调用次数
    this._cast = false; // 播放状态
    this._chipResult = null; // 回调函数返回值序列
};

/**
 * 触发器函数
 *
 * @type {{params, params, state, start: Timer.start, stop: Timer.stop}}
 */
Timer.prototype = {
    /**
     * 获得运行参数
     *
     * @return {null|*}
     */
    get params() {
        return this._params;
    },
    /**
     * 设置运行参数
     *
     * @param yourParams
     */
    set params(yourParams) {
        this._params = yourParams;
    },
    /**
     * 获得运行状态
     *
     * @return {{speed: (null|*), callback: *, params: (*|null), count: number, cast: boolean}}
     */
    get state() {
        return {
            speed: this._speed,
            callback: this._callback,
            params: this._params,
            count: this._count,
            cast: this._cast,
            chipResult: this._chipResult
        }
    },
    /**
     * 触发器启动
     *
     * @param speed 调用速度
     */
    start: function (speed) {
        if (speed)
            this._speed = speed;
        else if (this._cast) {
            console.log("timer have started.");
            return;
        } else {
            console.log("speed can't be void.");
            return;
        }
        if (this._callback) {
            var self = this;
            this._cast = true;
            this._interval = setInterval(function() {
                self._chipResult = self._callback(self);
                self._count++;
            }, speed);
        } else {
            console.error("function can't be void.");
        }

    },
    /**
     * 触发器停止
     */
    stop: function () {
        if (this._cast) {
            clearInterval(this._interval);
            this._cast = false;
        }
    }
};

/**
 * 矩阵
 *
 * @param arrays 数组
 * @constructor dsy
 */
var Matrix = function (arrays) {
    this._row = 0;
    this._col = 0;
    this._matrix = null;
    this.mat = arrays;
}

Matrix.common = {
    create: function (row, col) {
        var chips = new Array();
        for (var i = 0; i < row; i++) {
            var chip = new Array();
            for (var j = 0; j < col; j++) {
                chip.push(undefined);
            }
            chips.push(chip);
        }
        return new Matrix(chips);
    }
}

Matrix.prototype = {
    get row() {return this._row;},
    get col() {return this._col;},
    get mat() {return this._matrix;},
    set mat(arrays) {
        if (arrays && arrays instanceof Array) {
            this._row = arrays.length;
            var col = arrays[0].length;
            for (var i=1; i<arrays.length; i++) {
                if (!col || col != arrays[i].length) {
                    console.error("this arrays isn't a matrix.");
                }
                col = arrays[i].length;
            }
            this._col = col;
            this._matrix = arrays;
        } else {
            console.error("arrays is invalid.");
        }
    },
    /**
     * 矩阵相乘
     *
     * @param matrix 矩阵
     * @return {Matrix}
     */
    mul: function (matrix) {
        var chips = new Array();
        if (this.col != matrix.row) {
            console.log("matrix1'col must equal to matrix2'row!");
            return null;
        }
        for (var i=0; i<this.row; i++) {
            var chip = new Array();
            for (var k=0; k<matrix.col; k++) {
                var sum = 0;
                for (var j=0; j<matrix.row; j++) {
                    sum += this.mat[i][j] * matrix.mat[j][k];
                }
                chip.push(sum);
            }
            chips.push(chip);
        }
        return new Matrix(chips);
    },
    /**
     * 矩阵相减
     *
     * @param matrix 矩阵
     * @return {Matrix}
     */
    sub: function (matrix) {
        if (this.row != matrix.row || this.col != matrix.col) {
            console.error("row and col must be equal.");
            return null;
        }
        var chips = new Array();
        for (var i=0; i<this.row; i++) {
            var chip = new Array();
            for (var j=0; j<this.col; j++) {
                chip.push(this.mat[i][j] - matrix.mat[i][j]);
            }
            chips.push(chip);
        }
        return new Matrix(chips);
    },
    /**
     * 矩阵相加
     *
     * @param matrix 矩阵
     * @return {Matrix}
     */
    add: function (matrix) {
        if (this.row != matrix.row || this.col != matrix.col) {
            console.error("row and col must be equal.");
            return null;
        }
        var chips = new Array();
        for (var i=0; i<this.row; i++) {
            var chip = new Array();
            for (var j=0; j<this.col; j++) {
                chip.push(this.mat[i][j] + matrix.mat[i][j]);
            }
            chips.push(chip);
        }
        return new Matrix(chips);
    },
    /**
     * 矩阵转置
     *
     * @return {Matrix}
     */
    transpose: function () {
        var chips = new Array();
        for (var i=0; i<this.col; i++) {
            var chip = new Array();
            for (var j=0; j<this.row; j++) {
                chip.push(this.mat[j][i]);
            }
            chips.push(chip);
        }
        return new Matrix(chips);
    },
    mod: function()
    {
        if(this.row == 1)
            return this.mat[0][0];
        var ans = 0;
        var temp = Matrix.common.create(this.row - 1, this.row - 1);
        for(var i=0;i<this.row;i++)
        {
            for(var j=0;j<this.row-1;j++)
            {
                for(var k=0;k<this.row-1;k++)
                {
                    temp.mat[j][k] = this.mat[j+1][(k>=i)? k+1 : k];
                }
            }
            var t = temp.mod();
            if(i%2==0)
            {
                ans += this.mat[0][i]*t;
            }
            else
            {
                ans -=  this.mat[0][i]*t;
            }
        }
        return ans;
    },
    /**
     * 矩阵的伴随
     *
     * @return {*}
     */
    adJoint: function()
    {
        if (this.row != this.col) {
            console.error("matrix can't calculate AStart.");
            return;
        }
        if(this.row == 1)
            return this.mat[0][0];
        var ans = Matrix.common.create(this.row, this.row);
        var temp = Matrix.common.create(this.row - 1, this.row - 1);
        for(var i=0; i<this.row; i++)
        {
            for(var j=0;j<this.row;j++)
            {
                for(var k=0;k<this.row-1;k++)
                {
                    for(var t=0;t<this.row-1;t++)
                    {
                        temp.mat[k][t] = this.mat[k>=i?k+1:k][t>=j?t+1:t];
                    }
                }
                ans.mat[j][i]  =  temp.mod();
                if((i+j)%2 == 1)
                {
                    ans.mat[j][i] = - ans.mat[j][i];
                }
            }
        }
        return ans;
    },
    /**
     * 矩阵求逆
     *
     * @return {*}
     */
    inverse: function () {
        if (this.row != this.col) {
            console.error("matrix can't calculate AStart.");
            return;
        }
        var value=this.mod();
        var chips = null;
        if(value==0)
        {
            console.log("matrix's mod is zero.");
            return chips;
        } else {
            chips = this.adJoint();
            for(var i=0;i<this.row;i++)
            {
                for(var j=0;j<this.row;j++)
                {
                    chips.mat[i][j]=chips.mat[i][j]/value;
                }
            }
        }
        return chips;
    }
}