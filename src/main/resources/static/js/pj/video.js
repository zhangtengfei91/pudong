/**
 * Created by DELL on 2017/8/16.
 */

$("#picList li").click(function () {
    //$(this).siblings('li').removeClass('selected');
        $(this).toggleClass('selected');
})
$("#loading-exe").click(function () {
    window.open("/img/video/cmsocx.exe")
})
$("#videoSubmit").click(function () {
    var list=[];
    var videoLst=[];
    list=document.getElementsByClassName("vList");
    for(var i=0;i<list.length;i++){
        if(list[i].className=="vList selected"){
            videoLst.unshift(list[i].attributes[2].value);
        }
    }
    var videoS = videoLst.join("|");
    if (videoLst.length<1){
        alert("请选择视频监控区域！")
    }else if (videoLst.length > 9) {
        videoCnt = "4";
    }
    else if (videoLst.length > 4 && videoLst.length <= 9) {
        videoCnt = "5";
    }
    else if (videoLst.length > 1 && videoLst.length <= 4) {
        videoCnt = "2";
    }
    else { videoCnt = "1"; }

    drawVideo(videoS);
    $("#videoList").siblings("li").removeClass("vList selected");
})




function drawVideo(a) {
    //document.getElementById("videoDiv").innerHTML = "";
    var url = "http://31.16.10.103:8087/cas/remoteLogin?username=admin&password=afdd0b4ad2ec172c586e2150770fbf9e&service=http%3A%2F%2F31.16.10.103%2Fvas%2Fweb%2FpreviewCtrl.action%3FcameraIndexCodes%3D" + a + "%26wndNum%3D" + videoCnt + "%26previewType%3D1";
    //var url = "/pj/videoSurvaillance/"+a+"/"+videoCnt;
    //var addItem = "<iframe id='themeiframe' src=\"" + url + "\" style='height:99%;width:99%;'></iframe> ";
    //$('#videoDiv').append(addItem);
    window.open(url);

}