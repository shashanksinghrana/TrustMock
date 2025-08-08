package com.trustmock.service;
import com.trustmock.model.MockRecord;
import com.trustmock.repository.MockRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service public class MockService {
    private final MockRepository repo;
    public MockService(MockRepository repo){ this.repo=repo; }
    public void upsert(MockRecord r){ repo.upsert(r); }
    public Optional<MockRecord> getLatest(String app,String service,String pin){ return repo.findLatest(app,service,pin); }
    public java.util.List<MockRecord> listByAppService(String app, String service){ return repo.listByAppService(app, service); }
}
