# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your CAB-I-NET application.

## Prerequisites

1. A Google account
2. Access to the [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter your project name (e.g., "cab-i-net-app")
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's support email

## Step 3: Enable Firestore Database

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development (you can change this later)
4. Select a location for your database
5. Click **"Done"**

## Step 4: Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview" in the left sidebar
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **"Web"** icon (`</>`)
5. Enter an app nickname (e.g., "cab-i-net-web")
6. Check **"Also set up Firebase Hosting"** if you plan to deploy to Firebase Hosting
7. Click **"Register app"**
8. Copy the Firebase configuration object

## Step 5: Configure Your Application

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your Firebase configuration values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Enable Firebase Authentication
VITE_USE_FIREBASE_AUTH=true
```

3. Replace the placeholder values with your actual Firebase configuration values

## Step 6: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Try creating a new account with email/password
4. Try signing in with Google
5. Check the Firebase Console under Authentication > Users to see registered users

## Step 7: Configure Firestore Security Rules (Production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other collection rules as needed
  }
}
```

## Additional Features

### Email Verification
- Firebase automatically handles email verification
- Users will receive verification emails when they sign up

### Password Reset
- The "Forgot Password" feature will send password reset emails
- Users can reset their passwords through the email link

### Google Sign-In
- Users can sign in with their Google accounts
- No additional setup required once Google provider is enabled

## Switching Between Demo and Firebase Mode

You can switch between demo mode and Firebase authentication by changing the environment variable:

- **Demo Mode**: `VITE_USE_FIREBASE_AUTH=false`
- **Firebase Mode**: `VITE_USE_FIREBASE_AUTH=true`

## Troubleshooting

### Common Issues

1. **"Firebase not configured" errors**
   - Make sure all environment variables are set correctly
   - Check that `.env` file is in the project root

2. **Google Sign-In not working**
   - Ensure Google provider is enabled in Firebase Console
   - Check that the domain is authorized in Firebase settings

3. **Permission denied errors**
   - Check Firestore security rules
   - Ensure user is authenticated before accessing protected data

### Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase configuration in the Firebase Console
3. Ensure all required services (Authentication, Firestore) are enabled
4. Check that your environment variables are properly loaded

## Next Steps

Once Firebase is set up, you can:
- Customize the user profile data structure
- Add more authentication providers (Facebook, Twitter, etc.)
- Implement role-based access control
- Add real-time features with Firestore
- Deploy to Firebase Hosting
