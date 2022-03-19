package com.alwxkxk.server.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import lombok.extern.slf4j.Slf4j;

import static com.alwxkxk.server.entity.CommonUtil.sizeString2Number;

@Slf4j
@Configuration
@EnableWebSocket
public class WebSocketConfig {
    @Autowired
    // 读取application properties的值
    private Environment env;

    @Bean
    public ServerEndpointExporter serverEndpoint() {
        return new ServerEndpointExporter();
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        //文件上限大小 读取properties里配置的值
        String maxSizeStr = env.getProperty("websocket.maxSize");
        Integer maxSizeNum = sizeString2Number(maxSizeStr);
        container.setMaxTextMessageBufferSize(maxSizeNum);
        container.setMaxBinaryMessageBufferSize(maxSizeNum);
        return container;
    }

}