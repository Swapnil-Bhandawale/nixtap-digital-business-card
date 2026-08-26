package com.nixtap.card.service.impl.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

@Component
public class ImageService {
    private final Cloudinary cloudinary;

    public ImageService(@Value("${cloudinary.cloud-name}") String cloudName,
                        @Value("${cloudinary.api-key}") String apiKey,
                        @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String uploadAndCompress(MultipartFile file) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        BufferedImage compressedImage = Scalr.resize(originalImage, Scalr.Method.QUALITY, 400);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(compressedImage, "jpg", baos);
        
        Map uploadResult = cloudinary.uploader().upload(baos.toByteArray(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("url");
    }
}
