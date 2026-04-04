CREATE TABLE IF NOT EXISTS t_p30913071_project_cool_idea.phone_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p30913071_project_cool_idea.users(id),
    vacancy_id INTEGER NOT NULL REFERENCES t_p30913071_project_cool_idea.vacancies(id),
    payment_id VARCHAR(100) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    amount INTEGER NOT NULL DEFAULT 500,
    expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS phone_access_payment_id_idx ON t_p30913071_project_cool_idea.phone_access(payment_id);
CREATE INDEX IF NOT EXISTS phone_access_user_vacancy_idx ON t_p30913071_project_cool_idea.phone_access(user_id, vacancy_id);