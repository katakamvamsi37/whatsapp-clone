package com.vamsi.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import lombok.experimental.StandardException;

@ControllerAdvice
public class GlobalException 
{
	@ExceptionHandler(UserException.class)
	public ResponseEntity<ErrorDetail> UserExceptionHandler(UserException e,WebRequest req)
	{
		ErrorDetail err = new ErrorDetail(e.getMessage(),req.getDescription(false),LocalDateTime.now());
		return new ResponseEntity<ErrorDetail>(err,HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(MessageException.class)
	public ResponseEntity<ErrorDetail> MessageExceptionHandler(MessageException e,WebRequest req)
	{
		ErrorDetail err = new ErrorDetail(e.getMessage(),req.getDescription(false),LocalDateTime.now());
		return new ResponseEntity<ErrorDetail>(err,HttpStatus.BAD_REQUEST);
	}
	

	@ExceptionHandler(ChatException.class)
	public ResponseEntity<ErrorDetail> ChatExceptionHandler(ChatException ue,WebRequest req)
	{
		ErrorDetail err = new ErrorDetail(ue.getMessage(),req.getDescription(false),LocalDateTime.now());
		return new ResponseEntity<ErrorDetail>(err,HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorDetail> otherExceptionHandler(Exception e,WebRequest req)
	{
		ErrorDetail err = new ErrorDetail(e.getMessage(),req.getDescription(false),LocalDateTime.now());
		return new ResponseEntity<ErrorDetail>(err,HttpStatus.BAD_REQUEST);
	}

}
