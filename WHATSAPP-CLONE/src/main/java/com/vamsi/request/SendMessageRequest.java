package com.vamsi.request;

public class SendMessageRequest 
{
	private Integer userId;
	private Integer chatId;
	private String content;
	public SendMessageRequest(Integer userId, Integer chatId, String content) {
		super();
		this.userId = userId;
		this.chatId = chatId;
		this.content = content;
	}
	public SendMessageRequest() {
		super();
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Integer getChatId() {
		return chatId;
	}
	public void setChatId(Integer chatId) {
		this.chatId = chatId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
}
