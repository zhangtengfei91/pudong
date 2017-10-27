package cn.edu.shou.missive.web.api;
import cn.edu.shou.missive.domain.OceanEngin;
import cn.edu.shou.missive.domain.User;
import cn.edu.shou.missive.domain.missiveDataForm.OceanEnginForm;
import cn.edu.shou.missive.service.OceanEnginRepository;
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
@RequestMapping(value = "/pj/api/oceanEngin")
public class oceanEnginApiController {
    @Autowired
    OceanEnginRepository enginRepository;
    @Autowired
    JdbcTemplate jdbcTemplate;


    @RequestMapping(value = "/getOceanEnginData")
    public List<OceanEngin> getOceanEngin(){
        List<OceanEngin> oceanEnginList=new ArrayList<OceanEngin>();
        oceanEnginList=enginRepository.findAll();
        return oceanEnginList;
    }
    @RequestMapping(value = "/addOceanEnginData",method = RequestMethod.POST)
    public boolean addOceanEngin(OceanEnginForm enginForm){
        OceanEngin oceanEngin=null;
        Long enginId=enginForm.getId();
        if(enginId>0){
            oceanEngin=enginRepository.findOne(enginId);
        }
        if(oceanEngin==null){
             oceanEngin=new OceanEngin();
            oceanEngin.setCreatedDate(DateTime.now());
        }
        oceanEngin.setTitle(enginForm.getTitle());
        oceanEngin.setIntroduction(enginForm.getIntroduction());

//        oceanEngin.setArea(enginForm.getArea());
//        oceanEngin.setDataurl(enginForm.getDataurl());
//        oceanEngin.setType(enginForm.getType());
//        oceanEngin.setDate(enginForm.getDate());
//        oceanEngin.setImgurl(enginForm.getImgurl());
        enginRepository.save(oceanEngin);
        return true;
    }
    @RequestMapping(value = "/delOceanEnginData/{oceanEnginId}",method = RequestMethod.POST)
    public OceanEngin delOceanEngin(@PathVariable long oceanEnginId){
        OceanEngin oceanEngin=enginRepository.findOne(oceanEnginId);
        enginRepository.delete(oceanEngin);
        return oceanEngin;
    }

}
