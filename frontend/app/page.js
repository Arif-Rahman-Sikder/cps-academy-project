'use client';

import { useState, useEffect } from 'react';
import Auth from '../components/Auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser && !user) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCourses(token);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:1337/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        console.log('Fetched user data:', data); // Debug user data
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchCourses = async (token) => {
    setLoading(true);
    try {
      const url = user && user.username && ['Student', 'Social Media Manager/Developer'].includes(user.username)
        ? 'http://localhost:1337/api/courses?populate=*'
        : 'http://localhost:1337/api/courses';
      console.log('Fetch URL:', url); // Debug URL
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Response status:', response.status); // Debug status
      const data = await response.json();
      console.log('API Response:', data);
      if (data.data && Array.isArray(data.data)) {
        setCourses(data.data);
      } else if (data.data && !Array.isArray(data.data)) {
        setCourses([data.data]);
      } else {
        setError('No courses data received or permission denied');
      }
    } catch (err) {
      setError('An error occurred while fetching courses');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    const token = localStorage.getItem('token') || '';
    localStorage.setItem('token', token);
    setUser(userData);
    fetchCourses(token);
    fetchUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCourses([]);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-300 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-gray-50 shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 sm:text-3xl">Welcome, {user.username || 'Guest'}!</h1>
        <p className="mb-4 text-gray-900 sm:text-lg">Role: {user.username || 'Normal User'}</p>
        <button
          onClick={handleLogout}
          className="mb-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 sm:py-2.5 sm:px-6"
        >
          Logout
        </button>

        {loading && <p className="text-center text-gray-900">Loading courses...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 sm:text-2xl">Courses</h2>
            {courses.length === 0 ? (
              <p className="text-gray-900">No courses available.</p>
            ) : (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <li key={course.id} className="border p-4 rounded-md sm:p-5">
                    {course.attributes && user.username && ['Student', 'Social Media Manager/Developer'].includes(user.username) ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 sm:text-xl">{course.attributes.Title}</h3>
                        <p className="text-gray-800 sm:text-base">
                          {course.attributes.Description?.[0]?.children?.[0]?.text || 'No description'}
                        </p>
                        <h4 className="mt-2 font-medium text-gray-900 sm:text-lg">Modules:</h4>
                        <ul className="ml-4 list-disc sm:ml-6">
                          {course.attributes.modules && course.attributes.modules.data && course.attributes.modules.data.map((module) => (
                            <li key={module.id} className="sm:text-base">
                              {module.attributes.Name} - {module.attributes.NumberOfClasses} classes
                              <p className="text-sm text-gray-800 sm:text-base">{module.attributes.Details}</p>
                            </li>
                          )) || <p className="text-gray-900">No modules available</p>}
                        </ul>
                      </>
                    ) : (
                      <p className="text-gray-800 sm:text-base">
                        {course.attributes?.Title ? `${course.attributes.Title} - Summary available only.` : 'Course data unavailable.'}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}