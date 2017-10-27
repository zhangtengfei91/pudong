package cn.edu.shou.missive.web;
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

import cn.edu.shou.missive.domain.OceanSurvey;
import cn.edu.shou.missive.service.OceanSurveyRepository;
/**
 * Created by DELL on 2017/8/26.
 */
@Controller
@RequestMapping(value = "")
public class OceanSurveyController {
    @Autowired
    OceanSurveyRepository surveyRepository;
    @Autowired
    JdbcTemplate jdbcTemplate;
    @RequestMapping(value = "/pj/oceanSurvey/{pageNum}")
    public String getOcean(Model model,@PathVariable String pageNum){
        getOceanSurveyList(model, Integer.parseInt(pageNum));
        return "oceanSurvey";
    }

    @RequestMapping(value = "/pj/oceanSurveyData/{oceanSurveyId}")
    public String getOceanSurvey(Model model,@PathVariable String oceanSurveyId){
        long oceanSurveyId2=Long.parseLong(oceanSurveyId);
        OceanSurvey oceanSurvey=surveyRepository.findOne(oceanSurveyId2);
        model.addAttribute("oceanSurvey",oceanSurvey);
        return "oceanSurveyData";
    }
    public List<OceanSurvey>getOceanSurveyList(Model model,Integer pageNum) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        int pageSize = 10;//显示数目
        List<OceanSurvey>oceanSurveyList=new ArrayList<OceanSurvey>();
        Page<OceanSurvey> oceanSurveyPage = surveyRepository.getOceanSurvey(new PageRequest((pageNum - 1), pageSize));
        oceanSurveyList=oceanSurveyPage.getContent();
        OceanSurvey oceanSurvey=null;

        String sql="SELECT * FROM `ocean_survey` ORDER BY RAND() limit 15";
        List<Map<String,Object>>rows=jdbcTemplate.queryForList(sql,new Object[]{});

        int taskIngPagesNum=oceanSurveyPage.getTotalPages()==0?1:oceanSurveyPage.getTotalPages();//总页数
        model.addAttribute("taskIngTotalNum",taskIngPagesNum);
        model.addAttribute("LookPage",pageNum);
        model.addAttribute("oceanSurveyList", rows);
        return oceanSurveyList;
    }
}
