/**
 * Created by seky on 17/9/3.
 */
$(".normal").click(function(){
    $.ajax({
        url: "test.html",
        context: document.body,
        success: function(){
        $(this).addClass("done");
    }});
})
$(document).ready(function() {
    $(".right2 li").mouseover(function () {
        this.style.border = "1px solid rgb(185, 184, 180)";
    })
    $(".right2 li").mouseout(function () {
        this.style.border = "none";
    })
})
$(document).ready(function() {
    $("#search").bind("keypress",function(event) {
        var keyWords = $(".search").val();
        window.location="/pj/oceanEngin/1/"+keyWords;
    })

})
