import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Loading from "../../layouts/Loading";

function View() {
  const { id } = useParams();
  return <AdminLayout Content={<Getpost postId={id} />} />;
}

function Getpost({ postId }) {
 
  if(postId){
    postId = parseInt(postId);
  }
 
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    // Fetch post data from sessionStorage
    const storedPosts = JSON.parse(sessionStorage.getItem("posts")) || [];
    const foundPost = storedPosts.find(post => post.id === postId);
    console.log(storedPosts,postId,foundPost);
    if (foundPost) {
      setPostData(foundPost);
    }
    setLoading(false);
  }, [postId]);

  const handleDeleteComment = (commentId) => {
    if (!postData) return;
    
    const commentToDelete = postData.comments.find(comment => comment.id === commentId);
    if (!commentToDelete) return;
    
    Swal.fire({
      title: "Delete Comment",
      text: "Are you sure you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      html: `
        <p><strong>Username:</strong> ${commentToDelete.username}</p>
        <p><strong>Comment Body:</strong> ${commentToDelete.body}</p>
        <p><strong>Created At:</strong> ${commentToDelete.created_at}</p>
      `,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedComments = postData.comments.filter(comment => comment.id !== commentId);
        const updatedPost = { ...postData, comments: updatedComments };
        
        // Update sessionStorage
        const storedPosts = JSON.parse(sessionStorage.getItem("posts")) || [];
        const updatedPosts = storedPosts.map(post =>
          post.id === postId ? updatedPost : post
        );
        sessionStorage.setItem("posts", JSON.stringify(updatedPosts));
        
        setPostData(updatedPost);
        Swal.fire("Deleted", "Comment has been removed.", "success");
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : postData ? (
        <div className="shadow-md px-5 py-2 rounded-lg bg-white">
          <h1 className="text-2xl font-semibold">Title: {postData.title}</h1>
          <img src={postData.picture} alt="Post" className="w-2/3 h-auto" />
          <div><span className="text-gray-600">Created at:</span> {postData.created_at}</div>
          <div><span className="text-gray-600">Updated at:</span> {postData.updated_at}</div>
          <div><span className="text-gray-600">Likes:</span> {postData.likes}</div>
          <div><span className="text-gray-600">Category:</span> {postData.category}</div>
          <div>{postData.content}</div>
           
        </div>
      ) : (
        <div className="text-red-500">Post not found</div>
      )}
    </>
  );
}

export default View;
