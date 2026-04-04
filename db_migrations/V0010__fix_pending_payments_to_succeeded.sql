UPDATE t_p30913071_project_cool_idea.phone_access 
SET payment_status = 'succeeded', expires_at = NOW() + INTERVAL '24 hours'
WHERE payment_status = 'pending';