package com.trustmock.repository;

import com.trustmock.model.MockRecord;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
@Repository
@Primary
public class InMemoryMockRepository implements MockRepository {
    private final Map<String, List<MockRecord>> store = new ConcurrentHashMap<>();

    private String key(String app, String service, String pin) {
        return app + "|" + service + "|" + pin;
    }

    @Override
    public void upsert(MockRecord r) {
        r.setUpdatedAt(Instant.now());
        store.computeIfAbsent(key(r.getApp(), r.getService(), r.getPin()), k -> new ArrayList<>()).add(r);
    }

    @Override
    public Optional<MockRecord> findLatest(String app, String service, String pin) {
        var list = store.get(key(app, service, pin));
        if (list == null || list.isEmpty()) return Optional.empty();
        return Optional.of(list.get(list.size() - 1));
    }

    @Override
    public List<MockRecord> listByAppService(String app, String service) {
        List<MockRecord> out = new ArrayList<>();
        store.forEach((k, v) -> {
            var p = k.split("\\|");
            if (p.length >= 2 && p[0].equals(app) && p[1].equals(service)) out.addAll(v);
        });
        return out;
    }

    @Override
    public int countDistinctPins() {
        Set<String> pins = new HashSet<>();
        store.keySet().forEach(k -> {
            var p = k.split("\\|");
            if (p.length >= 3) pins.add(p[2]);
        });
        return pins.size();
    }

    @Override
    public int countActiveMocks() {
        return store.size();
    }

    @Override
    public int countServices() {
        Set<String> s = new HashSet<>();
        store.keySet().forEach(k -> {
            var p = k.split("\\|");
            if (p.length >= 2) s.add(p[1]);
        });
        return s.size();
    }
}
