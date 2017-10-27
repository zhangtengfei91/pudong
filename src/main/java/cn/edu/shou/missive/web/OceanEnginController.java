package cn.edu.shou.missive.web;
import cn.edu.shou.missive.domain.OceanEngin;
import cn.edu.shou.missive.service.OceanEnginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.text.SimpleDateFormat;
import java.util.Map;

/**
 * Created by DELL on 2017/8/21.
 */
@Controller
@RequestMapping(value = "")
public class OceanEnginController {
    @Autowired
    OceanEnginRepository enginRepository;
    @Autowired
    JdbcTemplate jdbcTemplate;
    @RequestMapping(value = "/pj/oceanEngin/{pageNum}/{keyWord}")
    public String getOcean(Model model,@PathVariable String pageNum,@PathVariable String keyWord){
        if (keyWord.equals("all")){
            getOceanEnginList(model, Integer.parseInt(pageNum));
        }else {
            getOceanEnginList2(model,Integer.parseInt(pageNum),keyWord);
        }

        return "oceanEngin";
    }

    @RequestMapping(value = "/pj/test")
    public String getOcean2(Model model){
        List<OceanEngin>oceanEnginList=enginRepository.findAll();
        model.addAttribute("oceanEngin",oceanEnginList);
        return "test";
    }

    @RequestMapping(value = "/pj/oceanEnginData/{oceanEnginId}")
    public String getOceanEngin(Model model,@PathVariable String oceanEnginId){
        long oceanEnginId2=Long.parseLong(oceanEnginId);
        OceanEngin oceanEngin=enginRepository.findOne(oceanEnginId2);
        model.addAttribute("oceanEngin",oceanEngin);
        return "oceanEnginData";
    }

    public List<OceanEngin>getOceanEnginList(Model model,Integer pageNum) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        int pageSize = 15;//显示数目
        List<OceanEngin>oceanEnginList=new ArrayList<OceanEngin>();
        List<OceanEngin>oceanEnginList2=new ArrayList<OceanEngin>();
        Page<OceanEngin> oceanEnginPage = enginRepository.getOceanEngin(new PageRequest((pageNum - 1), pageSize));
        oceanEnginList=oceanEnginPage.getContent();
        String sql="SELECT * FROM `ocean_engin` ORDER BY RAND() limit 15";
        List<Map<String,Object>>rows=jdbcTemplate.queryForList(sql,new Object[]{});

        int taskIngPagesNum=oceanEnginPage.getTotalPages()==0?1:oceanEnginPage.getTotalPages();//总页数
        model.addAttribute("taskIngTotalNum",taskIngPagesNum);
        model.addAttribute("LookPage",pageNum);
        model.addAttribute("oceanEnginList", rows);
        return oceanEnginList;
    }
    public List<OceanEngin>getOceanEnginList2(Model model,Integer pageNum,String keyWord){

        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        int pageSize = 15;//显示数目
        List<OceanEngin>oceanEnginList=new ArrayList<OceanEngin>();
        List<OceanEngin>oceanEnginList2=new ArrayList<OceanEngin>();
        Page<OceanEngin> oceanEnginPage = enginRepository.getOceanEngin(new PageRequest((pageNum - 1), pageSize));
        oceanEnginList=oceanEnginPage.getContent();
        //sql ="SELECT * FROM metro_cen_certificate WHERE "+keyWords+" like ?";
        String sql="select * from pj.ocean_engin where ocean_engin.title like ?";
        List<Map<String,Object>>rows=jdbcTemplate.queryForList(sql,new Object[]{"%"+keyWord+"%"});

        int taskIngPagesNum=oceanEnginPage.getTotalPages()==0?1:oceanEnginPage.getTotalPages();//总页数
        model.addAttribute("taskIngTotalNum",taskIngPagesNum);
        model.addAttribute("LookPage",pageNum);
        model.addAttribute("oceanEnginList", rows);
        return oceanEnginList;
    }

}
