// components/student/LibraryAnalytics.jsx
import React from 'react';

const LibraryAnalytics = () => {
  const readingStats = [
    { month: 'Jan', books: 4 },
    { month: 'Feb', books: 6 },
    { month: 'Mar', books: 5 },
    { month: 'Apr', books: 8 },
    { month: 'May', books: 7 },
    { month: 'Jun', books: 9 },
  ];

  const categoryDistribution = [
    { category: 'Computer Science', percentage: 40, color: 'bg-blue-500' },
    { category: 'Programming', percentage: 25, color: 'bg-green-500' },
    { category: 'Software Eng', percentage: 15, color: 'bg-purple-500' },
    { category: 'Databases', percentage: 10, color: 'bg-amber-500' },
    { category: 'Others', percentage: 10, color: 'bg-gray-500' },
  ];

  const achievements = [
    { title: 'Avid Reader', description: 'Read 20+ books', achieved: true },
    { title: 'Early Bird', description: 'Borrow 5 books before due', achieved: true },
    { title: 'Scholar', description: 'Read books from 5+ categories', achieved: false },
    { title: 'Bookworm', description: 'Read 50+ books total', achieved: false },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Library Analytics</h2>
          <p className="text-gray-600">Track your reading habits and library usage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reading Trends */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Reading Trends</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-end h-40 space-x-2 mb-4">
                {readingStats.map((stat, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-8 bg-blue-500 rounded-t-lg"
                      style={{ height: `${(stat.books / 10) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{stat.month}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Books read per month (Last 6 months)
              </p>
            </div>
          </div>

          {/* Category Distribution */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Category Distribution</h3>
            <div className="space-y-3">
              {categoryDistribution.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-900 mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${achievement.achieved ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg ${achievement.achieved ? 'text-green-600' : 'text-gray-400'}`}>
                    {achievement.achieved ? '🏆' : '🔒'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${achievement.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {achievement.achieved ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-blue-600 mb-1">Total Books Read</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-green-600 mb-1">Avg Reading Time</p>
            <p className="text-2xl font-bold text-gray-900">2.5h</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm text-purple-600 mb-1">Favorite Category</p>
            <p className="text-2xl font-bold text-gray-900">CS</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <p className="text-sm text-amber-600 mb-1">Reading Streak</p>
            <p className="text-2xl font-bold text-gray-900">14 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryAnalytics;