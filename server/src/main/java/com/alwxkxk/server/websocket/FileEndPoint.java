package com.alwxkxk.server.websocket;

import com.alwxkxk.server.entity.WebsocketFileHandler;
import org.springframework.stereotype.Component;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;

@ServerEndpoint("/file")
@Component
public class FileEndPoint {
    private final HashMap<String, WebsocketFileHandler> fileHandlerMap;

    public FileEndPoint() {
        fileHandlerMap = new HashMap<>();
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("ws 连接成功");
        WebsocketFileHandler fileHandler = new WebsocketFileHandler(session);
        fileHandlerMap.put(session.getId(), fileHandler);

    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        // TODO:有些异常关闭需要记录到日志中
        if(reason.getReasonPhrase() != null){
            System.out.println("ws 异常关闭：" + reason);
        }
        System.out.println("ws 连接关闭");
        String id = session.getId();
        fileHandlerMap.get(id).onClose();
        fileHandlerMap.remove(id);
    }
}
