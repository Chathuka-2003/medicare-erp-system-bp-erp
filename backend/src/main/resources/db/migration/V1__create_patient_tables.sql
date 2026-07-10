CREATE TABLE patients (
                          id                  UUID PRIMARY KEY,
                          first_name          VARCHAR(100) NOT NULL,
                          patient_number      VARCHAR(30) NOT NULL UNIQUE,
                          last_name           VARCHAR(100),
                          date_of_birth       DATE,
                          gender              VARCHAR(20),
                          blood_group         VARCHAR(10),
                          nic                 VARCHAR(20),
                          email               VARCHAR(150),
                          phone               VARCHAR(20),
                          emergency_contact   VARCHAR(20),
                          created_at          TIMESTAMP NOT NULL,
                          updated_at          TIMESTAMP
);

CREATE TABLE patient_addresses (
                                   id           UUID PRIMARY KEY,
                                   street       VARCHAR(255),
                                   city         VARCHAR(100),
                                   district     VARCHAR(100),
                                   postal_code  VARCHAR(20),
                                   patient_id   UUID UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
                                   created_at   TIMESTAMP NOT NULL,
                                   updated_at   TIMESTAMP
);

CREATE TABLE patient_insurance (
                                   id              UUID PRIMARY KEY,
                                   provider_name   VARCHAR(150),
                                   policy_number   VARCHAR(100),
                                   coverage_type   VARCHAR(100),
                                   patient_id      UUID UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
                                   created_at      TIMESTAMP NOT NULL,
                                   updated_at      TIMESTAMP
);

CREATE TABLE next_of_kin (
                             id            UUID PRIMARY KEY,
                             name          VARCHAR(150),
                             relationship  VARCHAR(50),
                             phone         VARCHAR(20),
                             address       VARCHAR(255),
                             patient_id    UUID UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
                             created_at    TIMESTAMP NOT NULL,
                             updated_at    TIMESTAMP
);

CREATE TABLE patient_contacts (
                                  id             UUID PRIMARY KEY,
                                  contact_type   VARCHAR(50),
                                  contact_value  VARCHAR(150),
                                  patient_id     UUID REFERENCES patients(id) ON DELETE CASCADE,
                                  created_at     TIMESTAMP NOT NULL,
                                  updated_at     TIMESTAMP
);

CREATE INDEX idx_patients_nic ON patients(nic);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patient_contacts_patient_id ON patient_contacts(patient_id);