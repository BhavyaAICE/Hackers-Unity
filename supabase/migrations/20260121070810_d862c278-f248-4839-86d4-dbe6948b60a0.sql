-- Fix Hack Node India schedule timing (based on original data: 10 Aug 8PM, 11 Oct 8PM, 31 Aug 8PM, 31 Aug 8PM)
UPDATE schedule_items 
SET schedule_date = '2025-08-10', start_time = '08:00 PM IST'
WHERE id = 'daba61ae-1ae4-476f-b8b4-2a6905d66e9f';

UPDATE schedule_items 
SET schedule_date = '2025-08-10', start_time = '08:00 PM IST'
WHERE id = '9b332dd0-35da-45b6-841e-29c35d240ad3';

UPDATE schedule_items 
SET schedule_date = '2025-10-11', start_time = '08:00 PM IST'
WHERE id = '067a49e9-54ef-47ed-9f49-de2ae87abc78';

UPDATE schedule_items 
SET schedule_date = '2025-08-31', start_time = '08:00 PM IST'
WHERE id = 'f4869a51-a91a-4f83-bfc0-5d9f9eebe74b';

UPDATE schedule_items 
SET schedule_date = '2025-08-31', start_time = '08:00 PM IST'
WHERE id = 'e4783436-ac9b-41b3-94e6-836eafc4704c';

