CREATE TABLE IF NOT EXISTS resumes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,              
    title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
    file_name VARCHAR(255) NOT NULL,            
    file_path VARCHAR(500) NOT NULL,             
    file_type ENUM('pdf', 'docx') NOT NULL,         
    file_size INT NOT NULL,              
    parsed_text LONGTEXT NULL,                   
    is_parsed BOOLEAN NOT NULL DEFAULT FALSE, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),

    CONSTRAINT fk_resumes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);