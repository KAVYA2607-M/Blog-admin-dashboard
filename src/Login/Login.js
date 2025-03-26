import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // sessionStorage.clear();
  // Initialize dummy users in sessionStorage if not already present
  if (!sessionStorage.getItem("users")) {
    const dummyUsers = [
      {
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        password: "admin",
        email_verified_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "User",
        email: "user@example.com",
        password: "user",
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
    sessionStorage.setItem("users", JSON.stringify(dummyUsers));
  }

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUsers = JSON.parse(sessionStorage.getItem("users")) || [];

    // Validate credentials
    const foundUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      sessionStorage.setItem("authToken", "Bearer zrey...");
      sessionStorage.setItem("AdminName", foundUser.name);
      
      // Redirect to Admin page
      navigate("/Admin");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md" style={{ marginTop: "-50px" }}>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="text-center">
            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" type="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;