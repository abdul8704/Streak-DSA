CREATE TABLE verification_codes (
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type ENUM('signup','reset') NOT NULL,
    expires_at TIMESTAMP NOT NULL,

    PRIMARY KEY (email, type)
);
