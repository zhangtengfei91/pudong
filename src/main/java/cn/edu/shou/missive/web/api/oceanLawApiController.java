package cn.edu.shou.missive.web.api;
import cn.edu.shou.missive.domain.OceanLaw;
import cn.edu.shou.missive.domain.User;
import cn.edu.shou.missive.domain.missiveDataForm.OceanLawForm;
import cn.edu.shou.missive.service.OceanLawRepository;
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
@RequestMapping(value = "/pj/api/oceanLaw")
public class oceanLawApiController {
    @Autowired
    OceanLawRepository lawRepository;
    @Autowired
    JdbcTemplate jdbcTemplate;


    @RequestMapping(value = "/getOceanLawData")
    public List<OceanLaw> getOceanLaw() {
        List<OceanLaw> oceanLawList = new ArrayList<OceanLaw>();
        oceanLawList = lawRepository.findAll();
        return oceanLawList;
    }

    @RequestMapping(value = "/addOceanLawData", method = RequestMethod.POST)
    public boolean addOceanLaw(OceanLawForm lawForm) {
        OceanLaw oceanLaw = null;
        Long lawId = lawForm.getId();
        if (lawId > 0) {
            oceanLaw = lawRepository.findOne(lawId);
        }
        if (oceanLaw == null) {
            oceanLaw = new OceanLaw();
            oceanLaw.setCreatedDate(DateTime.now());
        }
        oceanLaw.setTitle(lawForm.getTitle());
        oceanLaw.setIntroduction(lawForm.getIntroduction());

//        oceanLaw.setArea(lawForm.getArea());
//        oceanLaw.setDataurl(lawForm.getDataurl());
//        oceanLaw.setType(lawForm.getType());
//        oceanLaw.setDate(lawForm.getDate());
//        oceanLaw.setImgurl(lawForm.getImgurl());
        lawRepository.save(oceanLaw);
        return true;
    }

    @RequestMapping(value = "/delOceanLawData/{oceanLawId}", method = RequestMethod.POST)
    public OceanLaw delOceanLaw(@PathVariable long oceanLawId) {
        OceanLaw oceanLaw = lawRepository.findOne(oceanLawId);
        lawRepository.delete(oceanLaw);
        return oceanLaw;
    }
}