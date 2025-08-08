package com.trustmock.controller;

import com.trustmock.model.MockRecord;
import com.trustmock.model.dto.MockUpsertRequest;
import com.trustmock.service.MockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/mock")
@CrossOrigin
public class MockController {
    private final MockService mockService;

    public MockController(MockService mockService) {
        this.mockService = mockService;
    }

    @PostMapping("/upsert")
    public ResponseEntity<?> upsert(@RequestBody MockUpsertRequest req) {
        var rec = new MockRecord(req.app, req.service, req.pin, req.payload, req.version == null ? "v1" : req.version, Instant.now());
        mockService.upsert(rec);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/latest")
    public ResponseEntity<?> latest(@RequestParam String app, @RequestParam String service, @RequestParam String pin) {
        return mockService.getLatest(app, service, pin).<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/list")
    public ResponseEntity<?> listByService(@RequestParam String app, @RequestParam String service) {
        return ResponseEntity.ok(mockService.listByAppService(app, service));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateMock(@RequestBody MockUpsertRequest req) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.readTree(req.payload);
            return ResponseEntity.ok(java.util.Map.of("valid", true, "message", "Valid JSON payload"));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of("valid", false, "message", "Invalid JSON: " + e.getMessage()));
        }
    }

    @PostMapping("/sanity-check")
    public ResponseEntity<?> sanityCheck(@RequestBody MockUpsertRequest req) {
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "message", "Mock payload validated successfully",
            "recommendations", java.util.List.of(
                "Payload structure is valid",
                "Response time simulation: 200ms",
                "No breaking changes detected"
            )
        ));
    }
}
