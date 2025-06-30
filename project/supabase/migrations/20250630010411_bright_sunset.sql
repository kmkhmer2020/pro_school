/*
  # School Management System Database Schema

  1. New Tables
    - `profiles` - User profiles extending Supabase auth
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (enum: admin, teacher, student, parent)
      - `avatar_url` (text, optional)
      - `phone` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `students` - Student records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `student_id` (text, unique identifier)
      - `grade_level` (text)
      - `date_of_birth` (date)
      - `address` (text)
      - `emergency_contact` (text)
      - `enrollment_date` (date)
      - `status` (enum: active, inactive, graduated)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `teachers` - Teacher records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `employee_id` (text, unique identifier)
      - `department` (text)
      - `specialization` (text)
      - `hire_date` (date)
      - `qualification` (text)
      - `experience_years` (integer)
      - `status` (enum: active, inactive)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `courses` - Course catalog
      - `id` (uuid, primary key)
      - `course_code` (text, unique)
      - `name` (text)
      - `description` (text)
      - `credits` (integer)
      - `grade_level` (text)
      - `department` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `classes` - Class instances
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `teacher_id` (uuid, references teachers)
      - `class_code` (text, unique)
      - `semester` (text)
      - `academic_year` (text)
      - `schedule` (jsonb)
      - `room` (text)
      - `max_students` (integer)
      - `status` (enum: active, completed, cancelled)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `enrollments` - Student class enrollments
      - `id` (uuid, primary key)
      - `student_id` (uuid, references students)
      - `class_id` (uuid, references classes)
      - `enrollment_date` (date)
      - `status` (enum: enrolled, dropped, completed)
      - `final_grade` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `attendance` - Attendance records
      - `id` (uuid, primary key)
      - `student_id` (uuid, references students)
      - `class_id` (uuid, references classes)
      - `date` (date)
      - `status` (enum: present, absent, late, excused)
      - `notes` (text, optional)
      - `recorded_by` (uuid, references profiles)
      - `created_at` (timestamp)

    - `grades` - Grade records
      - `id` (uuid, primary key)
      - `student_id` (uuid, references students)
      - `class_id` (uuid, references classes)
      - `assignment_name` (text)
      - `assignment_type` (enum: homework, quiz, exam, project, participation)
      - `points_earned` (decimal)
      - `points_possible` (decimal)
      - `grade_date` (date)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `announcements` - School announcements
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author_id` (uuid, references profiles)
      - `target_audience` (enum: all, students, teachers, parents)
      - `priority` (enum: low, medium, high, urgent)
      - `is_published` (boolean)
      - `publish_date` (timestamp)
      - `expire_date` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Students can only see their own data
    - Teachers can see their classes and students
    - Admins have full access

  3. Indexes
    - Add indexes for frequently queried columns
    - Composite indexes for common query patterns
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
CREATE TYPE class_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'dropped', 'completed');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE assignment_type AS ENUM ('homework', 'quiz', 'exam', 'project', 'participation');
CREATE TYPE announcement_audience AS ENUM ('all', 'students', 'teachers', 'parents');
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  student_id text UNIQUE NOT NULL,
  grade_level text NOT NULL,
  date_of_birth date,
  address text,
  emergency_contact text,
  enrollment_date date DEFAULT CURRENT_DATE,
  status student_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  department text NOT NULL,
  specialization text,
  hire_date date DEFAULT CURRENT_DATE,
  qualification text,
  experience_years integer DEFAULT 0,
  status teacher_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  credits integer DEFAULT 1,
  grade_level text NOT NULL,
  department text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  class_code text UNIQUE NOT NULL,
  semester text NOT NULL,
  academic_year text NOT NULL,
  schedule jsonb,
  room text,
  max_students integer DEFAULT 30,
  status class_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  enrollment_date date DEFAULT CURRENT_DATE,
  status enrollment_status DEFAULT 'enrolled',
  final_grade text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  date date NOT NULL,
  status attendance_status NOT NULL,
  notes text,
  recorded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id, date)
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  assignment_name text NOT NULL,
  assignment_type assignment_type NOT NULL,
  points_earned decimal(5,2),
  points_possible decimal(5,2) NOT NULL,
  grade_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_audience announcement_audience DEFAULT 'all',
  priority announcement_priority DEFAULT 'medium',
  is_published boolean DEFAULT false,
  publish_date timestamptz DEFAULT now(),
  expire_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Students policies
CREATE POLICY "Students can read own data"
  ON students FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Teachers policies
CREATE POLICY "Teachers can read own data"
  ON teachers FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Courses policies
CREATE POLICY "Everyone can read active courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins and teachers can manage courses"
  ON courses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Classes policies
CREATE POLICY "Users can read relevant classes"
  ON classes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      LEFT JOIN teachers t ON p.id = t.user_id
      LEFT JOIN students s ON p.id = s.user_id
      LEFT JOIN enrollments e ON s.id = e.student_id
      WHERE p.id = auth.uid() AND (
        p.role = 'admin' OR
        t.id = classes.teacher_id OR
        e.class_id = classes.id
      )
    )
  );

-- Enrollments policies
CREATE POLICY "Users can read relevant enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      LEFT JOIN students s ON p.id = s.user_id
      LEFT JOIN teachers t ON p.id = t.user_id
      LEFT JOIN classes c ON t.id = c.teacher_id
      WHERE p.id = auth.uid() AND (
        p.role = 'admin' OR
        s.id = enrollments.student_id OR
        c.id = enrollments.class_id
      )
    )
  );

-- Attendance policies
CREATE POLICY "Users can read relevant attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      LEFT JOIN students s ON p.id = s.user_id
      LEFT JOIN teachers t ON p.id = t.user_id
      LEFT JOIN classes c ON t.id = c.teacher_id
      WHERE p.id = auth.uid() AND (
        p.role = 'admin' OR
        s.id = attendance.student_id OR
        c.id = attendance.class_id
      )
    )
  );

CREATE POLICY "Teachers can manage attendance for their classes"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN teachers t ON p.id = t.user_id
      JOIN classes c ON t.id = c.teacher_id
      WHERE p.id = auth.uid() AND c.id = attendance.class_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Grades policies
CREATE POLICY "Users can read relevant grades"
  ON grades FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      LEFT JOIN students s ON p.id = s.user_id
      LEFT JOIN teachers t ON p.id = t.user_id
      LEFT JOIN classes c ON t.id = c.teacher_id
      WHERE p.id = auth.uid() AND (
        p.role = 'admin' OR
        s.id = grades.student_id OR
        c.id = grades.class_id
      )
    )
  );

CREATE POLICY "Teachers can manage grades for their classes"
  ON grades FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN teachers t ON p.id = t.user_id
      JOIN classes c ON t.id = c.teacher_id
      WHERE p.id = auth.uid() AND c.id = grades.class_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Announcements policies
CREATE POLICY "Everyone can read published announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    is_published = true AND
    (expire_date IS NULL OR expire_date > now()) AND
    (target_audience = 'all' OR
     EXISTS (
       SELECT 1 FROM profiles
       WHERE id = auth.uid() AND role::text = target_audience::text
     ))
  );

CREATE POLICY "Admins and teachers can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_grade_level ON students(grade_level);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_department ON teachers(department);
CREATE INDEX IF NOT EXISTS idx_courses_grade_level ON courses(grade_level);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_course_id ON classes(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_class_date ON attendance(student_id, class_id, date);
CREATE INDEX IF NOT EXISTS idx_grades_student_class ON grades(student_id, class_id);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published, publish_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();