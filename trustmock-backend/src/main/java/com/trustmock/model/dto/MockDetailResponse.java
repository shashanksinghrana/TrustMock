package com.trustmock.model.dto;
import java.time.Instant;
public class MockDetailResponse {
    public String app, service, pin, payload, version;
    public Instant updatedAt;
    public MockDetailResponse(String app, String service, String pin, String payload, String version, Instant updatedAt) {
        this.app = app; this.service = service; this.pin = pin; this.payload = payload; this.version = version; this.updatedAt = updatedAt;
    }
}