package com.trustmock.controller;

import com.trustmock.model.dto.StatsResponse;
import com.trustmock.model.dto.ToggleRequest;
import com.trustmock.repository.MockRepository;
import com.trustmock.service.ToggleService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    private final ToggleService toggleService;
    private final MockRepository repo;

    public AdminController(ToggleService toggleService, MockRepository repo) {
        this.toggleService = toggleService;
        this.repo = repo;
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggle(@RequestBody ToggleRequest req) {
        toggleService.set(req.app, req.service, req.enabled);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public StatsResponse stats() {
        return new StatsResponse(repo.countServices(), repo.countDistinctPins(), repo.countActiveMocks());
    }
}
