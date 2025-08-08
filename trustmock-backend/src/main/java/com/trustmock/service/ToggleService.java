package com.trustmock.service;
import com.trustmock.model.ToggleKey;
import org.springframework.stereotype.Service;
import java.util.Map; import java.util.concurrent.ConcurrentHashMap;
@Service public class ToggleService {
    private final Map<ToggleKey, Boolean> toggles = new ConcurrentHashMap<>();
    public void set(String app,String service,boolean enabled){ toggles.put(new ToggleKey(app,service), enabled); }
    public boolean isEnabled(String app,String service){ return toggles.getOrDefault(new ToggleKey(app,service), false); }
    public Map<ToggleKey, Boolean> all(){ return toggles; }
}
