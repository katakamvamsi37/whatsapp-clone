package com.vamsi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.vamsi.exception.ChatException;
import com.vamsi.exception.MessageException;
import com.vamsi.exception.UserException;
import com.vamsi.model.Message;
import com.vamsi.model.User;
import com.vamsi.request.SendMessageRequest;
import com.vamsi.response.ApiResponse;
import com.vamsi.service.MessageService;
import com.vamsi.service.UserService;

@RestController
@RequestMapping("/api/messages")
public class MessageController 
{
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private UserService userService;

	@PostMapping("/create")
	public ResponseEntity<Message>  sendMessageHandler(@RequestBody SendMessageRequest req,@RequestHeader("Authorization") String jwt) throws UserException, ChatException
	{
		User user = userService.findUserProfile(jwt);
		req.setUserId(user.getId());
		Message message = messageService.sendMessage(req);
		return new ResponseEntity<Message>(message,HttpStatus.OK);
	
	}
	
	@GetMapping("/chat/{chatId}")
	public ResponseEntity<List<Message>>  getChatsMessagesHandler(@PathVariable Integer chatId ,@RequestHeader("Authorization") String jwt) throws UserException, ChatException
	{
		User user = userService.findUserProfile(jwt);
		List<Message> messages = messageService.getChatMessages(chatId, user);
		return new ResponseEntity<List<Message>>(messages,HttpStatus.OK);
	
	}
	
	@DeleteMapping("/{messageId}")
	public ResponseEntity<ApiResponse>  deleteMessagesHandler(@PathVariable Integer messageId ,@RequestHeader("Authorization") String jwt) throws UserException, ChatException, MessageException
	{
		User user = userService.findUserProfile(jwt);
		messageService.deleteMessage(messageId, user);
		ApiResponse res = new ApiResponse("message deleted sucessfully", false);
		
		return new ResponseEntity<ApiResponse>(res,HttpStatus.OK);
	
	}
	
}
