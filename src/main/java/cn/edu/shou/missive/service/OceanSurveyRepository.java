package cn.edu.shou.missive.service;
import org.springframework.data.domain.Page;
import cn.edu.shou.missive.domain.OceanSurvey;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
/**
 * Created by DELL on 2017/8/21.
 */
public interface OceanSurveyRepository extends PagingAndSortingRepository<OceanSurvey,Long>{
    public List<OceanSurvey>findAll();
    @Query("select OceanSurvey from OceanSurvey OceanSurvey")
    public Page<OceanSurvey> getOceanSurvey(Pageable pageable);
}
