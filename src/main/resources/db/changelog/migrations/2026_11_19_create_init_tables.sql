-- liquibase formatted sql

-- changeset francesco:01-create-init-tables
-- comment: Creation of the initial database tables

CREATE TABLE project
(
    id          BIGINT AUTO_INCREMENT,
    code        VARCHAR(5)  NOT NULL,
    description VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_project_code UNIQUE (code)
);

INSERT INTO project (code, description) VALUES ('PRJ01', 'Portale E-Commerce B2B');
INSERT INTO project (code, description) VALUES ('CRM26', 'Migrazione CRM Cloud');
INSERT INTO project (code, description) VALUES ('ERP04', 'Integrazione Fatturazione Elettronica');
INSERT INTO project (code, description) VALUES ('APP02', 'App Mobile Clienti iOS e Android');
INSERT INTO project (code, description) VALUES ('SEC10', 'Audit Sicurezza e Adeguamento GDPR');
INSERT INTO project (code, description) VALUES ('BI007', 'Dashboard Analytics e Data Warehouse');
INSERT INTO project (code, description) VALUES ('INT01', 'Attivita Interna - Formazione e R&D');
INSERT INTO project (code, description) VALUES ('MNT09', 'Manutenzione Evolutiva Gestionale');
INSERT INTO project (code, description) VALUES ('API03', 'Sviluppo Microservizi Pagamenti');
INSERT INTO project (code, description) VALUES ('CLOUD', 'Refactoring Infrastruttura Kubernetes');


-- rollback DROP TABLE project;