# Admin Panel Setup Guide

## Setting Up Admin Access

To grant admin access to a user:

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Table Editor**
   - Click on "Table Editor" in the left sidebar
   - Select the `user_profiles` table

3. **Mark User as Admin**
   - Find the user you want to make admin
   - Click on the row to edit
   - Set the `is_admin` field to `true`
   - Save changes

4. **Access Admin Panel**
   - The user can now access the admin panel at `/admin`
   - They will see all admin features in the navigation

## Admin Panel Features

### Dashboard (`/admin`)
- Overview statistics
- Total events, registrations, sponsors, and testimonials

### Events Management (`/admin/events`)
- Create new events
- Edit existing events
- Delete events
- View registration counts
- All fields are optional for flexibility

### Event Fields
- **Basic Info**: Title, Subtitle, Description
- **Event Type**: Conference, Workshop, Meetup, Hackathon, Bootcamp
- **Status**: Upcoming, Ongoing, Completed, Cancelled
- **Dates**: Event date, End date, Registration deadline
- **Location**: Online, Offline, or Hybrid
- **Details**: Prize pool, Max participants, Duration
- **Media**: Banner image, Thumbnail image URLs

### Registrations
- View all registrations for events
- Export registration data
- Filter by event

## Event Registration Flow

1. Admin creates event with registration deadline
2. Event appears on homepage
3. Users can register until deadline
4. After deadline, "Registration Closed" is shown
5. Registration count updates automatically

## Database Structure

- `events` - All event data
- `event_registrations` - User registrations
- `user_profiles` - User data with admin flag
- `website_content` - Editable website sections
- `sponsors` - Sponsor logos and info
- `testimonials` - User testimonials
- `speakers` - Event speakers
- `schedule_items` - Event schedules

## Security

- All admin routes are protected
- Only users with `is_admin = true` can access admin panel
- Row Level Security (RLS) policies enforce access control
- Public can only read published content
