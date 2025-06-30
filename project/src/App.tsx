import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ClipboardList,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Plus,
  BarChart3,
  User,
  Award,
  Clock,
  LogOut
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { supabase, Course, Announcement } from './lib/supabase';

interface Student {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  gpa: number;
  attendance: number;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  classes: number;
  experience: string;
}

interface CourseWithProgress extends Course {
  teacher: string;
  students: number;
  schedule: string;
  progress: number;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Emma Johnson', grade: '10th', avatar: '👩‍🎓', gpa: 3.8, attendance: 95 },
  { id: '2', name: 'Michael Chen', grade: '11th', avatar: '👨‍🎓', gpa: 3.9, attendance: 92 },
  { id: '3', name: 'Sarah Williams', grade: '9th', avatar: '👩‍🎓', gpa: 3.7, attendance: 98 },
  { id: '4', name: 'David Brown', grade: '12th', avatar: '👨‍🎓', gpa: 3.6, attendance: 89 },
];

const mockTeachers: Teacher[] = [
  { id: '1', name: 'Dr. Amanda Rodriguez', subject: 'Mathematics', avatar: '👩‍🏫', classes: 5, experience: '8 years' },
  { id: '2', name: 'Prof. James Wilson', subject: 'Physics', avatar: '👨‍🏫', classes: 4, experience: '12 years' },
  { id: '3', name: 'Ms. Lisa Parker', subject: 'English', avatar: '👩‍🏫', classes: 6, experience: '6 years' },
  { id: '4', name: 'Mr. Robert Kim', subject: 'Chemistry', avatar: '👨‍🏫', classes: 3, experience: '10 years' },
];

function App() {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 1248,
    totalTeachers: 84,
    activeCourses: 42,
    avgAttendance: 92.5
  });

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchAnnouncements();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .limit(10);

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          author:profiles(full_name)
        `)
        .eq('is_published', true)
        .order('publish_date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching announcements:', error);
      } else {
        setAnnouncements(data || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} loading={loading} />;
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name}! Here's what's happening at your school today.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+5.2% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.totalTeachers}</p>
              <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-3xl font-bold text-purple-600">{courses.length}</p>
              <p className="text-sm text-green-600 mt-1">+3.8% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-3xl font-bold text-orange-600">{stats.avgAttendance}%</p>
              <p className="text-sm text-green-600 mt-1">+1.2% from last month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    announcement.priority === 'high' ? 'bg-red-100' :
                    announcement.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Bell className={`w-4 h-4 ${
                      announcement.priority === 'high' ? 'text-red-600' :
                      announcement.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{announcement.content.substring(0, 100)}...</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(announcement.publish_date).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No announcements available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-3">
              <Plus className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Add New Student</span>
            </button>
            <button className="w-full text-left p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center space-x-3">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-900">Register Teacher</span>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-3">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Create Course</span>
            </button>
            <button className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors flex items-center space-x-3">
              <Bell className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Send Announcement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStudents.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-3xl">{student.avatar}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.grade} Grade</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">GPA</span>
                <span className="text-sm font-medium text-blue-600">{student.gpa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Attendance</span>
                <span className="text-sm font-medium text-green-600">{student.attendance}%</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Teacher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-3xl">{teacher.avatar}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-gray-600">{teacher.subject}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Classes</span>
                <span className="text-sm font-medium text-blue-600">{teacher.classes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Experience</span>
                <span className="text-sm font-medium text-emerald-600">{teacher.experience}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors text-sm font-medium">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Code: {course.course_code}</p>
                  <p className="text-sm text-gray-600">Department: {course.department}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {course.grade_level}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{course.description || 'No description available'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Credits: {course.credits}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    course.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors text-sm font-medium">
                Manage Course
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses available</p>
            <p className="text-gray-400 text-sm">Courses will appear here once they are added to the system</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'students':
        return renderStudents();
      case 'teachers':
        return renderTeachers();
      case 'courses':
        return renderCourses();
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">EduManage Pro</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{profile?.full_name}</span>
                <span className="text-xs text-gray-500 capitalize">({profile?.role})</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;