CREATE TABLE suppliers (
                           id               UUID PRIMARY KEY,
                           supplier_name    VARCHAR(150) NOT NULL,
                           contact_person   VARCHAR(150),
                           phone            VARCHAR(20),
                           email            VARCHAR(150),
                           address          VARCHAR(255),
                           created_at       TIMESTAMP NOT NULL,
                           updated_at       TIMESTAMP
);

CREATE TABLE items (
                       id                  UUID PRIMARY KEY,
                       item_code           VARCHAR(30) NOT NULL UNIQUE,
                       item_name           VARCHAR(150) NOT NULL,
                       category            VARCHAR(30),
                       unit                VARCHAR(30),
                       quantity_in_stock   INTEGER,
                       reorder_level       INTEGER,
                       purchase_price      NUMERIC(12,2),
                       selling_price       NUMERIC(12,2),
                       storage_location    VARCHAR(150),
                       supplier_id         UUID REFERENCES suppliers(id) ON DELETE SET NULL,
                       created_at          TIMESTAMP NOT NULL,
                       updated_at          TIMESTAMP
);

CREATE TABLE purchase_orders (
                                 id                        UUID PRIMARY KEY,
                                 purchase_order_number     VARCHAR(30) NOT NULL UNIQUE,
                                 order_date                DATE,
                                 expected_delivery_date    DATE,
                                 status                    VARCHAR(30),
                                 supplier_id               UUID REFERENCES suppliers(id) ON DELETE SET NULL,
                                 created_at                TIMESTAMP NOT NULL,
                                 updated_at                TIMESTAMP
);

CREATE TABLE purchase_order_items (
                                      id                  UUID PRIMARY KEY,
                                      purchase_order_id   UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
                                      item_id             UUID REFERENCES items(id) ON DELETE RESTRICT,
                                      quantity            INTEGER,
                                      unit_price          NUMERIC(12,2),
                                      total_price         NUMERIC(12,2),
                                      created_at          TIMESTAMP NOT NULL,
                                      updated_at          TIMESTAMP
);

CREATE TABLE stock_movements (
                                 id                UUID PRIMARY KEY,
                                 item_id           UUID REFERENCES items(id) ON DELETE CASCADE,
                                 quantity          INTEGER,
                                 movement_type     VARCHAR(20),
                                 reference_number  VARCHAR(50),
                                 remarks           VARCHAR(500),
                                 movement_date     TIMESTAMP,
                                 created_at        TIMESTAMP NOT NULL,
                                 updated_at        TIMESTAMP
);

CREATE INDEX idx_items_supplier_id ON items(supplier_id);
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_order_items_purchase_order_id ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_purchase_order_items_item_id ON purchase_order_items(item_id);
CREATE INDEX idx_stock_movements_item_id ON stock_movements(item_id);