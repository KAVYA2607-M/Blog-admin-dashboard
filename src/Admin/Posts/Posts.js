import AdminLayout from "../../layouts/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faFilter, faEye, faHeart, faComments, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../layouts/Loading";

function PostsData({ postsData, currentPage, itemsPerPage, setPostsData }) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const postsToDisplay = postsData.slice(startIndex, endIndex);

  const handleDelete = (postId) => {
    const storedPosts = JSON.parse(sessionStorage.getItem("posts")) || [];
    const postData = storedPosts.find(post => post.id === postId);

    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to delete this post?',
      html: `
        <div>ID: ${postData.id}</div>
        <div>Picture: <img style="width:200px;height:100px" src="${postData.picture}" alt="Post Image" /></div>
        <div>Title: ${postData.title}</div>
        <div>Created At: ${postData.created_at}</div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedPosts = storedPosts.filter(post => post.id !== postId);
        sessionStorage.setItem("posts", JSON.stringify(updatedPosts));
        setPostsData(updatedPosts);
        Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2">Picture</th>
              <th className="py-2">Title</th>
              <th className="py-2">Category</th>
              <th className="py-2">Likes</th>
              <th className="py-2">Comments</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {postsToDisplay.map(post => (
              <tr key={post.id} className="text-center border-b">
                <td className="py-2"><img className="w-20 mx-auto" src={post.picture} alt={post.title} /></td>
                <td className="py-2 truncate">{post.title}</td>
                <td className="py-2">{post.category_name}</td>
                <td className="py-2"><FontAwesomeIcon className="text-red-500" icon={faHeart} /> {post.likes}</td>
                <td className="py-2"><FontAwesomeIcon className="text-blue-500" icon={faComments} /> {post.comment_count}</td>
                <td className="py-2 flex justify-around">
                  <Link to={`/Admin/Posts/${post.id}`}><FontAwesomeIcon className="text-green-500" icon={faEye} /></Link>
                  <FontAwesomeIcon onClick={() => handleDelete(post.id)} className="text-red-500 cursor-pointer" icon={faTrash} />
                  <Link to={`/Admin/Posts/Update/${post.id}`}><FontAwesomeIcon className="text-yellow-500" icon={faPen} /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [postsData, setPostsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("default");

  useEffect(() => {
    const storedPosts = JSON.parse(sessionStorage.getItem("posts")) || [];
    setPostsData(storedPosts);
    setLoading(false);
  }, []);

  const filteredPosts = postsData.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSort = (e) => {
    setSelectedSort(e.target.value);
    setPostsData(prev => [...prev].sort((a, b) => {
      switch (e.target.value) {
        case "newest": return new Date(b.created_at) - new Date(a.created_at);
        case "oldest": return new Date(a.created_at) - new Date(b.created_at);
        case "likes": return b.likes - a.likes;
        case "comments": return b.comment_count - a.comment_count;
        default: return 0;
      }
    }));
  };

  return (
    <AdminLayout Content={
      loading ? <Loading /> : (
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <Link to="/Admin/Post/New" className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600">
              <FontAwesomeIcon icon={faPlus} /> New Post
            </Link>
            <input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="outline-none bg-transparent border rounded-lg px-4 py-2" />
            <select value={selectedSort} onChange={handleSort} className="outline-none bg-transparent border rounded-lg px-4 py-2">
              <option value="default">Default</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="likes">Likes</option>
              <option value="comments">Comments</option>
            </select>
          </div>
          <PostsData postsData={filteredPosts} currentPage={currentPage} itemsPerPage={itemsPerPage} setPostsData={setPostsData} />
        </div>
      )
    } />
  );
}

export default Posts;