package com.trustmock.repository;

import com.trustmock.model.MockRecord;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.Instant;
import java.util.Optional;



public class OracleMockRepository implements MockRepository {

    private final DataSource ds;

    public OracleMockRepository(DataSource ds) {
        this.ds = ds;
    }

    @Override
    public void upsert(MockRecord r) {
        String sql = "MERGE INTO TRUSTMOCK_RESP T USING dual ON (T.APP=? AND T.SERVICE=? AND T.PIN=? AND T.VERSION=?) "
                + "WHEN MATCHED THEN UPDATE SET T.PAYLOAD=?, T.UPDATED_AT=SYSTIMESTAMP "
                + "WHEN NOT MATCHED THEN INSERT (APP,SERVICE,PIN,VERSION,PAYLOAD,UPDATED_AT) "
                + "VALUES (?,?,?,?,?,SYSTIMESTAMP)";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, r.getApp());
            ps.setString(2, r.getService());
            ps.setString(3, r.getPin());
            ps.setString(4, r.getVersion() == null ? "v1" : r.getVersion());
            ps.setString(5, r.getPayload());
            ps.setString(6, r.getApp());
            ps.setString(7, r.getService());
            ps.setString(8, r.getPin());
            ps.setString(9, r.getVersion() == null ? "v1" : r.getVersion());
            ps.setString(10, r.getPayload());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<MockRecord> findLatest(String app, String service, String pin) {
        String sql = "SELECT APP,SERVICE,PIN,VERSION,PAYLOAD,UPDATED_AT FROM TRUSTMOCK_RESP "
                + "WHERE APP=? AND SERVICE=? AND PIN=? ORDER BY UPDATED_AT DESC FETCH FIRST 1 ROWS ONLY";
        try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, app);
            ps.setString(2, service);
            ps.setString(3, pin);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                MockRecord r = new MockRecord();
                r.setApp(rs.getString("APP"));
                r.setService(rs.getString("SERVICE"));
                r.setPin(rs.getString("PIN"));
                r.setVersion(rs.getString("VERSION"));
                r.setPayload(rs.getString("PAYLOAD"));
                Timestamp ts = rs.getTimestamp("UPDATED_AT");
                r.setUpdatedAt(ts != null ? ts.toInstant() : Instant.now());
                return Optional.of(r);
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public java.util.List<MockRecord> listByAppService(String app, String service) {
        return java.util.List.of();
    }

    @Override
    public int countDistinctPins() {
        return 0;
    }

    @Override
    public int countActiveMocks() {
        return 0;
    }

    @Override
    public int countServices() {
        return 0;
    }
}
