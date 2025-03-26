import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../layouts/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

function Categories() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCategories = sessionStorage.getItem('categories');
    if (storedCategories) {
      setCategoriesData(JSON.parse(storedCategories));
      setLoading(false);
    } else {
      setLoading(false); // No initial data, stop loading
    }
  }, []);

  const updateSessionStorage = (data) => {
    sessionStorage.setItem('categories', JSON.stringify(data));
    setCategoriesData(data);
  };

  const AddCategory = () => {
    Swal.fire({
      title: 'Add new Category',
      html:
        '<input id="categoryName" class="swal2-input" placeholder="Category Name">' +
        '<input id="categoryDescription" class="swal2-input" placeholder="Category Description">',
      showCancelButton: true,
      confirmButtonText: 'Add',
    }).then((result) => {
      if (result.isConfirmed) {
        const categoryName = document.getElementById('categoryName').value;
        const categoryDescription = document.getElementById('categoryDescription').value;
        const newCategory = {
          id: Date.now(), // Unique ID
          name: categoryName,
          description: categoryDescription,
        };
        const updatedCategories = [...categoriesData, newCategory];
        updateSessionStorage(updatedCategories);
        Swal.fire('Category Added', 'The new category has been added.', 'success');
      }
    });
  };

  const DeleteCategory = (category) => {
    Swal.fire({
      title: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCategories = categoriesData.filter((c) => c.id !== category.id);
        updateSessionStorage(updatedCategories);
        Swal.fire('Category Deleted', 'The category has been deleted.', 'success');
      }
    });
  };

  const UpdateCategory = (category) => {
    Swal.fire({
      title: 'Update Category',
      html: `
        <input id="swal-input1" class="swal2-input" value="${category.name}">
        <input id="swal-input2" class="swal2-input" value="${category.description}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedName = document.getElementById('swal-input1').value;
        const updatedDescription = document.getElementById('swal-input2').value;
        const updatedCategories = categoriesData.map((c) =>
          c.id === category.id ? { ...c, name: updatedName, description: updatedDescription } : c
        );
        updateSessionStorage(updatedCategories);
        Swal.fire('Category Updated', 'The category has been updated.', 'success');
      }
    });
  };

  return (
    <AdminLayout
      Content={
        loading ? (
          <Loading />
        ) : (
          <div className="shadow-md px-4 mt-2 pt-2 pb-2 mb-2 rounded-lg bg-white">
            <div className="flex flex-row m-4">
              <button onClick={AddCategory} className="border bg-white p-2 rounded-lg shadow-md cursor-pointer">
                <FontAwesomeIcon icon={faPlus} className="text-indigo-500 p-2" /> New category
              </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delete</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modify</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoriesData.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-3 truncate">{category.name}</td>
                    <td className="px-6 py-3 truncate">{category.description}</td>
                    <td className="px-6 py-3 cursor-pointer text-red-500" onClick={() => DeleteCategory(category)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </td>
                    <td className="px-6 py-3 cursor-pointer text-blue-500" onClick={() => UpdateCategory(category)}>
                      <FontAwesomeIcon icon={faPen} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    />
  );
}

export default Categories;
