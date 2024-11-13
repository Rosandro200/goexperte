// Check if user is logged in
function isLoggedIn() {
    // Check if user data exists in localStorage
    return localStorage.getItem('user') !== null;
}

// Redirect to login with return URL
function redirectToLogin(returnUrl) {
    // Store the return URL in localStorage
    localStorage.setItem('returnUrl', returnUrl);
    // Redirect to login page
    window.location.href = 'login.html';
}

// Check auth and redirect if needed
function checkAuth() {
    if (!isLoggedIn()) {
        // Get current page URL
        const currentPage = window.location.pathname.split('/').pop();
        redirectToLogin(currentPage);
        return false;
    }
    return true;
} 