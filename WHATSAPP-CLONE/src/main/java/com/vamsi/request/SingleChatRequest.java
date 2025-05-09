package com.vamsi.request;



public class SingleChatRequest 
{
	private Integer userId;
	public SingleChatRequest() {
	}
	public SingleChatRequest(Integer id) {
		super();
		this.userId  = id;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
}
