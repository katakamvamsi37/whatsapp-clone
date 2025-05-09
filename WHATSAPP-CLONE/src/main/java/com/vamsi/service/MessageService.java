package com.vamsi.service;

import java.util.List;

import com.vamsi.exception.ChatException;
import com.vamsi.exception.MessageException;
import com.vamsi.exception.UserException;
import com.vamsi.model.Message;
import com.vamsi.model.User;
import com.vamsi.request.SendMessageRequest;

public interface MessageService 
{
	public Message sendMessage(SendMessageRequest req) throws UserException,ChatException;
	
	public List<Message> getChatMessages(Integer chatId,User reqUser) throws ChatException, UserException;
	
	public Message findMessageById(Integer messageId) throws MessageException;
	
	public void deleteMessage(Integer messageId , User reqUser) throws MessageException, UserException;
	
	
}
