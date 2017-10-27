package cn.edu.shou.missive.web;
import cn.edu.shou.missive.domain.OceanResour;
import cn.edu.shou.missive.service.OceanResourRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by DELL on 2017/8/26.
 */
@Controller
@RequestMapping(value = "")
public class OceanResourController {
    @Autowired
    OceanResourRepository resourRepository;
    @Autowired
    JdbcTemplate jdbcTemplate;
    @RequestMapping(value = "/pj/oceanResour/{pageNum}")
    public String getOcean(Model model,@PathVariable String pageNum){
        getOceanResourList(model, Integer.parseInt(pageNum));
        return "oceanResour";
    }

    @RequestMapping(value = "/pj/oceanResourData/{oceanResourId}")
    public String getOceanResour(Model model,@PathVariable String oceanResourId){
        long oceanResourId2=Long.parseLong(oceanResourId);
        OceanResour oceanResour=resourRepository.findOne(oceanResourId2);
        model.addAttribute("oceanResour",oceanResour);
        return "oceanResourData";
    }
    public List<OceanResour>getOceanResourList(Model model,Integer pageNum) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        int pageSize = 10;//显示数目
        List<OceanResour>oceanResourList=new ArrayList<OceanResour>();
        Page<OceanResour> oceanResourPage = resourRepository.getOceanResour(new PageRequest((pageNum - 1), pageSize));
        oceanResourList=oceanResourPage.getContent();
        OceanResour oceanResour=null;

        String sql="SELECT * FROM `ocean_resour` ORDER BY RAND() limit 15";
        List<Map<String,Object>>rows=jdbcTemplate.queryForList(sql,new Object[]{});

        int taskIngPagesNum=oceanResourPage.getTotalPages()==0?1:oceanResourPage.getTotalPages();//总页数
        model.addAttribute("taskIngTotalNum",taskIngPagesNum);
        model.addAttribute("LookPage",pageNum);
        model.addAttribute("oceanResourList", rows);
        return oceanResourList;
    }
}
