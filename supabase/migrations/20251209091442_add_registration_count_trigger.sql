/*
  # Add Registration Count Auto-increment
  
  1. Functions
    - Create function to increment/decrement event registration count
  
  2. Triggers
    - Add trigger to automatically update registration_count when registrations are added/deleted
*/

-- Create function to handle registration count
CREATE OR REPLACE FUNCTION handle_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment count
    UPDATE events 
    SET registration_count = registration_count + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement count
    UPDATE events 
    SET registration_count = GREATEST(0, registration_count - 1)
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for INSERT
CREATE TRIGGER increment_event_registration_count
  AFTER INSERT ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION handle_registration_count();

-- Create trigger for DELETE
CREATE TRIGGER decrement_event_registration_count
  AFTER DELETE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION handle_registration_count();
