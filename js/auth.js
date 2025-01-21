import { initializeApp } from "firebase/app";
import { 
    getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile 
} from "firebase/auth";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmioQV6hHN-8HflggR0Mu5fqIDdUmQySc",
    authDomain: "authforcostuv.firebaseapp.com",
    projectId: "authforcostuv",
    storageBucket: "authforcostuv.firebasestorage.app",
    messagingSenderId: "377159945543",
    appId: "1:377159945543:web:380144eb6f5eb90de61062",
    databaseURL: "https://authforcostuv-default-rtdb.firebaseio.com" // Add this line
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
window.auth = auth;

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;

        // Update or create username in database if it doesn't exist
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (!snapshot.exists() || !snapshot.val().username) {
            // Set username from displayName or email
            const username = user.displayName || email.split('@')[0];
            await set(ref(db, `users/${user.uid}/username`), username);
        }

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error);
        alert('Error: ' + error.message);
    }
}

async function register(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user data object
        const userData = {
            username: username,
            credits: 0
        };
        // Store in Realtime Database
        await set(ref(db, `users/${user.uid}`), userData);
        console.log('User data stored:', userData);

        // Update auth profile
        await updateProfile(user, {
            displayName: username
        });

        alert('Registration successful!');
        window.location.href = 'html/login.html';
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error: ' + error.message);
    }
}

function logout() {
    signOut(window.auth)
        .then(() => {
            window.location.href = 'html/login.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
}

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user) {
        // User is signed in
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        
        // Redirect if on login/register page
        if (window.location.href.includes('html/login.html') || 
            window.location.href.includes('html/register.html')) {
            window.location.href = 'index.html';
        }

        // Get user data with real-time updates
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            console.log('Current user data:', userData); // Debug log
            
            if (userData) {
                // Update all credits displays
                const creditsDisplays = {
                    navCredits: document.getElementById('navCredits'),
                    profileCredits: document.getElementById('profileCredits')
                };

                Object.entries(creditsDisplays).forEach(([key, element]) => {
                    if (element) {
                        element.textContent = userData.credits || 0;
                        console.log(`Updated ${key} with:`, userData.credits); // Debug log
                    }
                });

                // Update username displays
                const username = userData.username || user.displayName || 'User';
                const usernameElements = {
                    userName: document.getElementById('userName'),
                    profileName: document.getElementById('profileName'),
                    welcomeMessage: document.querySelector('.hero-content h1')
                };

                Object.entries(usernameElements).forEach(([key, element]) => {
                    if (element) {
                        element.textContent = key === 'welcomeMessage' 
                            ? `Welcome ${username}` 
                            : username;
                    }
                });

                // Make sure credits section is visible on desktop
                const creditsSection = document.querySelector('.credits-section');
                if (creditsSection) {
                    creditsSection.style.display = 'flex';
                }
            }
        });

        // Update UI visibility
        const userPanel = document.getElementById('userPanel');
        const userEmail = document.getElementById('userEmail');
        
        if (userPanel) userPanel.style.display = 'block';
        if (userEmail) userEmail.textContent = user.email;
    } else {
        // User is signed out
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        
        // Redirect to login if on protected page
        if (!window.location.href.includes('html/login.html') && 
            !window.location.href.includes('html/register.html')) {
            window.location.href = 'html/login.html';
        }
    }
});

window.login = login;
window.login = register;
window.logout = logout;