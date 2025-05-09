package com.vamsi.service;

import java.util.List;

import com.vamsi.exception.ChatException;
import com.vamsi.exception.UserException;
import com.vamsi.model.Chat;
import com.vamsi.model.User;


public interface ChatService 
{
	public Chat createChat(User reqUser,Integer userId2) throws UserException;
	
	public Chat findChatById(Integer chatId) throws ChatException;
	
	public List<Chat> findAllChatByUserId(Integer userId) throws UserException;
	
	public Chat createGroup(GroupChatRequest req,User reqUser) throws UserException;
	
	public Chat addUserToGroup(Integer userId,Integer chatId,User reqUser) throws UserException,ChatException;
	
	public Chat renameGroup(Integer ChatId,String groupName,User reqUser) throws ChatException,UserException;
	
	public Chat removeFromGroup(Integer chatId,Integer userId,User reqUser) throws UserException,ChatException;
	
	public void deleteChat(Integer chatId,Integer userid) throws ChatException,UserException;
	
}
