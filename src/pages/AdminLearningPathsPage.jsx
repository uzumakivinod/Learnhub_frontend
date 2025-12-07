import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const AdminLearningPathsPage = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPath, setEditingPath] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAllPaths();
  }, []);

  const fetchAllPaths = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('learnhub_token');
      const response = await axios.get(`${API_URL}/learning-paths/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLearningPaths(response.data);
    } catch (error) {
      console.error('Error fetching paths:', error);
      alert('Failed to fetch learning paths');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pathId) => {
    if (!confirm('Are you sure you want to delete this learning path?')) return;

    try {
      const token = localStorage.getItem('learnhub_token');
      await axios.delete(`${API_URL}/learning-paths/${pathId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Learning path deleted successfully');
      fetchAllPaths();
    } catch (error) {
      console.error('Error deleting path:', error);
      alert('Failed to delete learning path');
    }
  };

  const handleEdit = (path) => {
    setEditingPath(path);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingPath(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Learning Paths Management</h1>
            <p className="text-gray-600">Create, edit, and manage learning paths</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Path
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-600 text-sm mb-2">Total Paths</h3>
            <p className="text-3xl font-bold text-gray-800">{learningPaths.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-600 text-sm mb-2">Active Paths</h3>
            <p className="text-3xl font-bold text-green-600">
              {learningPaths.filter(p => p.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-600 text-sm mb-2">Total Enrollments</h3>
            <p className="text-3xl font-bold text-blue-600">
              {learningPaths.reduce((sum, p) => sum + p.enrollmentCount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-600 text-sm mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-purple-600">
              {learningPaths.reduce((sum, p) => sum + p.totalCourses, 0)}
            </p>
          </div>
        </div>

        {/* Learning Paths Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Domain</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Difficulty</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Milestones</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Enrollments</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {learningPaths.map(path => (
                  <tr key={path._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-800">{path.title}</p>
                        <p className="text-sm text-gray-500">{path.duration?.weeks} weeks</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {path.domain}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                        path.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        path.difficulty === 'advanced' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {path.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-800">{path.milestones?.length || 0}</td>
                    <td className="py-4 px-6 text-gray-800">{path.enrollmentCount}</td>
                    <td className="py-4 px-6">
                      {path.isActive ? (
                        <span className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-4 h-4" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/learning-paths/${path._id}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(path)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(path._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <LearningPathModal
          path={editingPath}
          onClose={() => {
            setShowModal(false);
            setEditingPath(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingPath(null);
            fetchAllPaths();
          }}
        />
      )}
    </div>
  );
};

// Modal Component for Add/Edit
const LearningPathModal = ({ path, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(path || {
    title: '',
    domain: '',
    description: '',
    thumbnail: '',
    difficulty: 'beginner',
    duration: { weeks: 0, hours: 0 },
    prerequisites: [],
    careerOutcomes: [],
    milestones: [],
    isActive: true
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('learnhub_token');
      
      if (path) {
        // Update existing path
        await axios.put(`${API_URL}/learning-paths/${path._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Learning path updated successfully');
      } else {
        // Create new path
        await axios.post(`${API_URL}/learning-paths`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Learning path created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving path:', error);
      alert('Failed to save learning path: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const addPrerequisite = () => {
    setFormData({
      ...formData,
      prerequisites: [...(formData.prerequisites || []), '']
    });
  };

  const updatePrerequisite = (index, value) => {
    const newPrereqs = [...(formData.prerequisites || [])];
    newPrereqs[index] = value;
    setFormData({ ...formData, prerequisites: newPrereqs });
  };

  const removePrerequisite = (index) => {
    const newPrereqs = formData.prerequisites.filter((_, i) => i !== index);
    setFormData({ ...formData, prerequisites: newPrereqs });
  };

  const addCareerOutcome = () => {
    setFormData({
      ...formData,
      careerOutcomes: [...(formData.careerOutcomes || []), '']
    });
  };

  const updateCareerOutcome = (index, value) => {
    const newOutcomes = [...(formData.careerOutcomes || [])];
    newOutcomes[index] = value;
    setFormData({ ...formData, careerOutcomes: newOutcomes });
  };

  const removeCareerOutcome = (index) => {
    const newOutcomes = formData.careerOutcomes.filter((_, i) => i !== index);
    setFormData({ ...formData, careerOutcomes: newOutcomes });
  };

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...(formData.milestones || []), {
        title: '',
        description: '',
        order: (formData.milestones?.length || 0) + 1,
        courses: [],
        externalResources: [],
        practiceTasks: [],
        skills: [],
        completionCriteria: ''
      }]
    });
  };

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...(formData.milestones || [])];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: newMilestones });
  };

  const removeMilestone = (index) => {
    const newMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: newMilestones });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {path ? 'Edit Learning Path' : 'Create New Learning Path'}
          </h2>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(step => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Step {step}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Full Stack Web Developer"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain *</label>
                    <select
                      required
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Domain</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Mobile Development">Mobile Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
                    <select
                      required
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all-levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the learning path..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Weeks) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration?.weeks || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        duration: { ...formData.duration, weeks: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Hours *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration?.hours || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        duration: { ...formData.duration, hours: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Active (visible to users)</label>
                </div>
              </div>
            )}

            {/* Step 2: Prerequisites & Outcomes */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Prerequisites</label>
                    <button
                      type="button"
                      onClick={addPrerequisite}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      + Add Prerequisite
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.prerequisites?.map((prereq, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={prereq}
                          onChange={(e) => updatePrerequisite(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Basic programming knowledge"
                        />
                        <button
                          type="button"
                          onClick={() => removePrerequisite(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Career Outcomes</label>
                    <button
                      type="button"
                      onClick={addCareerOutcome}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      + Add Outcome
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.careerOutcomes?.map((outcome, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => updateCareerOutcome(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Full Stack Web Developer"
                        />
                        <button
                          type="button"
                          onClick={() => removeCareerOutcome(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Milestones */}
            {currentStep === 3 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Milestones</label>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    + Add Milestone
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.milestones?.map((milestone, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">Milestone {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Milestone title"
                        />
                        <textarea
                          rows="2"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Milestone description"
                        />
                        <input
                          type="text"
                          value={milestone.completionCriteria}
                          onChange={(e) => updateMilestone(index, 'completionCriteria', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Completion criteria"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {formData.milestones?.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No milestones added yet. Click "+ Add Milestone" to get started.</p>
                )}
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (path ? 'Update Path' : 'Create Path')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLearningPathsPage;