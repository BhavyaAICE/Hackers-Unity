-- Insert the World Computer Hacker League hackathon event
INSERT INTO public.events (
  title,
  subtitle,
  description,
  event_date,
  event_type,
  location_name,
  location_type,
  registration_deadline,
  status,
  prize_pool,
  registration_count,
  max_participants,
  thumbnail_image,
  banner_image,
  external_link,
  tags
) VALUES (
  'World Computer Hacker League 2025',
  'ICP - WCHL25 - Qualification Round',
  E'**Hack the Future, Build Your Legacy on ICP.**\n\n🔥 The World Computer Hacker League (WCHL) 2025 is a global hackathon led by the ICP HUBS Network. This competition aims to identify, nurture, and showcase top developer talent within the Internet Computer Protocol (ICP) ecosystem. Over 4 months, the initiative drives innovation while expanding the developer community and supporting impactful applications.\n\n**Hackathon Structure:**\n- **Round 1 (India Level):** Participants compete nationally, tackling challenges in blockchain, AI, and other emerging technologies.\n- **Round 2 (India Level):** A second India-based round with more complex technical problems.\n- **Round 3 (Asia Level):** Selected participants from Asia will solve high-stakes challenges collaboratively and competitively.\n- **Round 4 (Global Level):** Final round with global participants competing for the ultimate prize pool.\n\n**Hackathon Tracks:**\n- **AI** - Decentralized Intelligence: Build AI apps that are decentralized and transparent on ICP.\n- **Bitcoin DeFi** - Financial Innovation: Create decentralized finance apps using ICP''s Bitcoin integration.\n- **Fully On-Chain** - Pure Decentralization: Build apps entirely on the ICP blockchain.\n- **RWA** - Real-World Assets: Tokenize real assets like real estate or art on the blockchain.\n- **Open Track** - Unlimited Innovation: For ideas outside other tracks, explore new protocols or use cases.\n\n**Why Participate?**\n- Time to build something real with a 4-month journey\n- Direct access to ICP HUBS, DevRels, and DFINITY engineers\n- Compete globally while receiving local support from ICP HUBS\n- Grant interviews, investor exposure, and incubation opportunities for finalists',
  '2025-07-01',
  'hackathon',
  'Virtual / Online',
  'online',
  '2025-07-23',
  'completed',
  '$300,000',
  11774,
  NULL,
  'https://cdn.dorahacks.io/static/files/1976d356cfd31cee62c9d00456c89c56.png',
  'https://cdn.dorahacks.io/static/files/1976f1055dec5982fae1b21492e835fb.jpg',
  'https://dorahacks.io/hackathon/wchl25-qualification-round/detail',
  '["ICP", "Rust", "TypeScript", "React", "BTC", "Motoko", "AI", "Chain Fusion", "Web3", "Blockchain"]'::jsonb
);

-- Get the event ID for adding challenges
DO $$
DECLARE
  new_event_id uuid;
BEGIN
  SELECT id INTO new_event_id FROM public.events WHERE title = 'World Computer Hacker League 2025' LIMIT 1;
  
  -- Insert hackathon challenges/tracks
  INSERT INTO public.hackathon_challenges (event_id, title, description, display_order) VALUES
  (new_event_id, 'AI - Decentralized Intelligence', 'Use the Internet Computer Protocol (ICP) to build AI apps that are decentralized and transparent, like on-chain AI models or smart agents, ensuring security without middlemen.', 1),
  (new_event_id, 'Bitcoin DeFi - Financial Innovation', 'Tap into ICP''s Bitcoin integration to create decentralized finance apps, enabling new ways to use Bitcoin, from lending to cross-chain deals, all with ICP''s speed and security.', 2),
  (new_event_id, 'Fully On-Chain - Pure Decentralization', 'Build apps entirely on the ICP blockchain, like social platforms or DAOs, with no off-chain needs, ensuring full decentralization and user control.', 3),
  (new_event_id, 'RWA - Real-World Assets', 'Use ICP to tokenize real assets like real estate or art on the blockchain, enabling shared ownership and new digital interactions.', 4),
  (new_event_id, 'Open Track - Unlimited Innovation', 'For ideas outside other tracks, use ICP to explore new protocols or use cases. This track is for visionaries shaping Web3''s future with creative, cutting-edge solutions.', 5);
  
  -- Insert hackathon prizes
  INSERT INTO public.hackathon_prizes (event_id, position, title, description, prize_amount, display_order) VALUES
  (new_event_id, '1st', 'Qualification Round', 'Top winners across all countries for initial traction', '$30,000', 1),
  (new_event_id, '2nd', 'National Round', 'Top winners across all countries with bounties for technical achievements and innovation', '$50,000', 2),
  (new_event_id, '3rd', 'Regional Round (Asia Level)', 'Regional leaders demonstrating technical skills and product-market fit', '$70,000', 3),
  (new_event_id, '4th', 'Global Finale Round', 'Top 3 Global Winners including special awards for innovation and ecosystem impact', '$150,000', 4);
  
  -- Insert FAQ items
  INSERT INTO public.hackathon_faqs (event_id, question, answer, display_order) VALUES
  (new_event_id, 'What is the team size allowed?', 'Teams can have 2-5 members.', 1),
  (new_event_id, 'What is the duration of the hackathon?', 'The hackathon spans 4 months with multiple rounds: Qualification (July), National (August), Regional (September), and Global Finale (October).', 2),
  (new_event_id, 'Can I switch tracks during the competition?', 'Yes, teams may choose to change their track during the competition, but it is a strategic decision as you may need additional effort to adapt.', 3),
  (new_event_id, 'What do I need to submit?', 'You need to submit a public GitHub repository with all project code, project demo, and documentation.', 4);
  
END $$;