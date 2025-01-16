import { initializeApp } from "firebase/app";
import { 
    getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile 
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmioQV6hHN-8HflggR0Mu5fqIDdUmQySc",
    authDomain: "authforcostuv.firebaseapp.com",
    projectId: "authforcostuv",
    storageBucket: "authforcostuv.firebasestorage.app",
    messagingSenderId: "377159945543",
    appId: "1:377159945543:web:380144eb6f5eb90de61062"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window.auth = auth;

function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(window.auth, email, password)
        .then((userCredential) => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert('Error: .4' + error.message);
        });
}

function register(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }

    createUserWithEmailAndPassword(window.auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return updateProfile(user, {
                displayName: document.getElementById('username').value
            });
        })
        .then(() => {
            alert('Registration successful!');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
}

function logout() {
    signOut(window.auth)
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
}

// Check authentication state
onAuthStateChanged(window.auth, (user) => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user) {
        // User is signed in
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        
        // Redirect if on login/register page
        if (window.location.href.includes('login.html') || 
            window.location.href.includes('register.html')) {
            window.location.href = 'index.html';
        }
    } else {
        // User is signed out
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        
        // Redirect to login if on protected page
        if (!window.location.href.includes('login.html') && 
            !window.location.href.includes('register.html')) {
            window.location.href = 'login.html';
        }
    }
});

window.login = login;
window.login = register;
window.logout = logout;
