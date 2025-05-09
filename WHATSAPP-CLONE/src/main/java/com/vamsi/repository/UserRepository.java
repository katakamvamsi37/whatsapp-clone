package com.vamsi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vamsi.model.User;

@EnableJpaRepositories
public interface UserRepository extends JpaRepository<User, Integer>
{
	public User findByEmail(String email);
	
	@Query("select u from User u where u.full_name like %:query%")
	public List<User> searchUser(@Param("query") String query);
	
	
}
