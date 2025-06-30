import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'teacher' | 'student' | 'parent'
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id?: string
  student_id: string
  grade_level: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  enrollment_date: string
  status: 'active' | 'inactive' | 'graduated'
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Teacher {
  id: string
  user_id?: string
  employee_id: string
  department: string
  specialization?: string
  hire_date: string
  qualification?: string
  experience_years: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Course {
  id: string
  course_code: string
  name: string
  description?: string
  credits: number
  grade_level: string
  department: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  course_id: string
  teacher_id?: string
  class_code: string
  semester: string
  academic_year: string
  schedule?: any
  room?: string
  max_students: number
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  course?: Course
  teacher?: Teacher
}

export interface Enrollment {
  id: string
  student_id: string
  class_id: string
  enrollment_date: string
  status: 'enrolled' | 'dropped' | 'completed'
  final_grade?: string
  created_at: string
  updated_at: string
  student?: Student
  class?: Class
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
  recorded_by?: string
  created_at: string
}

export interface Grade {
  id: string
  student_id: string
  class_id: string
  assignment_name: string
  assignment_type: 'homework' | 'quiz' | 'exam' | 'project' | 'participation'
  points_earned?: number
  points_possible: number
  grade_date: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  author_id?: string
  target_audience: 'all' | 'students' | 'teachers' | 'parents'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  is_published: boolean
  publish_date: string
  expire_date?: string
  created_at: string
  updated_at: string
  author?: Profile
}