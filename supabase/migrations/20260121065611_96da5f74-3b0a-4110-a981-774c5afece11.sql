-- Add schedule_date column to schedule_items table
ALTER TABLE public.schedule_items 
ADD COLUMN schedule_date date;

-- Update Hack Node India schedule items with actual dates
UPDATE public.schedule_items 
SET schedule_date = '2025-08-10'
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' AND title = 'Registration Starts';

UPDATE public.schedule_items 
SET schedule_date = '2025-08-10'
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' AND title = 'Hackathon Starts';

UPDATE public.schedule_items 
SET schedule_date = '2025-10-11'
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' AND title = 'Registration Ends';

UPDATE public.schedule_items 
SET schedule_date = '2025-08-31'
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' AND title = 'Hackathon Ends';

UPDATE public.schedule_items 
SET schedule_date = '2025-08-31'
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' AND title = 'Project Submission';