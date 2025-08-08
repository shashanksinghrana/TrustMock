package com.trustmock.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trustmock.model.MockResponse;
import com.trustmock.model.MockRecord;
import com.trustmock.repository.MockRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Configuration
public class MockDataLoader {

    private final MockRepository mockRepository;

    @Value("${trustmock.mockdata.enabled:true}")
    private boolean loadSampleData;

    public MockDataLoader(MockRepository mockRepository) {
        this.mockRepository = mockRepository;
    }

    @PostConstruct
    public void loadData() {
        if (!loadSampleData) {
            return;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = getClass().getResourceAsStream("/mockdata/sample-mocks.json");
            if (inputStream == null) {
                System.out.println("⚠️ Sample mock data file not found, skipping data load.");
                return;
            }
            List<MockResponse> mockList = mapper.readValue(inputStream, new TypeReference<>() {});

            for (MockResponse response : mockList) {
                MockRecord record = new MockRecord(
                    response.getAppName(),
                    response.getServiceName(), 
                    response.getEndpoint(),
                    response.getResponseBody().toString(),
                    "v1",
                    Instant.now()
                );
                mockRepository.upsert(record);
            }

            System.out.println("✅ Sample mock data loaded.");
        } catch (Exception e) {
            System.err.println("❌ Failed to load sample mock data: " + e.getMessage());
        }
    }
}