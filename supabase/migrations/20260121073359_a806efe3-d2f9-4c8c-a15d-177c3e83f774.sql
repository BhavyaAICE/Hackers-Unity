-- Fix WCHL25 status to upcoming (it's in February 2025)
UPDATE events SET status = 'upcoming' WHERE title = 'World Computer Hacker League 2025';