package com.alwxkxk.server.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import com.alwxkxk.server.entity.StorageFileNotFoundException;
import com.alwxkxk.server.service.StorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

// TODO:数据库查表存表
// TODO:做一个统一的返回接口

@RestController
@RequestMapping("/file")
public class FileController {

	private final StorageService storageService;

	@Autowired
	public FileController(StorageService storageService) {
		this.storageService = storageService;
	}

	@GetMapping("/list")
	public List<String> listUploadedFiles() throws IOException {
        return storageService.loadAll().map(
            path -> MvcUriComponentsBuilder.fromMethodName(FileController.class,
                    "serveFile", path.getFileName().toString()).build().toUri().toString())
            .collect(Collectors.toList());
	}

	@GetMapping("/{filename:.+}")
	@ResponseBody
	public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

		Resource file = storageService.loadAsResource(filename);
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + file.getFilename() + "\"").body(file);
	}

	@PostMapping("/")
	public String handleFileUpload(@RequestParam("file") MultipartFile file,
			RedirectAttributes redirectAttributes) {

		storageService.store(file);
		redirectAttributes.addFlashAttribute("message",
				"You successfully uploaded " + file.getOriginalFilename() + "!");
        return "上传成功";
	}

	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}

}