/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';
import { AuthToken } from '../../Api/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Loading from '../../layouts/Loading';


function UserAccountManager({ user, onUpdate, onDelete }) {
  const [updating, setUpdating] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  const handleUpdate = () => {
    Swal.fire({
      title: "Are you sure you want to update this user?",
      icon: "warning",
      html: `
        <p><b>Username</b>: ${updatedUser.name}</p>
        <p><b>Email</b>: ${updatedUser.email}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        onUpdate(updatedUser);
        setUpdating(false);
        Swal.fire("User Updated", "The account has been modified.", "success");
      },
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure you want to delete this user?",
      icon: "warning",
      html: `
        <p><b>Username</b>: ${user.name}</p>
        <p><b>Email</b>: ${user.email}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        onDelete(user.id);
        Swal.fire("User Deleted", "The account has been removed.", "success");
      },
    });
  };

  return (
    <>
      <tr className="shadow-md items-center p-2 mb-2 bg-white">
        <td className="border p-2">{user.name}</td>
        <td className="border p-2">{user.email}</td>
        <td className="border p-2">
          {user.email_verified_at ? user.email_verified_at : <FontAwesomeIcon className="text-red-600" icon={faTimes} />}
        </td>
        <td className="border p-2">{user.created_at}</td>
        <td className="border p-2">
          <FontAwesomeIcon className="text-indigo-500" icon={faEye} />
        </td>
        <td className="border p-2">
          <FontAwesomeIcon onClick={handleDelete} className="text-indigo-500 hover:cursor-pointer" icon={faTrash} />
        </td>
        <td className="border p-2">
          <FontAwesomeIcon onClick={() => setUpdating(true)} className="text-indigo-500 hover:cursor-pointer" icon={faPen} />
        </td>
      </tr>

      {updating && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-semibold mb-2">Update User</h2>
          <input
            type="text"
            placeholder="New Username"
            value={updatedUser.name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="New Email"
            value={updatedUser.email}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdate}>
            Save
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-3 rounded" onClick={() => setUpdating(false)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}

function Accounts() {
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    // Initialize sessionStorage with dummy data if empty
    const storedUsers = JSON.parse(sessionStorage.getItem("users")) || [];

    if (storedUsers.length === 0) {
      const dummyUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          email_verified_at: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          email_verified_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ];
      sessionStorage.setItem("users", JSON.stringify(dummyUsers));
      setUsersData(dummyUsers);
      setLoading(false);
    } else {
      setUsersData(storedUsers);
    }
  }, []);

  const updateUser = (updatedUser) => {
    const updatedUsers = usersData.map((user) => (user.id === updatedUser.id ? updatedUser : user));
    setUsersData(updatedUsers);
    sessionStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId) => {
    const updatedUsers = usersData.filter((user) => user.id !== userId);
    setUsersData(updatedUsers);
    sessionStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <AdminLayout>
    {loading ? (
      
      <Loading/>
    ) : (
      <div className="container mx-auto mt-8 px-10 bg-white pb-4">
        <div className="max-w-screen-lg">
          <h1 className="text-3xl font-bold mb-4">User Accounts</h1>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Verification</th>
                <th className="border p-2">Join Date</th>
                <th className="border p-2">View</th>
                <th className="border p-2">Delete</th>
                <th className="border p-2">Modify</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {usersData.map((user) => (
                <UserAccountManager key={user.id} user={user} onUpdate={updateUser} onDelete={deleteUser} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
    </AdminLayout>
  );
}

export default Accounts;