import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, BookOpen, Award, TrendingUp, CheckCircle, 
  Circle, Lock, Play, ExternalLink, FileText, Code, Users,
  Target, Sparkles
} from 'lucide-react';
import { useLearningPaths } from '../context/LearningPathContext';
import { useAuth } from '../context/AuthContext';

const LearningPathDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getPathDetails, enrollInPath, updateProgress } = useLearningPaths();
  
  const [pathData, setPathData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPathData();
  }, [id]);

  const loadPathData = async () => {
    setLoading(true);
    const token = user ? localStorage.getItem('learnhub_token') : null;
    const result = await getPathDetails(id, token);
    
    if (result.success) {
      setPathData(result.data.path);
      setUserProgress(result.data.userProgress);
    }
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!user) {
      // Open login modal
      alert('Please login to enroll in this learning path');
      return;
    }

    setEnrolling(true);
    const token = localStorage.getItem('learnhub_token');
    const result = await enrollInPath(id, token);
    
    if (result.success) {
      alert('Successfully enrolled! Start your learning journey now.');
      await loadPathData();
    } else {
      alert(result.message);
    }
    setEnrolling(false);
  };

  const handleMarkCourseComplete = async (milestoneId, courseId) => {
    if (!user || !userProgress) return;

    const token = localStorage.getItem('learnhub_token');
    const result = await updateProgress(id, {
      milestoneId,
      courseId,
      action: 'complete-course'
    }, token);

    if (result.success) {
      await loadPathData();
    } else {
      alert('Failed to update progress');
    }
  };

  const handleMarkTaskComplete = async (milestoneId, taskTitle) => {
    if (!user || !userProgress) return;

    const token = localStorage.getItem('learnhub_token');
    const result = await updateProgress(id, {
      milestoneId,
      taskTitle,
      action: 'complete-task'
    }, token);

    if (result.success) {
      await loadPathData();
    } else {
      alert('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading learning path...</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Learning Path Not Found</h2>
          <button
            onClick={() => navigate('/learning-paths')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Learning Paths
          </button>
        </div>
      </div>
    );
  }

  const isEnrolled = !!userProgress;
  const currentMilestoneIndex = userProgress?.currentMilestone || 0;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
    'all-levels': 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/learning-paths')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learning Paths
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {pathData.domain}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[pathData.difficulty]}`}>
                  {pathData.difficulty.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{pathData.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{pathData.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{pathData.duration?.weeks} weeks · {pathData.duration?.hours} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{pathData.milestones?.length} milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{pathData.totalCourses} courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{pathData.enrollmentCount} enrolled</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              {isEnrolled ? (
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span className="font-bold">{userProgress.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-white h-3 rounded-full transition-all duration-500"
                        style={{ width: `${userProgress.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100 mb-2">
                    Current: Milestone {currentMilestoneIndex + 1} of {pathData.milestones.length}
                  </p>
                  <p className="text-xs text-blue-200 mb-4">
                    {pathData.milestones[currentMilestoneIndex]?.title}
                  </p>
                  <button
                    onClick={() => setActiveTab('milestones')}
                    className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Continue Learning
                  </button>
                </div>
              ) : (
                <div>
                  <Sparkles className="w-12 h-12 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold mb-4 text-center">Ready to Start?</h3>
                  <p className="text-blue-100 text-sm mb-6 text-center">
                    Enroll now and begin your journey to becoming a professional.
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {enrolling ? 'Enrolling...' : (
                      <>
                        <Target className="w-5 h-5" />
                        Enroll Now - Free
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b overflow-x-auto">
            {['overview', 'milestones', 'outcomes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prerequisites</h2>
                <ul className="list-disc list-inside space-y-2 mb-8">
                  {pathData.prerequisites?.map((prereq, idx) => (
                    <li key={idx} className="text-gray-600">{prereq}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {pathData.milestones?.map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div className="space-y-6">
                {pathData.milestones?.map((milestone, idx) => {
                  const milestoneProgress = userProgress?.milestoneProgress?.[idx];
                  const isUnlocked = !isEnrolled || idx === 0 || userProgress?.milestoneProgress?.[idx - 1]?.isCompleted;
                  const isCompleted = milestoneProgress?.isCompleted;
                  const isCurrent = idx === currentMilestoneIndex;

                  return (
                    <div 
                      key={idx}
                      className={`border rounded-xl p-6 transition-all ${
                        isCompleted ? 'bg-green-50 border-green-200' :
                        isCurrent ? 'bg-blue-50 border-blue-200' :
                        'bg-white border-gray-200'
                      }`}
                    >
                      {/* Milestone Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          {isCompleted ? (
                            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                          ) : isUnlocked ? (
                            <Play className="w-8 h-8 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Lock className="w-8 h-8 text-gray-400 flex-shrink-0" />
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                            <p className="text-gray-600">{milestone.description}</p>
                            {milestone.completionCriteria && (
                              <p className="text-sm text-blue-600 mt-2">
                                <strong>Completion:</strong> {milestone.completionCriteria}
                              </p>
                            )}
                          </div>
                        </div>
                        {isEnrolled && milestoneProgress && (
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">
                              {milestoneProgress.completedCourses?.length || 0} / {milestone.courses?.length || 0} courses
                            </p>
                            <p className="text-xs text-gray-500">
                              {milestoneProgress.completedTasks?.length || 0} / {milestone.practiceTasks?.length || 0} tasks
                            </p>
                          </div>
                        )}
                      </div>

                      {isUnlocked && (
                        <div className="mt-4 space-y-6">
                          {/* Courses Section */}
                          {milestone.courses?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Courses ({milestone.courses.length})
                              </h4>
                              <div className="space-y-3">
                                {milestone.courses.map((course, courseIdx) => {
                                  const isCourseCompleted = milestoneProgress?.completedCourses?.some(
                                    c => c.courseId === course._id || c.courseId === course.courseName
                                  );
                                  return (
                                    <div 
                                      key={courseIdx}
                                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                                        isCourseCompleted ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        {isEnrolled && (
                                          <button
                                            onClick={() => handleMarkCourseComplete(milestone._id, course.courseName)}
                                            className="flex-shrink-0"
                                          >
                                            {isCourseCompleted ? (
                                              <CheckCircle className="w-6 h-6 text-green-500" />
                                            ) : (
                                              <Circle className="w-6 h-6 text-gray-300 hover:text-blue-500 transition-colors" />
                                            )}
                                          </button>
                                        )}
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{course.courseName}</p>
                                          <div className="flex items-center gap-4 mt-1">
                                            <p className="text-sm text-gray-500">{course.estimatedHours} hours</p>
                                            {course.isRequired && (
                                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                        <a href={course.courseLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold ml-4"
                                      >
                                        Start Course
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Practice Tasks Section */}
                          {milestone.practiceTasks?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Code className="w-5 h-5 text-purple-600" />
                                Practice Tasks ({milestone.practiceTasks.length})
                              </h4>
                              <div className="space-y-3">
                                {milestone.practiceTasks.map((task, taskIdx) => {
                                  const isTaskCompleted = milestoneProgress?.completedTasks?.some(
                                    t => t.taskTitle === task.title
                                  );
                                  return (
                                    <div 
                                      key={taskIdx}
                                      className={`p-4 rounded-lg transition-all ${
                                        isTaskCompleted ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        {isEnrolled && (
                                          <button
                                            onClick={() => handleMarkTaskComplete(milestone._id, task.title)}
                                            className="flex-shrink-0 mt-1"
                                          >
                                            {isTaskCompleted ? (
                                              <CheckCircle className="w-6 h-6 text-green-500" />
                                            ) : (
                                              <Circle className="w-6 h-6 text-gray-300 hover:text-purple-500 transition-colors" />
                                            )}
                                          </button>
                                        )}
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-gray-800">{task.title}</p>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                              task.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                              task.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                              'bg-red-100 text-red-700'
                                            }`}>
                                              {task.difficulty}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                          <p className="text-xs text-gray-500">
                                            <Clock className="w-3 h-3 inline mr-1" />
                                            Estimated: {task.estimatedHours} hours
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* External Resources Section */}
                          {milestone.externalResources?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                Resources ({milestone.externalResources.length})
                              </h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                {milestone.externalResources.map((resource, resIdx) => (
                                  
                                   <a key={resIdx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-800 text-sm">{resource.title}</p>
                                      <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills Section */}
                          {milestone.skills?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Skills You'll Gain</h4>
                              <div className="flex flex-wrap gap-2">
                                {milestone.skills.map((skill, skillIdx) => (
                                  <span 
                                    key={skillIdx}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {!isUnlocked && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium">Complete previous milestone to unlock</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Outcomes Tab */}
            {activeTab === 'outcomes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Outcomes</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {pathData.careerOutcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-shadow">
                      <Award className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">{outcome}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Skills You'll Master
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pathData.milestones?.flatMap(m => m.skills || [])
                      .filter((skill, index, self) => self.indexOf(skill) === index)
                      .map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-semibold shadow-sm">
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Why This Path?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Structured curriculum designed by industry experts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Hands-on projects to build your portfolio</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Clear progression from beginner to job-ready</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Access to top-quality free resources</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        {!isEnrolled && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join {pathData.enrollmentCount} learners already on this path. Start learning today and achieve your career goals.
            </p>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {enrolling ? 'Enrolling...' : (
                <>
                  <Target className="w-6 h-6" />
                  Enroll Now - It's Free!
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathDetailPage;