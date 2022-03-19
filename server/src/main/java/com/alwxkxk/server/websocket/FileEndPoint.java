package com.alwxkxk.server.websocket;

import com.alwxkxk.server.entity.WebsocketFileHandler;
import com.alwxkxk.server.service.StorageService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;

@Slf4j
@Data
@ServerEndpoint("/file")
@Component
public class FileEndPoint {
    private static StorageService storageService;
    private final HashMap<String, WebsocketFileHandler> fileHandlerMap;

    public FileEndPoint() {
        fileHandlerMap = new HashMap<>();
    }

    @Autowired
    public void setStorageService(StorageService storageService){
        this.storageService = storageService;
    }

    @OnOpen
    public void onOpen(Session session) {
        // BUG: 当一个网页开两个ws时会报ERROR org.apache.coyote.http11.Http11NioProtocol - Failed to complete processing of a request
        //java.lang.OutOfMemoryError: Java heap space
        // TODO: 添加 timeout 与ping pong心跳
        String id = session.getId();
        log.info("ws 连接成功 "+id);
        WebsocketFileHandler fileHandler = new WebsocketFileHandler(session, storageService);
        fileHandlerMap.put(id, fileHandler);
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        String id = session.getId();
        if (reason.getReasonPhrase() != null) {
            log.error("ws 异常关闭 "+id+":"+ reason);
        }else{
            log.info("ws 连接关闭 "+id);
        }
        fileHandlerMap.get(id).onClose();
        fileHandlerMap.remove(id);
    }
}
