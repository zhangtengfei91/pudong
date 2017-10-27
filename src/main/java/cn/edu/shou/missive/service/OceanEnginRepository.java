package cn.edu.shou.missive.service;
import cn.edu.shou.missive.domain.OceanEngin;
import cn.edu.shou.missive.domain.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
/**
 * Created by DELL on 2017/8/21.
 */
public interface OceanEnginRepository extends PagingAndSortingRepository<OceanEngin,Long>{
    public List<OceanEngin>findAll();
    //根据用户ID获取该用户已分发的样品
    @Query("select OceanEngin from OceanEngin OceanEngin")
    public Page<OceanEngin> getOceanEngin(Pageable pageable);
//    @Query("SELECT OceanEngin FROM OceanEngin order by rand() limit 2")
//    public List<OceanEngin> getOceanEngin2();

}
