import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Swal from 'sweetalert2';

function AddPost() {
  const [formData, setFormData] = useState({
    title: '',
    picture: '',
    content: '',
    category_id: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from sessionStorage
    const storedCategories = JSON.parse(sessionStorage.getItem('categories')) || [];
    setCategories(storedCategories);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Retrieve existing posts from sessionStorage
    const storedPosts = JSON.parse(sessionStorage.getItem('posts')) || [];
    const newPost = { ...formData, id: storedPosts.length + 1,created_at: new Date().toISOString() };
    
    // Save updated posts back to sessionStorage
    sessionStorage.setItem('posts', JSON.stringify([...storedPosts, newPost]));
    
    Swal.fire({
      icon: 'success',
      title: 'Post Created',
      html: `
        Title: ${formData.title}<br>
        Picture: ${formData.picture}<br>
        Content: ${formData.content}<br>
        Category: ${getCategoryName(formData.category_id)}
      `,
    });

    setFormData({ title: '', picture: '', content: '', category_id: '' });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id.toString() === categoryId);
    return category ? category.name : 'N/A';
  };

  const handleClear = () => {
    setFormData({ title: '', picture: '', content: '', category_id: '' });
  };

  return (
    <div className="w-900px shadow-md flex-row px-1 mt-5 items-center pt-2 pb-2 mb-2 justify-center rounded-lg ml-10 bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center hover:text-indigo-500">Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full p-1">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="picture" className="text-lg">Picture URL</label>
          <input type="text" id="picture" name="picture" value={formData.picture} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="content" className="text-lg">Content</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="category_id" className="text-lg">Category</label>
          <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} required className="border rounded-lg p-2">
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">Submit</button>
        <button type="button" onClick={handleClear} className="bg-indigo-500 text-white py-2 px-4 rounded-lg ml-3 hover:bg-indigo-600 transition duration-300">Clear</button>
      </form>
    </div>
  );
}

function Add() {
  return <AdminLayout Content={<AddPost />} />;
}

export default Add;
