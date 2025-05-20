package com.coding.exercise.bankapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

/**
 * Web configuration that redirects root URL requests to the bank-api path
 * and ensures static resources are properly served
 */
@Configuration
public class WebConfig implements WebMvcConfigurer, ErrorPageRegistrar {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Add a redirect from the root URL to the bank-api path
        registry.addRedirectViewController("/", "/bank-api/");
        // Add a direct view to the index page
        registry.addViewController("/bank-api/").setViewName("forward:/index.html");
    }
    
    @Override
    public void registerErrorPages(ErrorPageRegistry registry) {
        // Handle 404 errors by redirecting to the bank-api path
        registry.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/bank-api/"));
        // Handle 403 errors by redirecting to the index
        registry.addErrorPages(new ErrorPage(HttpStatus.FORBIDDEN, "/index.html"));
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ensure static resources are properly served
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/public/")
                .setCachePeriod(0);
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow all CORS requests
        registry.addMapping("/**");
    }
} 