package com.alwxkxk.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Autowired
	private Environment env;

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		// 添加跨域请求的配置
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				// System.out.println(env.getProperty("client.url"));
				registry.addMapping("/**").allowedOrigins(env.getProperty("client.url"));
			}
		};
	}

}
