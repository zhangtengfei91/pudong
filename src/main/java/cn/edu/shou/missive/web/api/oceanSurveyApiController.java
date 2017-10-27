package cn.edu.shou.missive.web.api;
import cn.edu.shou.missive.domain.OceanSurvey;
import cn.edu.shou.missive.domain.User;
import cn.edu.shou.missive.domain.missiveDataForm.OceanSurveyForm;
import cn.edu.shou.missive.service.OceanSurveyRepository;
import cn.edu.shou.missive.service.UserRepository;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;


@RestController
@RequestMapping(value = "/pj/api/oceanSurvey")
public class oceanSurveyApiController {
    @Autowired
    OceanSurveyRepository surveyRepository;
    @Autowired
    JdbcTemplate jdbcTemplate;


    @RequestMapping(value = "/getOceanSurveyData")
    public List<OceanSurvey> getOceanSurvey(){
        List<OceanSurvey> oceanSurveyList=new ArrayList<OceanSurvey>();
        oceanSurveyList=surveyRepository.findAll();
        return oceanSurveyList;
    }
    @RequestMapping(value = "/addOceanSurveyData",method = RequestMethod.POST)
    public boolean addOceanSurvey(OceanSurveyForm surveyForm){
        OceanSurvey oceanSurvey=null;
        Long surveyId=surveyForm.getId();
        if(surveyId>0){
            oceanSurvey=surveyRepository.findOne(surveyId);
        }
        if(oceanSurvey==null){
            oceanSurvey=new OceanSurvey();
            oceanSurvey.setCreatedDate(DateTime.now());
        }
        oceanSurvey.setTitle(surveyForm.getTitle());
        oceanSurvey.setIntroduction(surveyForm.getIntroduction());

//        oceanSurvey.setArea(surveyForm.getArea());
//        oceanSurvey.setDataurl(surveyForm.getDataurl());
//        oceanSurvey.setType(surveyForm.getType());
//        oceanSurvey.setDate(surveyForm.getDate());
//        oceanSurvey.setImgurl(surveyForm.getImgurl());
        surveyRepository.save(oceanSurvey);
        return true;
    }
    @RequestMapping(value = "/delOceanSurveyData/{oceanSurveyId}",method = RequestMethod.POST)
    public OceanSurvey delOceanSurvey(@PathVariable long oceanSurveyId){
        OceanSurvey oceanSurvey=surveyRepository.findOne(oceanSurveyId);
        surveyRepository.delete(oceanSurvey);
        return oceanSurvey;
    }

}