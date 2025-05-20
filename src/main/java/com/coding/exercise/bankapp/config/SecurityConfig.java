package com.coding.exercise.bankapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Spring security configuration
 * This configuration allows all requests to all endpoints
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        // Allow all requests without authentication
        httpSecurity
            .authorizeRequests()
                .antMatchers("/**").permitAll()
            .and()
            .formLogin().disable()
            .httpBasic().disable();

        // Disable CSRF protection
        httpSecurity.csrf().disable();
        
        // Allow frames for H2 console
        httpSecurity.headers().frameOptions().disable();
    }
}
