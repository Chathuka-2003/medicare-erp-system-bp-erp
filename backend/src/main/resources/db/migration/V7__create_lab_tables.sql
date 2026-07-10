CREATE TABLE lab_tests (
                           id            UUID PRIMARY KEY,
                           test_code     VARCHAR(30) NOT NULL UNIQUE,
                           test_name     VARCHAR(150) NOT NULL,
                           category      VARCHAR(100),
                           description   VARCHAR(1000),
                           price         NUMERIC(10,2),
                           sample_type   VARCHAR(50),
                           normal_range  VARCHAR(150),
                           created_at    TIMESTAMP NOT NULL,
                           updated_at    TIMESTAMP
);

CREATE TABLE lab_orders (
                            id            UUID PRIMARY KEY,
                            order_number  VARCHAR(30) NOT NULL UNIQUE,
                            order_date    TIMESTAMP,
                            patient_id    UUID REFERENCES patients(id) ON DELETE CASCADE,
                            doctor_id     UUID REFERENCES doctors(id) ON DELETE SET NULL,
                            status        VARCHAR(30),
                            created_at    TIMESTAMP NOT NULL,
                            updated_at    TIMESTAMP
);

CREATE TABLE lab_order_items (
                                 id            UUID PRIMARY KEY,
                                 lab_order_id  UUID REFERENCES lab_orders(id) ON DELETE CASCADE,
                                 lab_test_id   UUID REFERENCES lab_tests(id) ON DELETE RESTRICT,
                                 created_at    TIMESTAMP NOT NULL,
                                 updated_at    TIMESTAMP
);

CREATE TABLE lab_results (
                             id                 UUID PRIMARY KEY,
                             lab_order_item_id  UUID UNIQUE REFERENCES lab_order_items(id) ON DELETE CASCADE,
                             result_value       VARCHAR(3000),
                             remarks            VARCHAR(500),
                             completed_date     TIMESTAMP,
                             verified_by        UUID REFERENCES staff(id) ON DELETE SET NULL,
                             created_at         TIMESTAMP NOT NULL,
                             updated_at         TIMESTAMP
);

CREATE INDEX idx_lab_orders_patient_id ON lab_orders(patient_id);
CREATE INDEX idx_lab_orders_doctor_id ON lab_orders(doctor_id);
CREATE INDEX idx_lab_order_items_lab_order_id ON lab_order_items(lab_order_id);
CREATE INDEX idx_lab_order_items_lab_test_id ON lab_order_items(lab_test_id);