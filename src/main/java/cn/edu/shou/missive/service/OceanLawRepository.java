package cn.edu.shou.missive.service;
import cn.edu.shou.missive.domain.OceanLaw;
import cn.edu.shou.missive.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import java.util.List;
/**
 * Created by DELL on 2017/8/21.
 */
public interface OceanLawRepository extends PagingAndSortingRepository<OceanLaw,Long>{
    public List<OceanLaw>findAll();
    @Query("select OceanLaw from OceanLaw OceanLaw")
    public Page<OceanLaw> getOceanLaw(Pageable pageable);

}
