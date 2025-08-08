package com.trustmock.model;
import java.time.Instant;
public class MockRecord {
    private String app, service, pin, payload, version;
    private Instant updatedAt;
    public MockRecord(){}
    public MockRecord(String app,String service,String pin,String payload,String version,Instant updatedAt){
        this.app=app; this.service=service; this.pin=pin; this.payload=payload; this.version=version; this.updatedAt=updatedAt;
    }
    public String getApp(){ return app; } public void setApp(String v){ this.app=v; }
    public String getService(){ return service; } public void setService(String v){ this.service=v; }
    public String getPin(){ return pin; } public void setPin(String v){ this.pin=v; }
    public String getPayload(){ return payload; } public void setPayload(String v){ this.payload=v; }
    public String getVersion(){ return version; } public void setVersion(String v){ this.version=v; }
    public Instant getUpdatedAt(){ return updatedAt; } public void setUpdatedAt(Instant v){ this.updatedAt=v; }
}
