package com.vamsi.controller;

import java.io.IOException;
import java.io.PrintWriter;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class HomeController 
{
	@GetMapping("/")
	public ResponseEntity<String> HomeController()
	{
		return new ResponseEntity<String>("welcome to our whatsapp api using spring boot",HttpStatus.OK);
	}
	@GetMapping("/red")
	public String getme()
	{
		return "heoow";
	}
}
