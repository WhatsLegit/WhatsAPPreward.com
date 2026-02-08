# Firebase Setup Guide

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "WhatsAPPrewards")
4. Click "Create project"

## Step 2: Enable Realtime Database
1. In Firebase Console, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to your users)
4. Start in "Test mode" (for development)
5. Click "Enable"

## Step 3: Get Your Configuration
1. Go to Project Settings (gear icon)
2. Click "Your apps" section
3. Click "Web" icon to add a web app
4. Register app with a name
5. Copy the Firebase config object

## Step 4: Update Configuration
Replace the placeholder values in `script.js` with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 5: Set Database Rules (Important!)
In Firebase Console → Realtime Database → Rules, replace with:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    }
  }
}
```

Click "Publish"

## Done!
Your app will now sync data across all devices using Firebase Realtime Database.
