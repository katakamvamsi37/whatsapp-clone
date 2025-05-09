package com.vamsi.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.vamsi.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vamsi.exception.ChatException;
import com.vamsi.exception.MessageException;
import com.vamsi.exception.UserException;
import com.vamsi.model.Chat;
import com.vamsi.model.Message;
import com.vamsi.model.User;
import com.vamsi.repository.MessageRepository;
import com.vamsi.request.SendMessageRequest;
import com.vamsi.service.ChatService;
import com.vamsi.service.MessageService;
import com.vamsi.service.UserService;


@Service
public class MessageServiceImpl implements MessageService
{
	@Autowired
	private MessageRepository messageRepository;
	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	private UserService userService;
	@Autowired
	private ChatService chatService;
	@Override
	public Message sendMessage(SendMessageRequest req) throws UserException, ChatException {
		User user = userService.findUserById(req.getUserId());
		Chat chat = chatService.findChatById(req.getChatId());
		System.out.println(chat.toString());
		
		Message message = new Message();
		message.setChat(chat);
		message.setUser(user);
		message.setContent(req.getContent());
		message.setTimestamp(LocalDateTime.now());
		messageRepository.save(message);
		return message;
	}

	@Override
	public List<Message> getChatMessages(Integer chatId,User reqUser) throws ChatException, UserException {
		Chat chat = chatService.findChatById(chatId);
		
		if(!chat.getUsers().contains(reqUser)) {
			throw new UserException("you are not related to this chat"+chat.getId());
		}

        return messageRepository.findByChatId(chat.getId());
	}

	@Override
	public Message findMessageById(Integer messageId) throws MessageException {
		Message opt = messageRepository.findById(messageId).get();
		if(opt!=null) {
			return opt;
		}
		throw new MessageException("message not found with id"+messageId);
		
		
	}

	@Override
	public void deleteMessage(Integer messageId,User reqUser) throws MessageException, UserException {
		
		Message message = findMessageById(messageId);
		if(message.getUser().getId().equals(reqUser.getId()))
		{
			messageRepository.deleteById(message.getId());
			return ;
		}
		throw new UserException("you can't delete another user's message" + reqUser.getId());

	}

}
