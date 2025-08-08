package com.trustmock.model;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.util.Map;

public class MockResponse {
    private String id;
    private String appName;
    private String serviceName;
    private String endpoint;
    private String method;
    private int statusCode;
    private Map<String, String> headers;
    private JsonNode responseBody;
    private String timestamp;

    public MockResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getAppName() { return appName; }
    public void setAppName(String appName) { this.appName = appName; }
    
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    
    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }
    
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    
    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }
    
    public Map<String, String> getHeaders() { return headers; }
    public void setHeaders(Map<String, String> headers) { this.headers = headers; }
    
    public JsonNode getResponseBody() { return responseBody; }
    public void setResponseBody(JsonNode responseBody) { this.responseBody = responseBody; }
    
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}