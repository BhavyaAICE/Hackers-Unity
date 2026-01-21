-- Update the World Computer Hacker League 2025 to indicate Hacker's Unity x Blockseblock
UPDATE public.events 
SET subtitle = 'Hacker''s Unity x Blockseblock | Qualification Round'
WHERE title = 'World Computer Hacker League 2025';

-- Insert Hack Node India hackathon
INSERT INTO public.events (
  title,
  subtitle,
  event_type,
  status,
  event_date,
  event_end_date,
  registration_deadline,
  location_type,
  location_name,
  description,
  prize_pool,
  registration_enabled,
  registration_count,
  thumbnail_image,
  banner_image,
  external_link,
  tags,
  benefits_text
) VALUES (
  'Hack Node India',
  'Hacker''s Unity x Blockseblock x OpenXAI',
  'hackathon',
  'completed',
  '2025-08-09 20:00:00+05:30',
  '2025-08-30 20:00:00+05:30',
  '2025-10-10 20:00:00+05:30',
  'online',
  'Online',
  '## About Hack Node India

Hack Node India is a hands-on workshop series for college students to explore and build with technologies like AI, Web3, gaming, and more. Through expert-led sessions and real project development, students gain practical skills and experience.

### Why Participate?

- **Expert-Led Workshops**: Learn from industry professionals
- **Real Project Development**: Build practical, real-world applications
- **$5,000 Prize Pool**: Top performers will be rewarded
- **Global Accelerator Program**: Outstanding teams compete for $100,000 USD
- **Dubai Incubation**: Ultimate winners earn a month-long incubation opportunity in Dubai

### Pre-Hackathon Workshops

Join free workshops to prepare for the hackathon and learn new skills! OpenXAI OnCampus brings the future of artificial intelligence to your college in focused, one-hour sessions open to students of all backgrounds.

The event includes hands-on AI workshops, live demonstrations, and interactive discussions on the latest trends in the field. Whether you''re new to AI or already exploring its potential, this session offers a welcoming space to learn, experiment, and get inspired—no prior experience needed.',
  '$5,000 + $100,000 Global Accelerator',
  false,
  2500,
  'https://storage.googleapis.com/block_se_block/hackathon_image/1754300762696-Hack%20node%20graphic.jpg',
  'https://storage.googleapis.com/block_se_block/hackathon_image/1754300762696-Hack%20node%20graphic.jpg',
  'https://blockseblock.com/hackathon_details/Hack%20Node%20India',
  '["OpenXAI", "AI", "Web3", "Gaming", "HealthTech", "EdTech", "FinTech", "Sustainability"]',
  'Expert workshops, Dubai incubation opportunity, Global Accelerator Program access'
);

-- Get the event ID for Hack Node India and insert challenges
WITH hack_node_event AS (
  SELECT id FROM public.events WHERE title = 'Hack Node India' LIMIT 1
)
INSERT INTO public.hackathon_challenges (event_id, title, description, display_order, is_active) VALUES
((SELECT id FROM hack_node_event), 'AI Track', 'Build with GenAI, ML, NLP, or vision to solve real-world problems — from local language models to AI copilots.', 1, true),
((SELECT id FROM hack_node_event), 'Web3 & Decentralization', 'Use blockchain, smart contracts, or decentralized identity to build trustless, user-owned systems.', 2, true),
((SELECT id FROM hack_node_event), 'Gaming', 'Create culturally rooted games, AR/VR experiences, or AI-generated game assets for the next billion players.', 3, true),
((SELECT id FROM hack_node_event), 'Social Impact', 'Tech for good — civic tools, accessibility, disaster response, or empowering rural India.', 4, true),
((SELECT id FROM hack_node_event), 'HealthTech', 'AI in diagnostics, fitness, mental health, or decentralized health records — reimagining care in India.', 5, true),
((SELECT id FROM hack_node_event), 'EdTech & Learning', 'AI tutors, gamified learning, upskilling tools — build for India''s next generation of learners.', 6, true),
((SELECT id FROM hack_node_event), 'Sustainability', 'Solve for energy, pollution, agriculture, or carbon — tech to fight the climate crisis.', 7, true),
((SELECT id FROM hack_node_event), 'Financial Tech', 'Innovate in payments, lending, DeFi, or fraud detection — finance that works for everyone.', 8, true),
((SELECT id FROM hack_node_event), 'Creative Tech', 'AI-powered storytelling, music, design, or digital art — create, remix, and empower Indian creators.', 9, true);

-- Insert prizes for Hack Node India
WITH hack_node_event AS (
  SELECT id FROM public.events WHERE title = 'Hack Node India' LIMIT 1
)
INSERT INTO public.hackathon_prizes (event_id, position, title, prize_amount, description, display_order, is_active) VALUES
((SELECT id FROM hack_node_event), '1st', 'Main Prize Pool', '$5,000', 'Top performers will be rewarded from the main prize pool across all tracks.', 1, true),
((SELECT id FROM hack_node_event), '2nd', 'Global Accelerator', '$100,000', 'Outstanding teams compete for the Global Accelerator Program prize.', 2, true),
((SELECT id FROM hack_node_event), '3rd', 'Dubai Incubation', 'Incubation', 'Ultimate winners earn a month-long incubation opportunity in Dubai.', 3, true);

-- Insert FAQs for Hack Node India
WITH hack_node_event AS (
  SELECT id FROM public.events WHERE title = 'Hack Node India' LIMIT 1
)
INSERT INTO public.hackathon_faqs (event_id, question, answer, display_order, is_active) VALUES
((SELECT id FROM hack_node_event), 'How do I sign up to officially enter the hackathon?', 'Register through the Blockseblock platform. Complete your profile and join the hackathon page to officially enter.', 1, true),
((SELECT id FROM hack_node_event), 'How do I submit my project?', 'Submit your project through the hackathon platform before the submission deadline. Include your GitHub repository, demo video, and project description.', 2, true),
((SELECT id FROM hack_node_event), 'Can I participate as part of a team?', 'Yes! You can participate individually or as part of a team. Teams can have multiple members working together on a project.', 3, true),
((SELECT id FROM hack_node_event), 'Is there any cost to participate?', 'No, participation in Hack Node India is completely free. All workshops and resources are also provided at no cost.', 4, true),
((SELECT id FROM hack_node_event), 'Can I submit an existing project?', 'Projects should be built during the hackathon period. However, you can use existing libraries, frameworks, and tools as part of your project.', 5, true);