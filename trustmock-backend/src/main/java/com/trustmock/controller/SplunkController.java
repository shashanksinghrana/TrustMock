package com.trustmock.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/splunk")
@CrossOrigin
public class SplunkController {
    
    @GetMapping("/failed-services")
    public ResponseEntity<?> getFailedServices() {
        // Mock data - replace with actual Splunk API integration
        List<Map<String, Object>> failedServices = Arrays.asList(
            Map.of(
                "app", "PaymentsApp",
                "service", "TransactionService", 
                "endpoint", "/api/transactions",
                "status", 500,
                "lastFailure", Instant.now().minusSeconds(300).toString(),
                "errorCount", 15,
                "mockAvailable", true,
                "mockEnabled", false,
                "errorMessage", "Internal Server Error - Database connection timeout"
            ),
            Map.of(
                "app", "UserApp",
                "service", "AuthService",
                "endpoint", "/api/auth/login",
                "status", 503,
                "lastFailure", Instant.now().minusSeconds(120).toString(),
                "errorCount", 8,
                "mockAvailable", true,
                "mockEnabled", false,
                "errorMessage", "Service Unavailable - Authentication service down"
            ),
            Map.of(
                "app", "NotificationApp",
                "service", "EmailService",
                "endpoint", "/api/notifications/email",
                "status", 404,
                "lastFailure", Instant.now().minusSeconds(600).toString(),
                "errorCount", 3,
                "mockAvailable", false,
                "mockEnabled", false,
                "errorMessage", "Not Found - Email service endpoint not available"
            ),
            Map.of(
                "app", "PaymentsApp",
                "service", "CardService",
                "endpoint", "/api/cards/validate",
                "status", 502,
                "lastFailure", Instant.now().minusSeconds(180).toString(),
                "errorCount", 12,
                "mockAvailable", true,
                "mockEnabled", false,
                "errorMessage", "Bad Gateway - Upstream card validation service error"
            ),
            Map.of(
                "app", "ReportsApp",
                "service", "AnalyticsService",
                "endpoint", "/api/reports/generate",
                "status", 408,
                "lastFailure", Instant.now().minusSeconds(450).toString(),
                "errorCount", 6,
                "mockAvailable", true,
                "mockEnabled", false,
                "errorMessage", "Request Timeout - Report generation taking too long"
            )
        );
        
        return ResponseEntity.ok(Map.of(
            "services", failedServices,
            "totalFailures", failedServices.size(),
            "lastUpdated", Instant.now().toString()
        ));
    }
}