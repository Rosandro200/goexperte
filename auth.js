// Google OAuth 2.0 configuration
const config = {
    client_id: '500309865019-326i3m5ia79i0g9rrn5s387f43fcs4h4.apps.googleusercontent.com',
    redirect_uri: 'https://goexperte.de/login.html',
    scope: 'openid email profile',
    response_type: 'token',
    access_type: 'online',
    prompt: 'select_account'
};

// Initialize Google Sign-In
function initGoogleSignIn() {
    const googleLoginBtn = document.getElementById('google-login');
    
    googleLoginBtn.addEventListener('click', () => {
        // Construct the Google OAuth URL
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${encodeURIComponent(config.client_id)}` +
            `&redirect_uri=${encodeURIComponent(config.redirect_uri)}` +
            `&response_type=${encodeURIComponent(config.response_type)}` +
            `&scope=${encodeURIComponent(config.scope)}` +
            `&prompt=${encodeURIComponent(config.prompt)}`;

        // Redirect to Google Sign-In
        window.location.href = authUrl;
    });
}

// Handle the OAuth callback
function handleCallback() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            // Get user info using the access token
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(userData => {
                // Store user data in localStorage
                const user = {
                    name: userData.name,
                    email: userData.email,
                    picture: userData.picture,
                    accessToken: accessToken
                };
                localStorage.setItem('user', JSON.stringify(user));
                
                // Get return URL from localStorage or default to index
                const returnUrl = localStorage.getItem('returnUrl') || 'index.html';
                localStorage.removeItem('returnUrl');
                
                // Redirect to the return URL
                window.location.href = returnUrl;
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                alert('Login failed. Please try again.');
            });
        }
    }
}

// Check if user is logged in
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        // Verify token is still valid
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                // Token is invalid, clear storage and redirect to login
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        })
        .catch(() => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initGoogleSignIn();
    
    // Check if this is a callback from Google OAuth
    if (window.location.hash && window.location.hash.includes('access_token')) {
        handleCallback();
    } else {
        checkLoginStatus();
    }
}); 