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
  }, []); // Empty dependency array to run only on mount

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:1337/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchCourses = async (token) => {
    setLoading(true);
    try {
      const url = user && user.role && ['Student', 'Social Media Manager/Developer'].includes(user.role.name)
        ? 'http://localhost:1337/api/courses?populate=*'
        : 'http://localhost:1337/api/courses';
      console.log('Fetching from:', url);
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    localStorage.setItem('token', token); // Ensure token is consistent
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
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
        <p className="mb-4">Role: {user.role ? user.role.name : 'Normal User'}</p>
        <button
          onClick={handleLogout}
          className="mb-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>

        {loading && <p className="text-center">Loading courses...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Courses</h2>
            {courses.length === 0 ? (
              <p>No courses available.</p>
            ) : (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <li key={course.id} className="border p-4 rounded-md">
                    {course.attributes && user.role && ['Student', 'Social Media Manager/Developer'].includes(user.role.name) ? (
                      <>
                        <h3 className="text-lg font-medium">{course.attributes.Title}</h3>
                        <p className="text-gray-600">
                          {course.attributes.Description?.[0]?.children?.[0]?.text || 'No description'}
                        </p>
                        <h4 className="mt-2 font-medium">Modules:</h4>
                        <ul className="ml-4 list-disc">
                          {course.attributes.modules && course.attributes.modules.data && course.attributes.modules.data.map((module) => (
                            <li key={module.id}>
                              {module.attributes.Name} - {module.attributes.NumberOfClasses} classes
                              <p className="text-sm text-gray-500">{module.attributes.Details}</p>
                            </li>
                          )) || <p>No modules available</p>}
                        </ul>
                      </>
                    ) : (
                      <p className="text-gray-600">
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