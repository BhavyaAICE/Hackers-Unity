-- Remove incorrect prizes (Global Accelerator and Dubai Incubation as separate prizes - they're part of description, not separate prize entries)
DELETE FROM public.hackathon_prizes 
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' 
AND title IN ('Global Accelerator', 'Dubai Incubation');

-- Update the main prize to just show the prize pool correctly
UPDATE public.hackathon_prizes 
SET title = 'Prize Pool', prize_amount = '$5,000 USD', description = 'Top performers will be rewarded from the prize pool across all tracks.'
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' AND title = 'Main Prize Pool';

-- Update the event to have simpler prize_pool display
UPDATE public.events 
SET prize_pool = '$5,000 USD',
    benefits_text = NULL
WHERE id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d';

-- Fix FAQs - remove wrong one and add the missing one
DELETE FROM public.hackathon_faqs 
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' 
AND question = 'Can I submit an existing project?';

INSERT INTO public.hackathon_faqs (event_id, question, answer, display_order, is_active)
VALUES (
  'f8b1fe35-216d-4e46-94cf-cc8733d29c9d',
  'What is an Xnode One Hardware?',
  'Xnode One is a hardware device provided by OpenXAI that enables decentralized AI computing and participation in the network.',
  4,
  true
);

UPDATE public.hackathon_faqs 
SET display_order = 5, answer = 'Projects should be built during the hackathon period. You can use existing libraries and frameworks.'
WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' 
AND question = 'Can I submit an existing project?';

INSERT INTO public.hackathon_faqs (event_id, question, answer, display_order, is_active)
SELECT 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d', 'Can I submit an existing project?', 'Projects should be built during the hackathon period. You can use existing libraries, frameworks, and tools.', 5, true
WHERE NOT EXISTS (SELECT 1 FROM public.hackathon_faqs WHERE event_id = 'f8b1fe35-216d-4e46-94cf-cc8733d29c9d' AND question = 'Can I submit an existing project?');

-- Add the schedule items
INSERT INTO public.schedule_items (event_id, title, description, day, start_time, display_order)
VALUES 
  ('f8b1fe35-216d-4e46-94cf-cc8733d29c9d', 'Registration Starts', 'Registration opens for Hack Node India', 1, '08:00 PM', 1),
  ('f8b1fe35-216d-4e46-94cf-cc8733d29c9d', 'Hackathon Starts', 'The hackathon officially begins', 1, '08:00 PM', 2),
  ('f8b1fe35-216d-4e46-94cf-cc8733d29c9d', 'Registration Ends', 'Last day to register for the hackathon', 2, '08:00 PM', 3),
  ('f8b1fe35-216d-4e46-94cf-cc8733d29c9d', 'Hackathon Ends', 'The hackathon concludes', 3, '08:00 PM', 4),
  ('f8b1fe35-216d-4e46-94cf-cc8733d29c9d', 'Project Submission', 'Final deadline for project submissions', 3, '08:00 PM', 5);