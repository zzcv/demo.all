package com.lingcaibao.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import com.lingcaibao.plugin.page.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.lingcaibao.entity.Permission;

@Repository("permissionDao")
public interface PermissionDao {

	Permission get(Long id);

	List<Permission> search(Map<String, Object> parameters);

	Page<Permission> searchPage(@Param("searchFields") Map<String, Object> searchParams, Page pageable);

	void insert(Permission permission);

	void delete(Long id);

	void update(Permission permission);

}
