package com.trustmock.model.dto;
public class StatsResponse { public int totalServices; public int totalPins; public int activeMocks;
    public StatsResponse(int a,int b,int c){ this.totalServices=a; this.totalPins=b; this.activeMocks=c; } }
