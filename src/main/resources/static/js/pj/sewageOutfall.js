/**
 * Created by seky on 2017/8/12.
 * 排污口环境监测
 */
//初始化函数
$(function () {
    var sewageOutfall = allSeaFunction();
    //加载地图
   sewageOutfall.initSecMap("surVailMap",121.8,31.0883,-1);
    //获取左侧菜单的数据
    sewageOutfall.getSiderbar("seaOutfallJson","seaOutfallStation");//加载页面左侧菜单以及默认显示的数据
    //map 和 kendo grid 上下分层
    $("#nav_content").kendoSplitter({
        orientation: "vertical",
        panes: [ { size: "35%" },{size:"65%"}]
    });
    //点击表格、线图、柱图等按钮，添加背景颜色，反之去掉背景颜色
    $('#toolBar li').click(function (e) {
        var dataTypeId = e.target.id;//选择展示的数据类型的id  表格、线图等
        e.preventDefault();
        $(this).addClass("toolbar_selected");
        $(this).siblings().removeClass("toolbar_selected");
        sewageOutfall.ChangeDataExpress(dataTypeId);//改变展示的数据类型
    })
});