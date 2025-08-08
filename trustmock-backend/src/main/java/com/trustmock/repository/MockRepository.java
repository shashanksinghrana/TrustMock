package com.trustmock.repository;

import com.trustmock.model.MockRecord;

import java.util.*;


public interface MockRepository {
    void upsert(MockRecord record);

    Optional<MockRecord> findLatest(String app, String service, String pin);

    java.util.List<MockRecord> listByAppService(String app, String service);

    int countDistinctPins();

    int countActiveMocks();

    int countServices();
}
