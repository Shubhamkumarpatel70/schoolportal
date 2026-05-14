import React, { useState } from "react";
import axios from "axios";
import { FiUsers, FiEdit, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";

const UserManagement = ({ 
  users, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFilters, setUserFilters] = useState({ role: "", search: "" });
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "student",
  });

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${editingUser._id}`, userForm);
      setShowUserForm(false);
      setEditingUser(null);
      fetchDashboardData();
      alert("User updated successfully!");
    } catch (error) {
      alert("Error updating user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "student",
    });
    setShowUserForm(true);
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}/role`, { role: newRole });
      fetchDashboardData();
      alert("Role updated successfully!");
    } catch (error) {
      alert("Error updating role");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (userFilters.role && u.role !== userFilters.role) return false;
    if (userFilters.search) {
      const searchTerm = userFilters.search.toLowerCase();
      return (
        u.name?.toLowerCase().includes(searchTerm) ||
        u.email?.toLowerCase().includes(searchTerm) ||
        u.phone?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Manage Users</h2>
      </div>

      <div className="bg-neutral-2 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-3 mb-4">Filter Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={userFilters.role} onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="accountant">Accountant</option>
            <option value="librarian">Librarian</option>
            <option value="receptionist">Receptionist</option>
          </select>
          <input type="text" placeholder="Search by name, email, or phone" value={userFilters.search} onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => setUserFilters({ role: "", search: "" })} className="px-4 py-2 bg-neutral-1 text-neutral-3 rounded-lg hover:bg-neutral-1/80 transition text-sm">Clear Filters</button>
        </div>
      </div>

      {showUserForm && (
        <form onSubmit={handleSubmitUser} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-3 mb-4">Edit User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required className="px-4 py-2 border rounded-lg" placeholder="Name" />
            <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required className="px-4 py-2 border rounded-lg" placeholder="Email" />
            <input type="tel" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} className="px-4 py-2 border rounded-lg" placeholder="Phone" />
            <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} required className="px-4 py-2 border rounded-lg">
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="accountant">Accountant</option>
              <option value="librarian">Librarian</option>
              <option value="receptionist">Receptionist</option>
            </select>
            <input type="text" value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} className="px-4 py-2 border rounded-lg md:col-span-2" placeholder="Address" />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Update User</button>
            <button type="button" onClick={() => setShowUserForm(false)} className="bg-neutral-1 text-neutral-3 px-6 py-2 rounded-lg font-semibold">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-neutral-3/50 italic">No users found</td></tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b border-neutral-1 hover:bg-neutral-1/30 transition">
                    <td className="px-4 py-3 text-neutral-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-neutral-3 text-xs">{u.staffId || u.studentId || "N/A"}</td>
                    <td className="px-4 py-3 text-neutral-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.role === "admin" ? "bg-purple-100 text-purple-800" :
                        u.role === "student" ? "bg-blue-100 text-blue-800" :
                        u.role === "teacher" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEditUser(u)} className="text-secondary hover:text-secondary-600 p-1"><FiEdit /></button>
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                          className="text-xs border rounded px-1 py-0.5 bg-white"
                        >
                          <option value="admin">Admin</option>
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="accountant">Accountant</option>
                          <option value="librarian">Librarian</option>
                          <option value="receptionist">Receptionist</option>
                        </select>
                        <button onClick={() => handleDelete("user", u._id)} className="text-red-600 hover:text-red-700 p-1"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
