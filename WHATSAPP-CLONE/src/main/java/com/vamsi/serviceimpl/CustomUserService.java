package com.vamsi.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vamsi.model.User;
import com.vamsi.repository.UserRepository;

@Service
public class CustomUserService implements UserDetailsService
{
	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email);
		if(user == null)
		{
			throw new UsernameNotFoundException("User not found with username");
		}
		List<GrantedAuthority> authorities = new ArrayList<>();
//		 List<GrantedAuthority> authorities = user.getFull_name().stream()
//	                .map(role -> new SimpleGrantedAuthority(role.getName()))
//	                .collect(Collectors.toList());
		return new org.springframework.security.core.userdetails.User(user.getEmail(),user.getPassword(),authorities);
	}
	
}
