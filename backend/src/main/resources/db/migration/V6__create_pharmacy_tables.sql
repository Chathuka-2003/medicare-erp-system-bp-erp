CREATE TABLE medicines (
                           id              UUID PRIMARY KEY,
                           medicine_code   VARCHAR(30) NOT NULL UNIQUE,
                           medicine_name   VARCHAR(150) NOT NULL,
                           generic_name    VARCHAR(150),
                           manufacturer    VARCHAR(150),
                           category        VARCHAR(30),
                           dosage_form     VARCHAR(50),
                           strength        VARCHAR(50),
                           unit_price      NUMERIC(10,2),
                           created_at      TIMESTAMP NOT NULL,
                           updated_at      TIMESTAMP
);

CREATE TABLE medicine_stock (
                                id                  UUID PRIMARY KEY,
                                medicine_id         UUID REFERENCES medicines(id) ON DELETE CASCADE,
                                batch_number        VARCHAR(50) NOT NULL,
                                quantity_in_stock   INTEGER,
                                reorder_level       INTEGER,
                                manufacture_date    DATE,
                                expiry_date         DATE,
                                storage_location    VARCHAR(150),
                                created_at          TIMESTAMP NOT NULL,
                                updated_at          TIMESTAMP
);

CREATE TABLE drug_dispense (
                               id                UUID PRIMARY KEY,
                               dispense_number   VARCHAR(30) NOT NULL UNIQUE,
                               dispense_date     TIMESTAMP,
                               remarks           VARCHAR(500),
                               patient_id        UUID REFERENCES patients(id) ON DELETE CASCADE,
                               prescription_id   UUID UNIQUE REFERENCES prescriptions(id) ON DELETE SET NULL,
                               dispensed_by      UUID REFERENCES staff(id) ON DELETE SET NULL,
                               created_at        TIMESTAMP NOT NULL,
                               updated_at        TIMESTAMP
);

CREATE TABLE drug_dispense_items (
                                     id                UUID PRIMARY KEY,
                                     drug_dispense_id  UUID REFERENCES drug_dispense(id) ON DELETE CASCADE,
                                     medicine_id       UUID REFERENCES medicines(id) ON DELETE RESTRICT,
                                     quantity          INTEGER,
                                     dosage            VARCHAR(100),
                                     instructions      VARCHAR(500),
                                     created_at        TIMESTAMP NOT NULL,
                                     updated_at        TIMESTAMP
);

CREATE INDEX idx_medicine_stock_medicine_id ON medicine_stock(medicine_id);
CREATE INDEX idx_medicine_stock_expiry_date ON medicine_stock(expiry_date);
CREATE INDEX idx_drug_dispense_patient_id ON drug_dispense(patient_id);
CREATE INDEX idx_drug_dispense_items_drug_dispense_id ON drug_dispense_items(drug_dispense_id);
CREATE INDEX idx_drug_dispense_items_medicine_id ON drug_dispense_items(medicine_id);