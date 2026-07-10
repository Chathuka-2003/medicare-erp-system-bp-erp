CREATE TABLE departments (
                             id           UUID PRIMARY KEY,
                             name         VARCHAR(150) NOT NULL,
                             description  VARCHAR(500),
                             created_at   TIMESTAMP NOT NULL,
                             updated_at   TIMESTAMP
);

CREATE TABLE specializations (
                                 id           UUID PRIMARY KEY,
                                 name         VARCHAR(150) NOT NULL,
                                 description  VARCHAR(500),
                                 created_at   TIMESTAMP NOT NULL,
                                 updated_at   TIMESTAMP
);

CREATE TABLE doctors (
                         id                 UUID PRIMARY KEY,
                         first_name         VARCHAR(100) NOT NULL,
                         last_name          VARCHAR(100),
                         license_number     VARCHAR(50) UNIQUE,
                         email              VARCHAR(150),
                         phone              VARCHAR(20),
                         department_id      UUID REFERENCES departments(id) ON DELETE SET NULL,
                         specialization_id  UUID REFERENCES specializations(id) ON DELETE SET NULL,
                         created_at         TIMESTAMP NOT NULL,
                         updated_at         TIMESTAMP
);

CREATE TABLE staff (
                       id               UUID PRIMARY KEY,
                       first_name       VARCHAR(100) NOT NULL,
                       last_name        VARCHAR(100),
                       email            VARCHAR(150) UNIQUE,
                       phone            VARCHAR(20),
                       employee_number  VARCHAR(50) UNIQUE,
                       password         VARCHAR(255) NOT NULL,
                       role             VARCHAR(30) NOT NULL,
                       active           BOOLEAN NOT NULL DEFAULT TRUE,
                       department_id    UUID REFERENCES departments(id) ON DELETE SET NULL,
                       doctor_id        UUID REFERENCES doctors(id) ON DELETE SET NULL,
                       created_at       TIMESTAMP NOT NULL,
                       updated_at       TIMESTAMP
);

-- Now that doctors exists, wire up the deferred FKs from V2
ALTER TABLE appointments
    ADD CONSTRAINT fk_appointments_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL;

ALTER TABLE doctor_schedule
    ADD CONSTRAINT fk_doctor_schedule_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE;

CREATE INDEX idx_doctors_department_id ON doctors(department_id);
CREATE INDEX idx_doctors_specialization_id ON doctors(specialization_id);
CREATE INDEX idx_staff_department_id ON staff(department_id);
CREATE INDEX idx_staff_doctor_id ON staff(doctor_id);
CREATE INDEX idx_staff_email ON staff(email);