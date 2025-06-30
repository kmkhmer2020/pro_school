/*
  # Seed Sample Data for School Management System

  1. Sample Data
    - Create sample profiles for different user roles
    - Add sample students, teachers, courses, and classes
    - Create sample enrollments, attendance, and grades
    - Add sample announcements

  2. Notes
    - This is sample data for development and testing
    - Passwords are set to 'password123' for all users
    - In production, users should be created through proper registration
*/

-- Insert sample profiles (these would normally be created through Supabase Auth)
-- Note: In a real application, these would be created when users sign up

-- Sample courses
INSERT INTO courses (course_code, name, description, credits, grade_level, department) VALUES
('MATH101', 'Algebra I', 'Introduction to algebraic concepts and problem solving', 1, '9th', 'Mathematics'),
('MATH201', 'Geometry', 'Study of shapes, angles, and spatial relationships', 1, '10th', 'Mathematics'),
('MATH301', 'Algebra II', 'Advanced algebraic concepts and functions', 1, '11th', 'Mathematics'),
('MATH401', 'Pre-Calculus', 'Preparation for calculus with advanced functions', 1, '12th', 'Mathematics'),
('ENG101', 'English I', 'Fundamentals of reading, writing, and literature', 1, '9th', 'English'),
('ENG201', 'English II', 'Intermediate literature and composition', 1, '10th', 'English'),
('ENG301', 'English III', 'American literature and advanced writing', 1, '11th', 'English'),
('ENG401', 'English IV', 'British literature and college preparation', 1, '12th', 'English'),
('SCI101', 'Biology', 'Introduction to life sciences and cellular biology', 1, '9th', 'Science'),
('SCI201', 'Chemistry', 'Basic principles of chemistry and matter', 1, '10th', 'Science'),
('SCI301', 'Physics', 'Fundamental concepts of physics and motion', 1, '11th', 'Science'),
('HIS101', 'World History', 'Survey of world civilizations and cultures', 1, '9th', 'History'),
('HIS201', 'US History', 'American history from colonial times to present', 1, '10th', 'History'),
('ART101', 'Visual Arts', 'Introduction to drawing, painting, and design', 1, '9th', 'Arts'),
('PE101', 'Physical Education', 'Physical fitness and health education', 0.5, '9th', 'Physical Education');

-- Sample announcements
INSERT INTO announcements (title, content, target_audience, priority, is_published, publish_date) VALUES
('Welcome Back to School!', 'We are excited to welcome all students and families back for the new academic year. Please review the updated school policies and procedures.', 'all', 'high', true, now() - interval '2 days'),
('Parent-Teacher Conferences', 'Parent-teacher conferences will be held next week. Please schedule your appointments through the school portal.', 'parents', 'medium', true, now() - interval '1 day'),
('Science Fair Registration', 'Registration for the annual science fair is now open. Students interested in participating should contact their science teachers.', 'students', 'medium', true, now()),
('Staff Meeting Reminder', 'Monthly staff meeting scheduled for Friday at 3:30 PM in the main conference room.', 'teachers', 'medium', true, now()),
('School Closure Notice', 'School will be closed on Monday due to professional development day. Regular classes resume Tuesday.', 'all', 'high', true, now() + interval '1 day');

-- Note: In a real application, you would need to:
-- 1. Create actual users through Supabase Auth
-- 2. Insert corresponding profile records
-- 3. Create student and teacher records linked to those profiles
-- 4. Create classes linked to teachers and courses
-- 5. Create enrollments linking students to classes
-- 6. Add attendance and grade records

-- This seed file provides the course catalog and announcements
-- The user-related data would be created through the application interface