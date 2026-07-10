CREATE TABLE saved_reports (
                               id                  UUID PRIMARY KEY,
                               report_name         VARCHAR(150) NOT NULL,
                               report_type         VARCHAR(30) NOT NULL,
                               report_parameters   VARCHAR(5000),
                               description         VARCHAR(1000),
                               file_name           VARCHAR(255),
                               file_path           VARCHAR(500),
                               file_format         VARCHAR(20),
                               generated_at        TIMESTAMP,
                               generated_by        UUID REFERENCES staff(id) ON DELETE SET NULL,
                               created_at          TIMESTAMP NOT NULL,
                               updated_at          TIMESTAMP
);

CREATE INDEX idx_saved_reports_report_type ON saved_reports(report_type);
CREATE INDEX idx_saved_reports_generated_by ON saved_reports(generated_by);