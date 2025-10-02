import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../configs/api';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  useEffect(() => {
    setUsersLoading(true);
    setUsersError('');
    AdminAPI.getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => setUsersError('Failed to fetch users'))
      .finally(() => setUsersLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">All Users</h2>
      {usersLoading ? (
        <div className="text-gray-500">Loading users...</div>
      ) : usersError ? (
        <div className="text-red-500">{usersError}</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Phone</th>
                <th className="border px-2 py-1">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-2 py-1">{user.fullName || user.username || '-'}</td>
                  <td className="border px-2 py-1">{user.email}</td>
                  <td className="border px-2 py-1">{user.phone}</td>
                  <td className="border px-2 py-1">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
