package cn.edu.shou.missive.service;

import cn.edu.shou.missive.domain.Authorities;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by sqhe on 14-8-13.
 */
public interface AuthoritiesRepository extends PagingAndSortingRepository<Authorities,Long> {
}
