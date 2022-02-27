package com.alwxkxk.server.websocket;

import org.springframework.stereotype.Component;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/echo")
@Component
/**
 *  websocket echo 测试代码
 */
public class EchoEndPoint {
    @OnOpen
    public void onOpen(Session session) {
        System.out.println("ws 连接成功");
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("ws 连接关闭");
    }

    @OnMessage
    public String onMsg(String text) throws IOException {
        return "server echo:" + text;
    }
}
