package cn.edu.shou.missive.web.api;
import cn.edu.shou.missive.domain.DisasterWarning;
import cn.edu.shou.missive.service.DisasterWaringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
/**
 * Created by DELL on 2017/8/15.
 */
@RestController
public class DisasterWarningApi {
    @Autowired
    private DisasterWaringRepository disasterWaringRepository;

}
