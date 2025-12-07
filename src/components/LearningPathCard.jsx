import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Award, TrendingUp, Users } from 'lucide-react';

const LearningPathCard = ({ path }) => {
  const navigate = useNavigate();

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
    'all-levels': 'bg-blue-100 text-blue-700'
  };

  const difficultyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    'all-levels': 'All Levels'
  };

  return (
    <div 
      onClick={() => navigate(`/learning-paths/${path._id}`)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={path.thumbnail} 
          alt={path.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[path.difficulty]}`}>
            {difficultyLabels[path.difficulty]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-semibold">
            {path.domain}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{path.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{path.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{path.duration?.weeks} weeks</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>{path.milestones?.length} milestones</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>{path.totalCourses} courses</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-pink-500" />
            <span>{path.enrollmentCount} enrolled</span>
          </div>
        </div>

        {/* Career Outcomes */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">Career Outcomes:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {path.careerOutcomes?.slice(0, 2).map((outcome, idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs">
                {outcome}
              </span>
            ))}
            {path.careerOutcomes?.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{path.careerOutcomes.length - 2} more
              </span>
            )}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          View Path Details →
        </button>
      </div>
    </div>
  );
};

export default LearningPathCard;