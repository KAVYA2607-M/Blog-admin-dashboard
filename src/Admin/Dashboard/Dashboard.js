/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faComments,
  faHeart,
  faEye,
  faUser,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Loading from "../../layouts/Loading";

/* AnalyticsCard component */
function AnalyticsCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      <FontAwesomeIcon icon={icon} className="text-4xl text-indigo-500" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
    </div>
  );
}

const generateDummyData = () => {
  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return labels.map(() => Math.floor(Math.random() * 100) + 10);
};

/* Dashboard component */
function Dashboard() {
  let postsData = JSON.parse(sessionStorage.getItem("posts")) || [];
  const [isLoading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    TotalPosts: 0,
    TotalCategories: 0,
    TotalComment: 2,
    TotalLikes: 10,
    TotalVisits: 2,
    TotalUsers: 2,
    MonthlyVisits: [1,5,10,15,20,25,30,35,40,45,50,55],
    MonthlyPosts: [5,10,15,20,25,30,35,40,45,50,55,60],
    MonthlyComments: [],
  });

  useEffect(() => {
    setLoading(false);

    // Retrieve data from sessionStorage
    let postsData = JSON.parse(sessionStorage.getItem("posts")) || [];
    let categoriesData = JSON.parse(sessionStorage.getItem("categories")) || [];

    // Ensure values exist
    let updatedData = {
      TotalPosts: postsData.length || 0,
      TotalCategories: categoriesData.length || 0,
      TotalComment: dashboardData.TotalComment || 0,
      TotalLikes: dashboardData.TotalLikes || 0,
      TotalVisits: dashboardData.TotalVisits || 0,
      TotalUsers: dashboardData.TotalUsers || 0,
      MonthlyVisits: dashboardData.MonthlyVisits || [],
      MonthlyPosts: dashboardData.MonthlyPosts || [],
      MonthlyComments: dashboardData.MonthlyComments || [],
    };

    // Update state with sessionStorage data
    setDashboardData(updatedData);
    setLoading(true);
  }, []);

  const dashboardContent = isLoading ? (
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsCard title="Total Posts" value={dashboardData.TotalPosts} icon={faFileAlt} />
        <AnalyticsCard title="Total Categories" value={dashboardData.TotalCategories} icon={faFolder} />
        <AnalyticsCard title="Total Comments" value={postsData.length ? dashboardData.TotalComment : 0} icon={faComments} />
        <AnalyticsCard title="Likes Received" value={postsData.length ? dashboardData.TotalLikes : 0} icon={faHeart} />
        <AnalyticsCard title="Total Visits" value={postsData.length ? dashboardData.TotalVisits : 0} icon={faEye} />
        <AnalyticsCard title="Total Users" value={dashboardData.TotalUsers} icon={faUser} />
      </div>
      <Analytics
        Visits={dashboardData.MonthlyVisits}
        Posts={dashboardData.MonthlyPosts}
        Comments={dashboardData.MonthlyComments}
      />
    </div>
  ) : (
    <Loading />
  );

  return <AdminLayout Content={dashboardContent} />;
}


/* Analytics component */
function Analytics({ Visits, Posts, Comments }) {
  if (Visits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-5">
        <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
        <p>No data available. Please check back later.</p>
      </div>
    );
  }

  const orderedMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const postCounts = new Array(12).fill(0);
  const TotalComment = new Array(12).fill(0);

  const storedPosts = JSON.parse(sessionStorage.getItem("posts")) || [];
 

  // Iterate over stored posts and count posts for each month
  storedPosts.forEach(item => {
    const postDate = new Date(item.created_at); // Convert timestamp to Date object
    const monthIndex = postDate.getMonth(); // Extract month (0-11)

    postCounts[monthIndex]++; // Increment post count for that month
  });

  Comments.forEach(item => {
    const monthIndex = orderedMonths.indexOf(item.month);
    if (monthIndex !== -1) {
      TotalComment[monthIndex] = item.comment_count;
    }
  });

  const generateDummyData = (maxValue = 100) => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * maxValue));
  };

  const VisitsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: 'Visits',
        data: storedPosts.length ? generateDummyData(50) : 0,
        borderColor: 'rgba(255, 159, 0, 1)',  // Darker yellow
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Visits',
        type: 'bar',
        data: storedPosts.length ? generateDummyData(50) : 0,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  }; 
  
  const PostsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: 'Posts',
        data: postCounts,
        borderColor: 'rgba(54, 162, 235, 1)',  // Darker blue
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Posts',
        type: 'bar',
        data: postCounts,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };
  
  const CommentsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: 'Comments',
        data: TotalComment,
        borderColor: 'rgba(153, 102, 255, 1)',  // Darker purple
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Comments',
        type: 'bar',
        data: TotalComment,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };
  

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md my-5 p-2">
        <h2 className="text-2xl font-semibold mb-4">Posts Chart</h2>
        <Line data={PostsChart} options={chartOptions} />
      </div> 
      <div className="bg-white rounded-lg shadow-md my-5 p-2">
        <h2 className="text-2xl font-semibold mb-4">Visits Chart</h2>
        <Line data={VisitsChart} options={chartOptions} />
      </div> 
    </>
  );
}


export default Dashboard;