CREATE TABLE invoices (
                          id               UUID PRIMARY KEY,
                          invoice_number   VARCHAR(30) NOT NULL UNIQUE,
                          invoice_date     DATE,
                          due_date         DATE,
                          total_amount     NUMERIC(12,2),
                          paid_amount      NUMERIC(12,2),
                          balance_amount   NUMERIC(12,2),
                          status           VARCHAR(30),
                          patient_id       UUID REFERENCES patients(id) ON DELETE CASCADE,
                          appointment_id   UUID REFERENCES appointments(id) ON DELETE SET NULL,
                          created_at       TIMESTAMP NOT NULL,
                          updated_at       TIMESTAMP
);

CREATE TABLE invoice_items (
                               id           UUID PRIMARY KEY,
                               item_name    VARCHAR(150),
                               quantity     INTEGER,
                               unit_price   NUMERIC(12,2),
                               total_price  NUMERIC(12,2),
                               invoice_id   UUID REFERENCES invoices(id) ON DELETE CASCADE,
                               created_at   TIMESTAMP NOT NULL,
                               updated_at   TIMESTAMP
);

CREATE TABLE payments (
                          id                  UUID PRIMARY KEY,
                          payment_reference   VARCHAR(30) NOT NULL,
                          amount              NUMERIC(12,2),
                          payment_date        TIMESTAMP,
                          payment_method      VARCHAR(30),
                          remarks             VARCHAR(500),
                          invoice_id          UUID REFERENCES invoices(id) ON DELETE CASCADE,
                          created_at          TIMESTAMP NOT NULL,
                          updated_at          TIMESTAMP
);

CREATE TABLE insurance_claims (
                                  id                   UUID PRIMARY KEY,
                                  claim_number         VARCHAR(30) NOT NULL UNIQUE,
                                  insurance_provider   VARCHAR(150),
                                  claim_amount         NUMERIC(12,2),
                                  approved_amount      NUMERIC(12,2),
                                  claim_date           DATE,
                                  settlement_date      DATE,
                                  status               VARCHAR(30),
                                  patient_id           UUID REFERENCES patients(id) ON DELETE CASCADE,
                                  invoice_id           UUID UNIQUE REFERENCES invoices(id) ON DELETE SET NULL,
                                  created_at           TIMESTAMP NOT NULL,
                                  updated_at           TIMESTAMP
);

CREATE INDEX idx_invoices_patient_id ON invoices(patient_id);
CREATE INDEX idx_invoices_appointment_id ON invoices(appointment_id);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_insurance_claims_patient_id ON insurance_claims(patient_id);