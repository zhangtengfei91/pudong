package cn.edu.shou.missive.service;
import cn.edu.shou.missive.domain.DisasterWarning;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
/**
 * Created by DELL on 2017/8/15.
 */
public interface DisasterWaringRepository extends PagingAndSortingRepository<DisasterWarning, Long>{
    //public List<DisasterWarning>findAll();
    public Page<DisasterWarning>findAll();
}
