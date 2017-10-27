package cn.edu.shou.missive.service;
import cn.edu.shou.missive.domain.OceanResour;
import cn.edu.shou.missive.domain.User;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.domain.Page;
/**
 * Created by DELL on 2017/8/21.
 */
public interface OceanResourRepository extends PagingAndSortingRepository<OceanResour,Long>{
    public List<OceanResour>findAll();
    @Query("select OceanResour from OceanResour OceanResour")
    public Page<OceanResour> getOceanResour(Pageable pageable);
}
