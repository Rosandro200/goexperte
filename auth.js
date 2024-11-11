// Google OAuth 2.0 configuration
const config = {
    client_id: '500309865019-326i3m5ia79i0g9rrn5s387f43fcs4h4.apps.googleusercontent.com',
    redirect_uri: 'https://goexperte.de',
    scope: 'openid email profile',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: generateRandomString(16)
};

// Generate random string for state parameter
function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

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
            `&access_type=${encodeURIComponent(config.access_type)}` +
            `&state=${encodeURIComponent(config.state)}` +
            `&prompt=${encodeURIComponent(config.prompt)}`;

        // Redirect to Google Sign-In
        window.location.href = authUrl;
    });
}

// Handle the OAuth callback
function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    // Verify state parameter matches what we sent
    if (state !== config.state) {
        console.error('State parameter mismatch');
        return;
    }

    if (code) {
        // Exchange authorization code for tokens
        // Note: This should be done on your backend server, not in client-side JavaScript
        // for security reasons. This is just for demonstration.
        console.log('Authorization code received:', code);
        // Redirect to your backend endpoint that will handle the token exchange
        window.location.href = `${config.redirect_uri}/auth/callback?code=${code}`;
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initGoogleSignIn();
    
    // Check if this is a callback from Google OAuth
    if (window.location.search.includes('code=')) {
        handleCallback();
    }
}); 