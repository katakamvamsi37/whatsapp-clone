package com.vamsi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.vamsi.exception.ChatException;
import com.vamsi.exception.UserException;
import com.vamsi.model.Chat;
import com.vamsi.model.User;
import com.vamsi.request.SingleChatRequest;
import com.vamsi.response.ApiResponse;
import com.vamsi.service.ChatService;
import com.vamsi.service.GroupChatRequest;
import com.vamsi.service.UserService;
@RestController
@RequestMapping("/api/chats")
public class ChatController 
{
	@Autowired
	private ChatService chatService;
	@Autowired
	private UserService userService;
	@GetMapping("/api/chats")
	public String hello(){
		return "hello";
	}

	@PostMapping("/single")
	public ResponseEntity<Chat>createChatHandler(@RequestBody SingleChatRequest singleChatRequest,@RequestHeader("Authorization")String jwt) throws UserException
	{
		System.out.println(singleChatRequest.getUserId());
		User reqUser = userService.findUserProfile(jwt);
//		Integer id = Integer.parseInt(singleChatRequest.getUserId());
		Chat chat = chatService.createChat(reqUser,singleChatRequest.getUserId());
		
		System.out.println(chat.toString());
		
		return new ResponseEntity<Chat>(chat,HttpStatus.OK);
	}
	
	@PostMapping("/group")
	public ResponseEntity<Chat>createGroupHandler(@RequestBody GroupChatRequest req,@RequestHeader("Authorization")String jwt) throws UserException
	{
		User reqUser = userService.findUserProfile(jwt);
		
		Chat chat = chatService.createGroup(req, reqUser);
		
		return new ResponseEntity<Chat>(chat,HttpStatus.OK);
	}
	
	@GetMapping("/{chatId}")
	public ResponseEntity<Chat>findChatByIdHandler(@PathVariable Integer chatId,@RequestHeader("Authorization") String jwt) throws UserException,ChatException
	{
		Chat chat = chatService.findChatById(chatId);
		return new ResponseEntity<Chat>(chat,HttpStatus.OK);
	}
	
	@GetMapping("/user")
	public ResponseEntity<List<Chat>>findChatByUserIdHandler(@RequestHeader("Authorization")String jwt) throws UserException
	{
		User reqUser = userService.findUserProfile(jwt);
		
		List<Chat> chats = chatService.findAllChatByUserId(reqUser.getId());
		
		return new ResponseEntity<List<Chat>>(chats,HttpStatus.OK);
	}
	
	@PutMapping("/{chatId}/add/{userId}")
	public ResponseEntity<Chat>addUserToGroupHandler(@PathVariable Integer chatId,@PathVariable Integer userId, @RequestHeader("Authorization")String jwt) throws UserException, ChatException
	{
		User reqUser = userService.findUserProfile(jwt);
		
		Chat chat = chatService.addUserToGroup(userId, chatId, reqUser);
		
		return new ResponseEntity<Chat>(chat,HttpStatus.OK);
	}
	
	@PutMapping("/{chatId}/remove/{userId}")
	public ResponseEntity<Chat>removeUserFromGroupHandler(@PathVariable Integer chatId,@PathVariable Integer userId, @RequestHeader("Authorization")String jwt) throws UserException, ChatException
	{
		User reqUser = userService.findUserProfile(jwt);
		
		Chat chat = chatService.removeFromGroup(userId, chatId, reqUser);
		
		return new ResponseEntity<Chat>(chat,HttpStatus.OK);
	}
	
	@DeleteMapping("/delete/{chatId}")
	public ResponseEntity<ApiResponse>deleteChatHandler(@PathVariable Integer chatId, @RequestHeader("Authorization")String jwt) throws UserException, ChatException
	{
		User reqUser = userService.findUserProfile(jwt);
		
		chatService.deleteChat(chatId, reqUser.getId());
		
		ApiResponse res = new ApiResponse("Chat is deleted successfully",false);
		return new ResponseEntity<ApiResponse>(res,HttpStatus.OK);
	}
	
	
}
