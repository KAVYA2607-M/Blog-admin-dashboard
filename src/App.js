import { HashRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Posts from "./Admin/Posts/Posts";
import Categories from "./Admin/Categories/Categories";
import Inbox from "./Admin/Inbox/Inbox";
import Accounts from "./Admin/Accounts/Accounts";
import Add from "./Admin/Posts/NewPost";
import View from "./Admin/Posts/ViewPost";
import UpdatePost from "./Admin/Posts/UpdatePost";
import ViewMessage from "./Admin/Inbox/ViewMessage";
import { Logout } from "./Api/Api";
import NotFound from "./layouts/PageNotFound";





// function App() {
//   /* const isAuthenticated = localStorage.getItem('authToken'); */
//   let isAuthenticated = sessionStorage.getItem('authToken');
//   // isAuthenticated = 'test';
//   /* const isAuthenticated = <AuthToken/>; */
//   const Redirect =<Navigate to="/Login" />;
// /*   window.addEventListener("beforeunload", function (event) {
//     localStorage.removeItem('authToken');
// }); */

//   return (
//     //application routes
//     <BrowserRouter>
//       <Routes>
//       <Route path="/Login" element={<Login />} />
//       <Route path="/Logout" element={<Logout />} />
     
//       <Route path="/Admin" element={isAuthenticated ? <Dashboard/> : Redirect} />
//       {/* Dashboard url */}
//       <Route path="/Admin/Dashboard" element={isAuthenticated ? <Dashboard/> : Redirect}/>
      
//       {/* get all posts */}
//       <Route path="/Admin/Posts" element={isAuthenticated ? <Posts/> : Redirect} />
//       {/* Add a new post */}
//       <Route path="/Admin/Post/New" element={isAuthenticated ? <Add/> : Redirect} />
//       {/* Update a  post */}
//       <Route path="/Admin/Posts/Update/:id" element={isAuthenticated ? <UpdatePost/> : Redirect} />
//       {/* show post details */}
//       <Route path="/Admin/Posts/:id" element={isAuthenticated ? <View/> : Redirect} />
//       {/* manage Categories */}
//       <Route path="/Admin/Categories" element={isAuthenticated ? <Categories/> : Redirect} />
//       {/* manage contact messages */}
//       <Route path="/Admin/Inbox" element={isAuthenticated ? <Inbox/> : Redirect} />
//       <Route path="/Admin/Inbox/:id" element={isAuthenticated ? <ViewMessage/> : Redirect} />
//       {/* manage users Accounts */}
//       <Route path="/Admin/Accounts" element={isAuthenticated ? <Accounts/> : Redirect} />
//       <Route path="*" element={<NotFound/>} />
       
        
//       </Routes>
//     </BrowserRouter>
//   );
// }

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem("authToken"));

  useEffect(() => {
    console.log("App component mounted");
    setIsAuthenticated(sessionStorage.getItem("authToken")); // Update state on mount
  }, []); 
  const Redirect = <Navigate to="/Login" />;

  return (
    <HashRouter> {/* Changed from BrowserRouter to HashRouter */}
      <Routes>
        <Route path="" element={<Navigate to="/Login" />}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/Logout" element={<Navigate to="/Login" />} />
        
        <Route path="/Admin" element={isAuthenticated ? <Dashboard/> : Redirect} />
        <Route path="/Admin/Dashboard" element={isAuthenticated ? <Dashboard /> : Redirect} />
        <Route path="/Admin/Posts" element={isAuthenticated ? <Posts /> : Redirect} />
        <Route path="/Admin/Post/New" element={isAuthenticated ? <Add /> : Redirect} />
        <Route path="/Admin/Posts/Update/:id" element={isAuthenticated ? <UpdatePost /> : Redirect} />
        <Route path="/Admin/Posts/:id" element={isAuthenticated ? <View /> : Redirect} />
        <Route path="/Admin/Categories" element={isAuthenticated ? <Categories /> : Redirect} />
        <Route path="/Admin/Inbox" element={isAuthenticated ? <Inbox /> : Redirect} />
        <Route path="/Admin/Inbox/:id" element={isAuthenticated ? <ViewMessage /> : Redirect} />
        <Route path="/Admin/Accounts" element={isAuthenticated ? <Accounts /> : Redirect} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

 