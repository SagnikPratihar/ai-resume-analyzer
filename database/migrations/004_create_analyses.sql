CREATE TABLE IF NOT EXISTS analyses (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    resume_id INT NOT NULL,
    job_description_id  INT NULL,         
    ats_score DECIMAL(5,2) NULL,        
    keyword_score DECIMAL(5,2) NULL,
    format_score DECIMAL(5,2) NULL,
    readability_score DECIMAL(5,2) NULL,
    match_percentage DECIMAL(5,2) NULL,        
    matched_skills JSON NULL,         
    missing_skills JSON NULL,         
    ai_feedback LONGTEXT NULL,        
    ai_suggestions JSON NULL,         
    status    ENUM('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_analyses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_analyses_resume
        FOREIGN KEY (resume_id)
        REFERENCES resumes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_analyses_job_description
        FOREIGN KEY (job_description_id)
        REFERENCES job_descriptions(id)
        ON DELETE SET NULL       
);