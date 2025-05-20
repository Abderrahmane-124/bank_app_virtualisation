package com.coding.exercise.bankapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller to handle root URL requests and errors
 */
@Controller
public class RootController implements ErrorController {

    /**
     * Redirects root requests to the bank-api path
     */
    @GetMapping("/")
    public RedirectView redirectToApi() {
        return new RedirectView("/bank-api/");
    }
    
    /**
     * Bank API main endpoint - redirects to static index.html
     */
    @GetMapping("/bank-api/")
    public RedirectView bankApiIndex() {
        return new RedirectView("/index.html");
    }
    
    /**
     * Error handler - returns index.html on error
     */
    @RequestMapping("/error")
    @ResponseBody
    public RedirectView handleError() {
        return new RedirectView("/index.html");
    }

    @Override
    public String getErrorPath() {
        return "";
    }
}