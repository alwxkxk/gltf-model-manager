package com.alwxkxk.server.entity;

import com.alwxkxk.server.service.StorageService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import javax.websocket.Session;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.alwxkxk.server.entity.CommonUtil.jsonToObject;
import static com.alwxkxk.server.entity.CommonUtil.objectToJson;


@Slf4j
@Data
/**
 * websocket file 处理对象
 * 上传文件，返回上传进度，处理进度，返回处理后的文件
 * 1. 前端与后端  建立 连接，后端先发送maxSize，告诉前端最大上传大小。(进入状态waitFileName)
 * 2. 前端上传文件名(进入状态waitFile)，文件数据(重新进入状态waitFileName)，等待前端发送下一个文件。
 * 3. 前端上传完毕后，发送上传结束消息(进入状态handleFiles)，后端开始处理文件。
 * 4. 处理完毕后，返回处理结果(进入状态responseResult)，及文件，前端重新加载显示。后端关闭ws连接。
 *
 * 后端最大超时时间为30s，前端每10s发送ping，后端返回pong。
 */ public class WebsocketFileHandler {
    // TODO:限制文件后缀名
    private final Session session;
    private final StorageService storageService;

    private String status;
    private ArrayList<String> statusList;


    private String uploadFileName;// 准备要上传的文件名


    public WebsocketFileHandler(Session session, StorageService storageService) {
        log.info("init");
        this.session = session;
        this.storageService = storageService;
        // TODO:statusList应该重构成 static，而不是每次初始化时赋值。
        this.statusList = new ArrayList<String>();
        this.statusList.add("waitFileName");
        this.statusList.add("waitFile");
        this.statusList.add("handleFiles");
        this.statusList.add("responseResult");

        setStatus("waitFileName");
        // 给session 添加 消息处理
        session.addMessageHandler(String.class, msg -> {
            textHandle(msg);

        });
        session.addMessageHandler(ByteBuffer.class, byteBuf -> {
            binaryHandle(byteBuf);
        });

        // 告诉前端 允许最大 尺寸
        sendText(maxSizeMessage());

    }

    public void setStatus(String status) {
        if (!this.statusList.contains(status)) {
            onErr(new Exception("不支持此状态，请检测代码。"));
        } else if (status == "waitFile" && this.status != "waitFileName") {
            // 进入waitFile之前必须是waitFileName，否则异常。
            onErr(new Exception("进入waitFile之前必须是waitFileName。"));
        } else {
            this.status = status;
//            log.info("status:" + status);
        }

    }

    private void setUploadFileName(String uploadFileName) {
        if (getStatus() != "waitFileName") {
            onErr(new Exception("必须是waitFileName状态才允许设置uploadFileName"));
        } else {
            this.uploadFileName = uploadFileName;
            setStatus("waitFile");
        }
    }

    public void sendText(String msg) {
        try {
            session.getBasicRemote().sendText(msg);
        } catch (Exception e) {
            onErr(e);
        }
    }

    public void sendBinary(ByteBuffer byteBuf) {
        try {
            session.getBasicRemote().sendBinary(byteBuf);
        } catch (Exception e) {
            onErr(e);
        }
    }

    public void textHandle(String message) {
        HashMap obj = jsonToObject(message);
//        log.info("WebsocketFileHandler textHandle:" + obj.toString());
        String type = (String) obj.get("type");
        switch (type) {
            case "fileName": {
                setUploadFileName((String) obj.get("value"));
                break;
            }
            default: {
                log.warn("don't support this type:" + type);
                break;
            }
        }
    }

    public void binaryHandle(ByteBuffer byteBuf) {
        if (getStatus() != "waitFile") {
            onErr(new Exception("必须是waitFile状态才允许处理二进制文件"));
        } else {
            try {
                String fileName = this.uploadFileName;
                storageService.store(fileName, byteBuf);
                sendText(receiveFileMessage(fileName));
                // 处理文件后重新进入waitFileName状态
                setStatus("waitFileName");
            } catch (Exception e) {
                onErr(e);
            }
        }


    }

    public void onErr(Exception e) {
        log.error(e.toString());
        this.onClose();
    }

    public void onClose() {
        // TODO:中断正在处理的文件
        log.info("onClose.");
    }

    //region:websocket message 响应JSON
    public String maxSizeMessage() {
        HashMap<String, Object> obj = new HashMap<String, Object>();
        obj.put("type", "maxSize");
        obj.put("value", session.getMaxBinaryMessageBufferSize());
        return objectToJson(obj);
    }

    public String receiveFileMessage(String fileName) {
        HashMap<String, Object> obj = new HashMap<String, Object>();
        obj.put("type", "receiveFile");
        obj.put("value", fileName);
        return objectToJson(obj);
    }
    //endregion
}
