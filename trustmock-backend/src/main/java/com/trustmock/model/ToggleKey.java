package com.trustmock.model;
import java.util.Objects;
public class ToggleKey {
    private final String app, service;
    public ToggleKey(String app, String service){ this.app=app; this.service=service; }
    public String app(){ return app; } public String service(){ return service; }
    @Override public boolean equals(Object o){ if(this==o) return true; if(!(o instanceof ToggleKey tk)) return false; return Objects.equals(app, tk.app)&&Objects.equals(service, tk.service); }
    @Override public int hashCode(){ return Objects.hash(app, service); }
}
