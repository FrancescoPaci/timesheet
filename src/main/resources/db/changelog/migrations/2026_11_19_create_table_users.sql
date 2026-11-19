-- liquibase formatted sql

-- changeset francesco:01-create-table-users
-- comment: Creation of the users database table

CREATE TABLE users
(
    id             BIGINT AUTO_INCREMENT,
    email          VARCHAR(40) NOT NULL,
    password       VARCHAR(75) NOT NULL,
    temporary_code INT CHECK (temporary_code >= 0 AND temporary_code <= 999999),
    active         BOOLEAN     NOT NULL DEFAULT 0,
    role           VARCHAR(10) NOT NULL,
    data_ins       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_mod       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_users_code UNIQUE (email)
);

-- rollback DROP TABLE users;