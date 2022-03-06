package com.alwxkxk.server.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.websocket.MessageHandler;
import javax.websocket.Session;
import java.io.IOException;
import java.nio.ByteBuffer;

/**
 * websocket file 处理对象
 * 上传文件，返回上传进度，处理进度，返回处理后的文件
 */
public class WebsocketFileHandler {
    private final Session session;

    public WebsocketFileHandler(Session session) {
        this.session = session;
        // 给session 添加 消息处理
        session.addMessageHandler(String.class, msg -> {
            textHandle(msg);

        });
        session.addMessageHandler(ByteBuffer.class, byteBuf -> {
            binaryHandle(byteBuf);
        });

        // 告诉前端 允许最大 尺寸
        // TODO: 文件上限大小 从properties 里读取
        sendText("{maxSize:100}");


    }

    public void sendText(String msg) {
        try {
            session.getBasicRemote().sendText(msg);
        } catch (Exception e) {
            onErr(e);
        }

    }

    public void textHandle(String message) {
        System.out.print("WebsocketFileHandler textHandle:" + message);
        try {
            session.getBasicRemote().sendText("file receive:"+message);
        } catch (Exception e) {
            onErr(e);
        }

    }

    public void binaryHandle(ByteBuffer byteBuf) {
        System.out.print("WebsocketFileHandler binaryHandle:" + byteBuf.toString());
        try {
            // TODO:返回处理进度消息以及处理后的文件
            session.getBasicRemote().sendBinary(byteBuf);
        } catch (Exception e) {
            onErr(e);
        }
    }

    public void onErr(Exception e) {
        System.out.print("WebsocketFileHandler onErr:" + e.toString());
    }

    public void onClose() {
        // TODO:中断正在处理的文件
        System.out.print("WebsocketFileHandler onClose.");
    }
}
