package com.vamsi.controller;

import java.util.HashSet;
import java.util.List;

import com.vamsi.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vamsi.model.User;
import com.vamsi.request.UpdateUserRequest;
import com.vamsi.response.ApiResponse;
import com.vamsi.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController 
{
	@Autowired
	private UserService userService;
	
	@GetMapping("/profile")
	public ResponseEntity<User> getUserprofileHandler(@RequestHeader("Authorization") String token) throws UserException {
//		token = token.substring(7);
		System.out.println("email"+token);
		User user = userService.findUserProfile(token);
		return new ResponseEntity<User>(user,HttpStatus.ACCEPTED);
	}
//	
	@GetMapping("/search")
	public ResponseEntity<List<User>> searchUserHandler(@RequestParam("query") String query){
		List<User> users = userService.searchuser(query);
		HashSet<User> set =  new HashSet<>(users);

//		HashSet<User> set2 = new HashSet<>(users);


		System.out.println(users);
		return new ResponseEntity<List<User>>(users,HttpStatus.OK);
	}
	
	@PutMapping("/update/{userId}")
	public ResponseEntity<ApiResponse> updateUserHandler(@RequestBody UpdateUserRequest req,@RequestHeader("Authorization") String token) throws UserException {
//		token = token.substring(7);
		User user = userService.findUserProfile(token);
		
		userService.updateUser(user.getId(), req);
		ApiResponse res = new ApiResponse("userUpdated successfully",true);
		return new ResponseEntity<ApiResponse>(res,HttpStatus.ACCEPTED);
	}
	
}
