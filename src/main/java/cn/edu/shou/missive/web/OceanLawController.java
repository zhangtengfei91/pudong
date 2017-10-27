package cn.edu.shou.missive.web;
import cn.edu.shou.missive.domain.OceanLaw;
import cn.edu.shou.missive.service.OceanLawRepository;
import org.springframework.jdbc.core.JdbcTemplate;
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
public class OceanLawController {
    @Autowired
    OceanLawRepository lawRepository;
    @Autowired
    JdbcTemplate jdbcTemplate;
    @RequestMapping(value = "/pj/oceanLaw/{pageNum}")
    public String getOcean(Model model,@PathVariable String pageNum){
        getOceanLawList(model, Integer.parseInt(pageNum));
        return "oceanLaw";
    }

    @RequestMapping(value = "/pj/oceanLawData/{oceanLawId}")
    public String getOceanLaw(Model model,@PathVariable String oceanLawId){
        long oceanLawId2=Long.parseLong(oceanLawId);
        OceanLaw oceanLaw=lawRepository.findOne(oceanLawId2);
        model.addAttribute("oceanLaw",oceanLaw);
        return "oceanLawData";
    }
    public List<OceanLaw>getOceanLawList(Model model,Integer pageNum) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        int pageSize = 10;//显示数目
        List<OceanLaw>oceanLawList=new ArrayList<OceanLaw>();
        Page<OceanLaw> oceanLawPage = lawRepository.getOceanLaw(new PageRequest((pageNum - 1), pageSize));
        oceanLawList=oceanLawPage.getContent();
        OceanLaw oceanLaw=null;

        String sql="SELECT * FROM `ocean_law` ORDER BY RAND() limit 15";
        List<Map<String,Object>>rows=jdbcTemplate.queryForList(sql,new Object[]{});

        int taskIngPagesNum=oceanLawPage.getTotalPages()==0?1:oceanLawPage.getTotalPages();//总页数
        model.addAttribute("taskIngTotalNum",taskIngPagesNum);
        model.addAttribute("LookPage",pageNum);
        model.addAttribute("oceanLawList", rows);
        return oceanLawList;
    }
}
