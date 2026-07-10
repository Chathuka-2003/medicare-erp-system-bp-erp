CREATE TABLE appointments (
                              id                 UUID PRIMARY KEY,
                              appointment_date   TIMESTAMP,
                              reason             VARCHAR(255),
                              notes              VARCHAR(1000),
                              status             VARCHAR(30),
                              patient_id         UUID REFERENCES patients(id) ON DELETE CASCADE,
                              doctor_id          UUID, -- FK to doctors added in V3 once that table exists
                              created_at         TIMESTAMP NOT NULL,
                              updated_at         TIMESTAMP
);

CREATE TABLE doctor_schedule (
                                 id          UUID PRIMARY KEY,
                                 day         VARCHAR(20),
                                 start_time  VARCHAR(10),
                                 end_time    VARCHAR(10),
                                 doctor_id   UUID, -- FK to doctors added in V3 once that table exists
                                 created_at  TIMESTAMP NOT NULL,
                                 updated_at  TIMESTAMP
);

CREATE TABLE time_slots (
                            id           UUID PRIMARY KEY,
                            start_time   VARCHAR(10),
                            end_time     VARCHAR(10),
                            available    BOOLEAN NOT NULL DEFAULT TRUE,
                            schedule_id  UUID REFERENCES doctor_schedule(id) ON DELETE CASCADE,
                            created_at   TIMESTAMP NOT NULL,
                            updated_at   TIMESTAMP
);

CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_doctor_schedule_doctor_id ON doctor_schedule(doctor_id);
CREATE INDEX idx_time_slots_schedule_id ON time_slots(schedule_id);