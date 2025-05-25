document.addEventListener('DOMContentLoaded', () => {
    // Check if both username and token are already stored in chrome.storage.local
    chrome.storage.local.get(['username', 'token'], (result) => {
        const { username, token } = result;
        if (username && token) {
            // Redirect to notes.html if both exist
            window.location.href = 'notes.html';
            return;
        }
    });

    // Handle Google login button click
    const googleLoginButton = document.getElementById('googleLoginButton');
    googleLoginButton.addEventListener('click', () => {
        chrome.identity.launchWebAuthFlow(
            {
                url: `https://accounts.google.com/o/oauth2/auth?client_id=942582519364-gn4puh22ulc8o1tceaog16m19gi54p3q.apps.googleusercontent.com&response_type=token id_token&redirect_uri=${chrome.identity.getRedirectURL()}&scope=openid profile email`,
                interactive: true
            },
            (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                    console.error('Google login failed:', chrome.runtime.lastError);
                    return;
                }

                // Extract the access token and id_token from the redirect URL
                const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
                const accessToken = urlParams.get('access_token');
                const idToken = urlParams.get('id_token');

                if (!idToken || !accessToken) {
                    console.error('ID Token or Access Token not found in redirect URL.');
                    return;
                }
                alert(accessToken);

                // Perform both fetch calls
                const validateIdToken = fetch('https://evoke-api-ae.azurewebsites.net/.auth/login/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_token: idToken })
                }).then(response => response.json());

                const fetchUserInfo = fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json());

                // Wait for both fetch calls to complete
                Promise.all([validateIdToken, fetchUserInfo])
                    .then(([validationResponse, userInfo]) => {
                        if (validationResponse.authenticationToken) {
                            // Save username and tokens to chrome.storage.local
                            chrome.storage.local.set({
                                username: userInfo.email,
                                name: userInfo.name,
                                portrait: userInfo.picture,
                                token: validationResponse.authenticationToken,
                                userToken: accessToken
                            }, () => {
                                // Redirect to notes.html
                                window.location.href = 'notes.html';
                            });
                        } else {
                            console.error('Authentication failed:', validationResponse.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error during authentication or fetching user info:', error);
                    });
            }
        );
    });
});