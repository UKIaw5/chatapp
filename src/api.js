const API_BASE_URL = "http://localhost:3000/api";

/**
 * Log in a user.
 * @param {string} username - Username to log in.
 * @returns {Promise<object>} API response.
 */
export async function login(username) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    });
    return response.json();
}

/**
 * Log out a user.
 * @param {string} username - Username to log out.
 * @returns {Promise<object>} API response.
 */
export async function logout(username) {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    });
    return response.json();
}

/**
 * Get the status of all users.
 * @returns {Promise<object[]>} List of user statuses.
 */
export async function getStatus() {
    const response = await fetch(`${API_BASE_URL}/status`);
    return response.json();
}

