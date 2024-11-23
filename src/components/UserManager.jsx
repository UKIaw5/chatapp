import React, { useState, useEffect } from "react";
import { login, logout, getStatus } from "../api";

export default function UserManager() {
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);

    // Fetch user statuses on component mount
    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        const data = await getStatus();
        setUsers(data);
    };

    const handleLogin = async () => {
        await login(username);
        fetchStatus();
    };

    const handleLogout = async () => {
        await logout(username);
        fetchStatus();
    };

    return (
        <div>
            <h1>User Manager</h1>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleLogout}>Logout</button>

            <h2>User Statuses</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.username}: {user.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

