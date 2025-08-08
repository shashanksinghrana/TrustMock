package com.trustmock.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

//    @Bean
    public DataSource dataSource() {
        DataSourceProperties dataSourceProperties = new DataSourceProperties();
        dataSourceProperties.setUrl(dbUrl);
        dataSourceProperties.setUsername(dbUsername);
        dataSourceProperties.setPassword(dbPassword);
        dataSourceProperties.setDriverClassName(driverClassName);
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }
}