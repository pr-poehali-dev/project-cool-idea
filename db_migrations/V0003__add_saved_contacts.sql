CREATE TABLE IF NOT EXISTS saved_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    vacancy_id INTEGER NOT NULL REFERENCES vacancies(id),
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, vacancy_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_contacts_user ON saved_contacts(user_id);
