CREATE TABLE medical_records (
                                 id           UUID PRIMARY KEY,
                                 record_date  DATE,
                                 description  VARCHAR(1000),
                                 record_type  VARCHAR(30),
                                 patient_id   UUID REFERENCES patients(id) ON DELETE CASCADE,
                                 doctor_id    UUID REFERENCES doctors(id) ON DELETE SET NULL,
                                 created_at   TIMESTAMP NOT NULL,
                                 updated_at   TIMESTAMP
);

CREATE TABLE vitals (
                        id                 UUID PRIMARY KEY,
                        temperature        DOUBLE PRECISION,
                        heart_rate         INTEGER,
                        blood_pressure     INTEGER,
                        weight             DOUBLE PRECISION,
                        height             DOUBLE PRECISION,
                        medical_record_id  UUID UNIQUE REFERENCES medical_records(id) ON DELETE CASCADE,
                        created_at         TIMESTAMP NOT NULL,
                        updated_at         TIMESTAMP
);

CREATE TABLE diagnosis (
                           id                 UUID PRIMARY KEY,
                           diagnosis_name     VARCHAR(255),
                           description        VARCHAR(1000),
                           severity           VARCHAR(30),
                           medical_record_id  UUID REFERENCES medical_records(id) ON DELETE CASCADE,
                           created_at         TIMESTAMP NOT NULL,
                           updated_at         TIMESTAMP
);

CREATE TABLE prescriptions (
                               id                 UUID PRIMARY KEY,
                               notes              VARCHAR(1000),
                               medical_record_id  UUID UNIQUE REFERENCES medical_records(id) ON DELETE CASCADE,
                               created_at         TIMESTAMP NOT NULL,
                               updated_at         TIMESTAMP
);

CREATE TABLE prescription_items (
                                    id               UUID PRIMARY KEY,
                                    medicine_name    VARCHAR(150),
                                    dosage           VARCHAR(100),
                                    frequency        VARCHAR(100),
                                    duration         INTEGER,
                                    prescription_id  UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
                                    created_at       TIMESTAMP NOT NULL,
                                    updated_at       TIMESTAMP
);

CREATE TABLE allergies (
                           id             UUID PRIMARY KEY,
                           allergy_name   VARCHAR(150),
                           description    VARCHAR(500),
                           severity       VARCHAR(30),
                           patient_id     UUID REFERENCES patients(id) ON DELETE CASCADE,
                           created_at     TIMESTAMP NOT NULL,
                           updated_at     TIMESTAMP
);

CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX idx_diagnosis_medical_record_id ON diagnosis(medical_record_id);
CREATE INDEX idx_prescription_items_prescription_id ON prescription_items(prescription_id);
CREATE INDEX idx_allergies_patient_id ON allergies(patient_id);