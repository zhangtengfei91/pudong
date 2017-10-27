package cn.edu.shou.missive.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by sqhe on 14-7-7.
 */
@Controller
@RequestMapping(value="")
//@SessionAttributes(value = {"userbase64","user"})
public class IndexController {

    @RequestMapping(value = "/index")
    public String index(Model model){
        return "index";
    }
    @RequestMapping(value = "/pj/index2")
    public String indexHtml(Model model){
        return "index2";
    }

    @RequestMapping(value = "/pj/index3")
    public String indexHtml3(Model model){
        return "index3";
    }
    @RequestMapping(value = "/front")
    public String getGroupTree(Model model)
    {
        return "front";
    }
    @RequestMapping(value = "/login")
    public String getLogin(Model model){
        return "login";
    }
    //海水环境监测
    @RequestMapping(value = "/pj/seaSurvaillance")
    public String getSeaSurvail(Model model){
        return "seaSurvail";
    }

    //海水环境监测
    @RequestMapping(value = "/pj/seaSurvaillance/{videos}/{videoCnt}")
    public String getSeaSurvailFram(Model model, @PathVariable String videos,@PathVariable String videoCnt){
        model.addAttribute("videoS",videos);
        model.addAttribute("videoCnt",videoCnt);
        return "videoFream";
    }

    //海洋沉积物监测 20170826 lsl
    @RequestMapping(value = "/pj/seaSediment")
    public String getSeaSediement(Model model){
        return "seaSediment";
    }

    //海洋生物状况监测 20170826 lsl
    @RequestMapping(value = "/pj/seaBioCondi")
    public String getSeaBioCondi(Model model){
        return "seaBioCondi";
    }
    //海洋环境监测与预警 20170822 lsl
    @RequestMapping(value = "/pj/seaEnvirMoniWarn")
    public String getSeaEnvirMoniWarn(Model model){
        return "envirMoniWarn";
    }
    //排污口环境监测 20170816 lsl
    @RequestMapping(value = "/pj/sewageOutfall")
    public String getSewageOutfall(Model model){
        return "sewageOutfall";
    }
    //海水入侵环境监测 20170817 lsl
    @RequestMapping(value = "/pj/seawaterIntrusion")
    public String getSeawaterIntrusion(Model model){
        return "seawaterIntrusion";
    }
    //map服务登录 20170925 lsl
    @RequestMapping(value = "/pj/loginArcServer")
    public String getLoginArcServer(Model model){
        return "loginArcServer";
    }
    //无人机视频 xlz 20170815
    @RequestMapping(value = "/pj/vehicleVideos")
    public String getVehicleVideos(Model model){
        return "vehicleVideos";
    }

    //视频监控 xlz 20170815
    @RequestMapping(value = "/pj/videoSurvaillance")
    public String getVideoSurvail(Model model){
        return "videoSurvail";
    }
    //新闻内容列表
    @RequestMapping(value = "/pj/newsList")
    public String getNewsList(Model model){
        return "newsList";
    }
    //测试页面
    @RequestMapping(value="/pj/1")
    public String getTest(Model model){return "1";}
    //
    @RequestMapping(value = "/pj/arcgis_map")
    public String getArcgisMap(Model model){
        return "arcgis_map";
    }

    //新区法规
    @RequestMapping(value = "/pj/oceanLaw")
    public String getOceanLaw(Model model){
        return "oceanLaw";
    }

   //新闻、法律法规等数据后台管理配置
   @RequestMapping(value = "/pj/dataConfigure")
   public String getCData(Model model){
       return "dataConfigure";
   }



}
