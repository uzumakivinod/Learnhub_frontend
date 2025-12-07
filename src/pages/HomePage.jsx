import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { courses } = useCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24 px-6">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-16 h-16 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Learn Everything —All Free Courses in One Place
</h1>
<p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
We bring you the most valuable courses from top providers like Google, Coursera, and more — completely free.
</p>
<button
onClick={() => navigate('/courses')}
className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-2xl"
>
Explore Courses <Sparkles className="inline ml-2 w-5 h-5" />
</button>
</div>
</div>
{/* About Section */}
  <div className="max-w-6xl mx-auto px-6 py-20">
    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
      <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
        Education should be accessible to everyone. We have curated the best free courses from leading platforms worldwide, 
        making quality education just a click away. Whether you are starting your tech journey or advancing your skills, 
        we have got you covered with courses in AI, Web Development, Cybersecurity, Data Science, and more.
      </p>
    </div>
  </div>

  {/* Featured Courses */}
  <div className="py-16 bg-gradient-to-r from-purple-100 to-blue-100">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Featured Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice(0, 6).map((course) => (
          <CourseCard key={course._id || course.id} course={course} />
        ))}
      </div>
    </div>
  </div>
</div>
);
}

export default HomePage;

