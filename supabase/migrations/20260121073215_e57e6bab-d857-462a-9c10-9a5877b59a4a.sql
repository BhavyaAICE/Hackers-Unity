-- Re-add World Computer Hacker League 2025 hackathon
INSERT INTO public.events (
  title,
  subtitle,
  event_type,
  event_date,
  event_end_date,
  registration_deadline,
  location_type,
  location_name,
  prize_pool,
  registration_count,
  registration_enabled,
  status,
  description,
  external_link,
  banner_image,
  thumbnail_image,
  created_at
) VALUES (
  'World Computer Hacker League 2025',
  'ICP x Hacker''s Unity x Blockseblock - Qualification Round',
  'hackathon',
  '2025-02-01 00:00:00+00',
  '2025-02-28 23:59:59+00',
  '2025-02-25 23:59:59+00',
  'online',
  'Online - Global',
  '$300,000',
  11774,
  true,
  'upcoming',
  'The World Computer Hacker League 2025 is a global hackathon series powered by DFINITY Foundation and Internet Computer Protocol. This qualification round is organized in collaboration with Hacker''s Unity and Blockseblock. Build innovative decentralized applications on ICP and compete for a massive prize pool!',
  'https://dorahacks.io/hackathon/wchl25-india/detail',
  'https://cdn.dorahacks.io/hackathon/wchl25-india/cover_1737010855.png',
  'https://cdn.dorahacks.io/hackathon/wchl25-india/cover_1737010855.png',
  NOW() - INTERVAL '1 day'
);

-- Add challenges for WCHL25
INSERT INTO public.hackathon_challenges (event_id, title, description, icon, display_order, is_active)
SELECT 
  id,
  challenge.title,
  challenge.description,
  challenge.icon,
  challenge.display_order,
  true
FROM events, 
(VALUES 
  ('DeFi & Financial Services', 'Build decentralized finance applications, lending protocols, DEXs, or payment solutions on ICP', 'dollar-sign', 1),
  ('Social & Content Platforms', 'Create decentralized social networks, content platforms, or creator economy tools', 'users', 2),
  ('Gaming & Metaverse', 'Develop on-chain games, NFT experiences, or metaverse applications', 'gamepad-2', 3),
  ('Infrastructure & Tools', 'Build developer tools, SDKs, oracles, or infrastructure improvements for ICP', 'wrench', 4),
  ('AI & Web3 Integration', 'Combine AI/ML capabilities with blockchain technology on ICP', 'brain', 5)
) AS challenge(title, description, icon, display_order)
WHERE events.title = 'World Computer Hacker League 2025';

-- Add prizes for WCHL25
INSERT INTO public.hackathon_prizes (event_id, position, title, prize_amount, description, display_order, is_active)
SELECT 
  id,
  prize.position,
  prize.title,
  prize.prize_amount,
  prize.description,
  prize.display_order,
  true
FROM events,
(VALUES 
  ('1st', 'Grand Prize', '$50,000', 'Best overall project across all tracks', 1),
  ('2nd', 'Runner Up', '$25,000', 'Second best overall project', 2),
  ('3rd', 'Third Place', '$15,000', 'Third best overall project', 3),
  ('Track', 'Track Winners', '$10,000 each', 'Best project in each track category', 4)
) AS prize(position, title, prize_amount, description, display_order)
WHERE events.title = 'World Computer Hacker League 2025';

-- Add FAQs for WCHL25
INSERT INTO public.hackathon_faqs (event_id, question, answer, display_order, is_active)
SELECT 
  id,
  faq.question,
  faq.answer,
  faq.display_order,
  true
FROM events,
(VALUES 
  ('What is ICP?', 'Internet Computer Protocol (ICP) is a blockchain network developed by DFINITY Foundation that enables the creation of decentralized applications at web speed.', 1),
  ('Do I need prior blockchain experience?', 'No, but familiarity with programming is required. ICP provides excellent documentation and tutorials for beginners.', 2),
  ('Can I participate individually?', 'Yes, you can participate solo or form a team of up to 5 members.', 3),
  ('What are the judging criteria?', 'Projects are judged on innovation, technical implementation, user experience, and potential impact.', 4)
) AS faq(question, answer, display_order)
WHERE events.title = 'World Computer Hacker League 2025';