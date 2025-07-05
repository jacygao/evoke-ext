// let API_URL = "https://evoke-api-ae.azurewebsites.net/api";
let API_URL = "http://localhost:7174/api"
/**
 * Common function to make API requests with authentication.
 * @param {string} endpoint - The API endpoint (relative to the base URL).
 * @param {Object} options - Fetch options (method, headers, body, etc.).
 * @returns {Promise} - Resolves with the API response or rejects with an error.
 */
export function fetchWithAuth(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
        // Retrieve token and username from chrome.storage.local
        chrome.storage.local.get(['userToken', 'token',], (result) => {
            const bearerToken = result.token || '';
            const userToken = result.userToken || '';

            if (!bearerToken || !userToken) {
                reject(new Error('Missing bearerToken or userToken. Please log in again.'));
                return;
            }

            // Add Authorization and userId headers
            const headers = {
                ...options.headers,
                'Content-Type': 'application/json',
                'X-ZUMO-AUTH': bearerToken,
                'X-USER-AUTH': userToken
            };

            // Perform the fetch request
            fetch(`${API_URL}/${endpoint}`, {
                ...options,
                headers
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API error: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    });
}