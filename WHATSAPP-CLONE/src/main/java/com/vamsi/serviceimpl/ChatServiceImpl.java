package com.vamsi.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.vamsi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vamsi.exception.ChatException;
import com.vamsi.exception.UserException;
import com.vamsi.model.Chat;
import com.vamsi.model.User;
import com.vamsi.repository.ChatRepository;
import com.vamsi.service.ChatService;
import com.vamsi.service.GroupChatRequest;
import com.vamsi.service.UserService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatServiceImpl implements ChatService
{
	@Autowired
	private ChatRepository chatRepository;
	@Autowired
	private UserService userService;
	private UserRepository userRepository;

	@Override
	public Chat createChat(User reqUser, Integer userId2) throws UserException {

	    User user = userService.findUserById(userId2);

	    // Optional: Check if a chat already exists between these two users
	    Chat isChatExist = chatRepository.findSingleChatByUserId(user, reqUser);
	    if (isChatExist != null) {
	        return isChatExist;
	    }

	    Chat chat = new Chat();
	    chat.setChat_name("Private Chat"); // Optional default name
	    chat.setGroup(false);
	    chat.setCreatedBy(reqUser);

	    chat.getUsers().add(reqUser);
	    chat.getUsers().add(user);
	    chat.getAdmins().add(reqUser);
	    
	    chat.setMessages(new ArrayList<>()); // 🔐 prevent null messages list

	    return chatRepository.save(chat);
	}

	@Override
	public Chat findChatById(Integer chatId) throws ChatException {
		Chat chat =  chatRepository.findChatById(chatId);
		System.out.println(chat);
		if(chat != null)
		{
			return chat;
		}
		throw new ChatException("Chat not found with id"+ chat.getId());
	}

	@Override
	public List<Chat> findAllChatByUserId(Integer userId) throws UserException {
		User user = userService.findUserById(userId);
		
		List<Chat> chats = chatRepository.findChatsByUserId(user.getId());
		
		return chats;
	}

	@Override
	public Chat createGroup(GroupChatRequest req, User reqUser) throws UserException {
		Chat group = new Chat();
		group.setGroup(true);
		group.setChat_image(req.getChat_image());
		group.setChat_name(req.getChat_name());
		group.getAdmins().add(reqUser);
		group.setCreatedBy(reqUser);
		for(Integer userId:req.getUserIds())
		{
			User user = userService.findUserById(userId);
			group.getUsers().add(user);
		}
		return chatRepository.save(group);

	}

	@Override
	public Chat addUserToGroup(Integer userId, Integer chatId,User requser) throws UserException, ChatException {
		Optional<Chat> opt = chatRepository.findById(chatId);
		User user = userService.findUserById(userId);
		
		if(opt.isPresent())
		{
			Chat chat = opt.get();
			if(chat.getAdmins().contains(requser))
			{
				chat.getUsers().add(user);
				return chatRepository.save(chat);
			}else {
				throw new UserException("you are not admin");
			}
			
		}
		
		throw new ChatException("chat not found with id"+chatId);
	}

	@Override
	public Chat renameGroup(Integer ChatId, String groupName, User reqUser) throws ChatException, UserException {
		Optional<Chat> opt = chatRepository.findById(ChatId);
		if(opt.isPresent())
		{
			Chat chat = opt.get();
			if(chat.getUsers().contains(reqUser))
			{
				chat.setChat_name(groupName);
				return chatRepository.save(chat);
			}
			throw new UserException("You are not memeber of this group");
			
		}
		throw new ChatException("chat not found with id"+ ChatId);
	}


	@Override
	public Chat removeFromGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException {
		Optional<Chat> opt = chatRepository.findById(chatId);
		User user = userService.findUserById(userId);
		
		if(opt.isPresent())
		{
			Chat chat = opt.get();
			if(chat.getAdmins().contains(reqUser))
			{
				chat.getUsers().remove(user);
				return chatRepository.save(chat);
			}
			else if(chat.getUsers().contains(reqUser))
			{
				if(user.getId().equals(reqUser.getId()))
				{
					chat.getUsers().remove(user);
					return chatRepository.save(chat);
				}
			}
			
			throw new UserException("You can't remove another user");
			
			
		}
		throw new ChatException("chat not found with id "+chatId);
	}

	@Override
	public void deleteChat(Integer chatId, Integer userid) throws ChatException, UserException {
		Optional<Chat> opt = chatRepository.findById(chatId);
		if(opt.isPresent())
		{
			Chat chat = opt.get();
			chatRepository.deleteChatById(chat.getId());
		}
	}

}