-- Add Hackstrom 2025 hackathon (Hacker's Unity x JEC Kukas)
INSERT INTO events (
  title,
  subtitle,
  description,
  event_type,
  event_date,
  event_end_date,
  registration_deadline,
  location_name,
  location_address,
  location_type,
  prize_pool,
  registration_count,
  registration_enabled,
  status,
  duration_days,
  max_participants,
  benefits_text,
  external_link,
  banner_image,
  thumbnail_image
) VALUES (
  'HACKSTROM 2025',
  'Hacker''s Unity x JEC Kukas | Code the Storm',
  'Join Hacker''s Unity x JEC Kukas for an electrifying 24-hour hackathon where your creativity, coding skills, and problem-solving abilities will be put to the ultimate test! 💻🔥

HACKSTROM is a national-level offline hackathon bringing together the brightest minds from across India to innovate, collaborate, and build solutions that matter.

✨ Highlights & Benefits:
• 🎁 Swags, goodies & exciting prizes
• 💼 Internship & PPO opportunities with top companies
• 🏅 Certificates for all participants
• 🤝 Networking with fellow hackers & industry mentors
• 🧠 Hands-on workshops & skill-building sessions
• 🍕☕ On-site food facility to keep you energized

👥 Team Size: 2-6 members

🏨 Accommodation Package – ₹400 per Team
For participants arriving a day prior, comfortable stay facilities are provided.

🍽 Food is included for the event day — so you can focus on the hackathon without any worries!',
  'hackathon',
  '2025-10-31 09:00:00+05:30',
  '2025-11-01 18:00:00+05:30',
  '2025-10-25 23:59:59+05:30',
  'JEC Kukas, Jaipur',
  'Jaipur Engineering College, Kukas, Jaipur, Rajasthan, India',
  'in-person',
  '$2,353 USD',
  1400,
  false,
  'completed',
  2,
  500,
  'Swags & Goodies, Internship & PPO opportunities, Certificates for all participants, Networking with industry mentors, Hands-on workshops, On-site food facility, Accommodation available at ₹400 per team',
  'https://hackstrom-1.devfolio.co/',
  'https://assets.devfolio.co/hackathons/ed7c1b28136d4cb688423e21684a8853/assets/cover/778.png',
  'https://assets.devfolio.co/hackathons/ed7c1b28136d4cb688423e21684a8853/assets/favicon/208.png'
);

-- Get the hackstrom event ID for related data
DO $$
DECLARE
  hackstrom_id uuid;
BEGIN
  SELECT id INTO hackstrom_id FROM events WHERE title = 'HACKSTROM 2025' LIMIT 1;
  
  -- Add Hackstrom Prizes
  INSERT INTO hackathon_prizes (event_id, position, title, prize_amount, description, display_order, is_active)
  VALUES 
    (hackstrom_id, '1st', 'Winner', '$1,000', 'Top team wins the grand prize with internship opportunities', 1, true),
    (hackstrom_id, '2nd', 'First Runner Up', '$600', 'Second place prize with special recognition', 2, true),
    (hackstrom_id, '3rd', 'Second Runner Up', '$400', 'Third place prize with certificates', 3, true),
    (hackstrom_id, 'Special', 'ETHIndia Track', '$100', 'Best Web3/Blockchain implementation using Ethereum', 4, true);
  
  -- Add Hackstrom Schedule
  INSERT INTO schedule_items (event_id, title, description, schedule_date, start_time, day, display_order)
  VALUES 
    (hackstrom_id, 'Check-in & Registration', 'Participants arrive and complete registration', '2025-10-31', '09:00 AM', 1, 1),
    (hackstrom_id, 'Opening Ceremony', 'Welcome address and hackathon kickoff', '2025-10-31', '10:00 AM', 1, 2),
    (hackstrom_id, 'Hacking Begins', '24-hour coding marathon starts', '2025-10-31', '11:00 AM', 1, 3),
    (hackstrom_id, 'Mentor Sessions', 'One-on-one sessions with industry mentors', '2025-10-31', '02:00 PM', 1, 4),
    (hackstrom_id, 'Midnight Snacks', 'Energy boost for late-night hackers', '2025-11-01', '12:00 AM', 2, 5),
    (hackstrom_id, 'Hacking Ends', 'Submission deadline', '2025-11-01', '11:00 AM', 2, 6),
    (hackstrom_id, 'Project Presentations', 'Teams present their solutions to judges', '2025-11-01', '12:00 PM', 2, 7),
    (hackstrom_id, 'Judging & Deliberation', 'Jury evaluates projects', '2025-11-01', '03:00 PM', 2, 8),
    (hackstrom_id, 'Prize Distribution & Closing', 'Winners announced and closing ceremony', '2025-11-01', '05:00 PM', 2, 9);
  
  -- Add Hackstrom FAQs
  INSERT INTO hackathon_faqs (event_id, question, answer, display_order, is_active)
  VALUES 
    (hackstrom_id, 'Is there a fee to participate in the hackathon?', 'No, participation is completely free! However, accommodation is available at ₹400 per team for those arriving a day prior.', 1, true),
    (hackstrom_id, 'Is the hackathon offline or online?', 'HACKSTROM is a 100% offline hackathon held at JEC Kukas, Jaipur. All participants must be present at the venue.', 2, true),
    (hackstrom_id, 'Will there be food and accommodation at the venue?', 'Yes! Food is included for the event day. Accommodation is available at ₹400 per team for early arrivals. On-site food stalls will also be available.', 3, true),
    (hackstrom_id, 'What is the team size requirement?', 'Teams can have 2-6 members. Solo participants are also welcome to participate.', 4, true),
    (hackstrom_id, 'What are the prizes and benefits?', 'Total prize pool of $2,353 USD, plus swags, goodies, internship & PPO opportunities, certificates for all participants, and networking with industry mentors.', 5, true);
  
  -- Add Hackstrom Challenges/Tracks
  INSERT INTO hackathon_challenges (event_id, title, description, icon, display_order, is_active)
  VALUES 
    (hackstrom_id, 'Open Innovation', 'Build any solution that solves real-world problems. No restrictions on domain or technology.', 'Lightbulb', 1, true),
    (hackstrom_id, 'Web3 & Blockchain', 'Create decentralized applications, smart contracts, or blockchain-based solutions. Special ETHIndia track prize available.', 'Blocks', 2, true),
    (hackstrom_id, 'AI/ML Solutions', 'Leverage artificial intelligence and machine learning to build intelligent applications.', 'Brain', 3, true),
    (hackstrom_id, 'Social Impact', 'Develop solutions that address social challenges and create positive community impact.', 'Heart', 4, true);

END $$;