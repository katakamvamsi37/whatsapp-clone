package com.vamsi.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ErrorDetail 
{
	
	private String error;
	private String message;
	private LocalDateTime timeStamp;

}
