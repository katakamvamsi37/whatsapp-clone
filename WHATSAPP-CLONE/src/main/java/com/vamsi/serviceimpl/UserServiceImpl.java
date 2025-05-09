package com.vamsi.serviceimpl;

import java.util.List;
import java.util.Optional;

import com.vamsi.config.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.vamsi.exception.UserException;
import com.vamsi.model.User;
import com.vamsi.repository.UserRepository;
import com.vamsi.request.UpdateUserRequest;
import com.vamsi.service.UserService;

@Service
public class UserServiceImpl implements UserService
{
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private JwtProvider tokenProvider;

	@Override
	public User findUserById(Integer id) throws UserException {
		Optional<User> opt = userRepository.findById(id);
		if(opt.isPresent())
		{
			return opt.get();
		}
		throw new UserException("User Not Found with id "+id);
	}

	@Override
	public User findUserProfile(String jwt) throws UserException {
		String email = tokenProvider.getEmailFromJwtToken(jwt);
		if(email ==null)
		{
			throw new BadCredentialsException("recived invalid token...");
		}
		User user = userRepository.findByEmail(email);
		if(user == null)
		{
			throw new UserException("user not found with email"+email);
		}
		return user;
	}

	@Override
	public User updateUser(Integer userid, UpdateUserRequest req) throws UserException {
		User user = findUserById(userid);
		if(req.getFull_name() != null)
		{
			user.setFull_name(req.getFull_name());
		}
		if(req.getProfile_picture()!= null)
		{
			user.setProfile_picture(req.getProfile_picture());
		}
		
		return userRepository.save(user);
	}

	@Override
	public List<User> searchuser(String query) {
		List<User> users = userRepository.searchUser(query);
		if (users.isEmpty()) {
			System.out.println("No users found for query: " + query);
		}
		System.out.println(users);
		return users;
	}

}
