import AdminLayout from "../../layouts/AdminLayout";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../layouts/Loading";

function Getpost() {
    const { id } = useParams();
    const postId = id;

    // Retrieve stored posts and categories from sessionStorage
    const storedPosts = JSON.parse(sessionStorage.getItem("posts")) || [];
    const storedCategories = JSON.parse(sessionStorage.getItem("categories")) || [];

    // Find the specific post based on postId
    const existingPost = storedPosts.find(post => post.id == postId) || {};

    const [postData, setPostData] = useState(existingPost);
    const [categories, setCategories] = useState(storedCategories);
    const [loading, setLoading] = useState(!existingPost.title);
    const [formData, setFormData] = useState({
        title: existingPost.title || "",
        picture: existingPost.picture || "",
        content: existingPost.content || "",
        category: existingPost.category || "",
    });

    useEffect(() => {
        if (!postData.title) {
            setPostData(existingPost);
            setFormData({
                title: existingPost.title || "",
                picture: existingPost.picture || "",
                content: existingPost.content || "",
                category: existingPost.category || "",
            });
            setLoading(false);
        }
    }, [postId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: "question",
            title: "Are you sure you want to update this post?",
            html: `
              New Title: ${formData.title}<br>
              New Picture: ${formData.picture}<br>
              New Content: ${formData.content}<br>
              New Category: ${formData.category}
            `,
            showCancelButton: true,
            confirmButtonText: "Yes, Update",
            confirmButtonColor: "#F53D65",
        }).then((result) => {
            if (result.isConfirmed) {
                // Update the stored posts
                const updatedPosts = storedPosts.map((post) =>
                    post.id == postId ? { ...post, ...formData, updated_at: new Date().toISOString() } : post
                );
                sessionStorage.setItem("posts", JSON.stringify(updatedPosts));

                setPostData({ ...postData, ...formData, updated_at: new Date().toISOString() });
                Swal.fire("Updated!", "Your post has been updated.", "success");
            }
        });
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="shadow-md flex-row px-1 items-center mt-5 pl-5 pt-2 pb-2 mb-2 justify-center rounded-lg ml-10 bg-white">
                    <form onSubmit={handleUpdate}>
                        <h1 className="mt-2 mb-2 text-2xl font-semibold">
                            Title: <input type="text" name="title" className="border-current" value={formData.title} onChange={handleChange} />
                        </h1>
                        <div className="w-2/3">
                            <div>
                                Picture URL: <input type="text" name="picture" value={formData.picture} onChange={handleChange} />
                            </div>
                            <img src={postData.picture} alt="" className="w-full h-auto" />
                        </div>
                        <div className="mt-2 mb-2 max-w-2xl">
                            <span className="text-gray-600">Created at: </span>{postData.created_at}
                        </div>
                        <div className="mt-2 mb-2 max-w-2xl">
                            <span className="text-gray-600">Updated at: </span>{postData.updated_at}
                        </div>
                        <div className="mt-2 mb-2 max-w-2xl">
                            <span className="text-gray-600">Likes: </span> {postData.likes}
                        </div>
                        <div className="mt-2 mb-2 max-w-2xl">
                            <span className="text-gray-600">Category: </span>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-2 mb-2 max-w-2xl">
                            <textarea value={formData.content} name="content" cols={60} rows={15} onChange={handleChange}></textarea>
                        </div>
                        {/* Check if comments are available */}
                        {postData.comments && postData.comments.length === 0 ? (
                            <div className="mt-2 mb-2 max-w-2xl text-red-500 text-lg font-bold">
                                No Comments on this post
                            </div>
                        ) : (
                            <>
                                <div className="mt-2 mb-2 max-w-2xl">Comments:</div>
                                <div style={{ width: "50rem" }}>
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-3 bg-gray-200 font-semibold">Username</th>
                                                <th className="py-2 px-3 bg-gray-200 font-semibold">Content</th>
                                                <th className="py-2 px-3 bg-gray-200 font-semibold">Created at</th>
                                                <th className="py-2 px-3 bg-gray-200 font-semibold">Updated at</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {postData.comments?.map((comment, index) => (
                                                <tr key={index}>
                                                    <td className="py-2 px-3">{comment.username}</td>
                                                    <td className="py-2 px-3">{comment.body}</td>
                                                    <td className="py-2 px-3">{comment.created_at}</td>
                                                    <td className="py-2 px-3">{comment.updated_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        <button
                            type="submit"
                            className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
                        >
                            Update
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

function UpdatePost() {
    return <AdminLayout Content={<Getpost />} />;
}

export default UpdatePost;