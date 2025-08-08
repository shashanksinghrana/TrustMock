package com.trustmock.sidecar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;

//@SpringBootApplication
@RestController
public class SidecarProxyApplication {

    private final RestTemplate rt = new RestTemplate();

    public static void main(String[] args) {
        SpringApplication.run(SidecarProxyApplication.class, args);
    }

    @RequestMapping("/proxy/**")
    public ResponseEntity<String> proxy(HttpServletRequest req, @RequestBody(required = false) String body) {
        String targetPath = req.getRequestURI().replaceFirst("^/proxy", "");
        String targetUrl = "http://downstream:8080" + targetPath;
        String app = req.getHeader("X-App");
        String service = req.getHeader("X-Service");
        String pin = req.getHeader("X-PIN");
        String mock = req.getHeader("X-Mock");

        if ("true".equalsIgnoreCase(mock) && app != null && service != null && pin != null) {
            String trustMockApi = "http://localhost:8080/api/mock/latest?app="+app+"&service="+service+"&pin="+pin;
            try {
                ResponseEntity<String> mockRes = rt.getForEntity(trustMockApi, String.class);
                if (mockRes.getStatusCode().is2xxSuccessful()) return mockRes;
            } catch (Exception ignored) {}
        }

        HttpHeaders headers = new HttpHeaders();
        req.getHeaderNames().asIterator().forEachRemaining(h -> headers.add(h, req.getHeader(h)));
        HttpMethod method = HttpMethod.valueOf(req.getMethod());
        return rt.exchange(targetUrl, method, new HttpEntity<>(body, headers), String.class);
    }
}
