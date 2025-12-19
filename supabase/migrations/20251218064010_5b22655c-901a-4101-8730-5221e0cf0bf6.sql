
-- Create a sample hackathon event
INSERT INTO events (
  id, title, subtitle, description, event_type, event_date, event_end_date, 
  registration_deadline, duration_days, location_type, location_name, 
  location_address, prize_pool, registration_enabled, status
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'CodeCraft 2025',
  'Build. Innovate. Transform.',
  'CodeCraft 2025 is an intensive 48-hour hackathon bringing together the brightest minds in technology. Whether you''re a seasoned developer or just starting out, this is your chance to build something amazing, learn from industry experts, and compete for exciting prizes.

Join us for a weekend of innovation, collaboration, and creativity. Work alongside passionate developers, get mentored by industry veterans, and transform your ideas into reality.

What to expect:
• 48 hours of non-stop hacking
• Access to cutting-edge tools and APIs
• Networking with industry professionals
• Exciting prizes worth ₹2,00,000+
• Food, swag, and lots of fun!',
  'hackathon',
  '2025-02-15 09:00:00+05:30',
  '2025-02-17 18:00:00+05:30',
  '2025-02-10 23:59:59+05:30',
  3,
  'hybrid',
  'Tech Innovation Hub',
  'Cyber City, Gurugram, Haryana',
  '₹2,00,000+',
  true,
  'upcoming'
);

-- Insert 7 Mentors
INSERT INTO hackathon_mentors (event_id, name, title, organization, bio, linkedin_url, display_order, is_active) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Priya Sharma', 'Senior Software Engineer', 'Google', 'Full-stack developer with 10+ years of experience in building scalable applications.', 'https://linkedin.com/in/priyasharma', 1, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rahul Verma', 'Tech Lead', 'Microsoft', 'Cloud architecture expert specializing in Azure and distributed systems.', 'https://linkedin.com/in/rahulverma', 2, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ananya Patel', 'AI/ML Engineer', 'Amazon', 'Machine learning specialist with expertise in NLP and computer vision.', 'https://linkedin.com/in/ananyapatel', 3, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Vikram Singh', 'Blockchain Developer', 'Polygon', 'Web3 enthusiast building decentralized applications and smart contracts.', 'https://linkedin.com/in/vikramsingh', 4, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Neha Gupta', 'Product Manager', 'Flipkart', 'Product strategy expert helping startups build user-centric solutions.', 'https://linkedin.com/in/nehagupta', 5, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Arjun Reddy', 'DevOps Engineer', 'Netflix', 'Infrastructure and automation specialist with expertise in Kubernetes.', 'https://linkedin.com/in/arjunreddy', 6, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kavitha Iyer', 'UX Designer', 'Adobe', 'Design thinking advocate creating intuitive user experiences.', 'https://linkedin.com/in/kavithaiyer', 7, true);

-- Insert 7 Jury Members
INSERT INTO hackathon_jury (event_id, name, title, organization, bio, linkedin_url, display_order, is_active) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dr. Amit Kumar', 'CTO', 'TechMahindra', 'Technology visionary with 20+ years leading digital transformation initiatives.', 'https://linkedin.com/in/dramitkumar', 1, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sunita Rao', 'VP Engineering', 'Razorpay', 'Fintech leader driving innovation in payment infrastructure.', 'https://linkedin.com/in/sunitarao', 2, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Manish Jain', 'Founder & CEO', 'CodeNation', 'Serial entrepreneur and angel investor in deep-tech startups.', 'https://linkedin.com/in/manishjain', 3, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dr. Lakshmi Nair', 'Professor', 'IIT Delhi', 'Computer science researcher specializing in algorithms and data structures.', 'https://linkedin.com/in/drlakshminair', 4, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rajesh Menon', 'Partner', 'Sequoia Capital', 'Early-stage investor backing India''s next unicorns.', 'https://linkedin.com/in/rajeshmenon', 5, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pooja Bhatt', 'Director of Engineering', 'Swiggy', 'Engineering leader scaling systems for millions of users.', 'https://linkedin.com/in/poojabhatt', 6, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sanjay Deshmukh', 'Chief Innovation Officer', 'Infosys', 'Innovation evangelist driving enterprise digital solutions.', 'https://linkedin.com/in/sanjaydeshmukh', 7, true);

-- Insert 4 Prizes (1st, 2nd, 3rd + Participation Certificate)
INSERT INTO hackathon_prizes (event_id, position, title, prize_amount, description, display_order, is_active) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '1st Place', 'Grand Winner', '₹1,00,000', 'Cash prize + Exclusive mentorship opportunity + Premium swag kit + Fast-track interviews at partner companies', 1, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2nd Place', 'First Runner-up', '₹60,000', 'Cash prize + Exclusive swag kit + Interview opportunities at partner companies', 2, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3rd Place', 'Second Runner-up', '₹40,000', 'Cash prize + Swag kit + LinkedIn endorsements from jury members', 3, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'All Participants', 'Certificate of Participation', 'Certificate', 'Digital certificate of participation + Access to exclusive community + Networking opportunities', 4, true);
