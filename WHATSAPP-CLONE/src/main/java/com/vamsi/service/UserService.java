package com.vamsi.service;

import java.util.List;

import com.vamsi.exception.UserException;
import com.vamsi.model.User;
import com.vamsi.request.UpdateUserRequest;
import org.springframework.stereotype.Service;


public interface UserService 
{
	public User findUserById(Integer id) throws UserException;
	public User findUserProfile(String jwt) throws UserException;
	public User updateUser(Integer userid,UpdateUserRequest req) throws UserException;
	public List<User> searchuser(String query);
}
