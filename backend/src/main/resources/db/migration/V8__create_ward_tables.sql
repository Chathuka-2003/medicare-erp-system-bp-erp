CREATE TABLE wards (
                       id              UUID PRIMARY KEY,
                       ward_code       VARCHAR(30) NOT NULL UNIQUE,
                       ward_name       VARCHAR(150) NOT NULL,
                       ward_type       VARCHAR(30),
                       total_beds      INTEGER,
                       available_beds  INTEGER,
                       floor           VARCHAR(20),
                       description     VARCHAR(500),
                       created_at      TIMESTAMP NOT NULL,
                       updated_at      TIMESTAMP
);

CREATE TABLE beds (
                      id           UUID PRIMARY KEY,
                      bed_number   VARCHAR(30) NOT NULL,
                      status       VARCHAR(30),
                      room_number  VARCHAR(30),
                      ward_id      UUID REFERENCES wards(id) ON DELETE CASCADE,
                      created_at   TIMESTAMP NOT NULL,
                      updated_at   TIMESTAMP
);

CREATE TABLE admissions (
                            id                 UUID PRIMARY KEY,
                            admission_number   VARCHAR(30) NOT NULL UNIQUE,
                            admission_date     TIMESTAMP,
                            discharge_date     TIMESTAMP,
                            diagnosis          VARCHAR(500),
                            remarks            VARCHAR(500),
                            patient_id         UUID REFERENCES patients(id) ON DELETE CASCADE,
                            doctor_id          UUID REFERENCES doctors(id) ON DELETE SET NULL,
                            bed_id             UUID UNIQUE REFERENCES beds(id) ON DELETE SET NULL,
                            created_at         TIMESTAMP NOT NULL,
                            updated_at         TIMESTAMP
);

CREATE INDEX idx_beds_ward_id ON beds(ward_id);
CREATE INDEX idx_admissions_patient_id ON admissions(patient_id);
CREATE INDEX idx_admissions_discharge_date ON admissions(discharge_date);