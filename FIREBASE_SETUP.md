# Firebase Setup Guide for Cravely

This guide walks you through setting up Firebase from scratch for the Cravely restaurant management application, with special focus on the QR code functionality.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#step-1-create-a-firebase-project)
3. [Configure Firebase](#step-6-configure-the-application)
4. [Security Rules](#step-7-firestore-security-rules)
5. [Cloud Functions](#step-8-firebase-functions-setup)
6. [Deployment](#step-9-deploy-to-firebase)
7. [Authentication](#step-10-set-up-authentication)
8. [QR Code Feature Setup](#qr-code-feature-setup)
9. [Automated Setup Scripts](#automated-setup-scripts)
10. [Local Development](#testing-locally-with-emulators)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A Google account

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "Cravely" as your project name
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click "Create project"
6. Wait for your project to be provisioned

## Step 2: Register Your Web App

1. From the project overview page, click the web icon (</>) to add a web app
2. Register your app with the name "Cravely Web App"
3. Check the box to set up Firebase Hosting (optional but recommended)
4. Click "Register app"
5. Copy the Firebase configuration object - you'll need this for your app

## Step 3: Install the Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 4: Login to Firebase

```bash
firebase login
```

## Step 5: Initialize Firebase in Your Project

Navigate to your project directory and run:

```bash
firebase init
```

Select the following features:

- Firestore
- Functions
- Storage
- Hosting (if desired)
- Emulators (recommended for local development)

## Step 6: Configure the Application

1. Create a file at `src/services/firebase.ts` with your Firebase config:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID", // if you use Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
```

## Step 7: Firestore Security Rules

1. Update the Firestore security rules in `firebase/rules/firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Restaurants - only owners can write, public can read
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.owner;
    }

    // Tables - public read, authenticated write by restaurant staff
    match /tables/{tableId} {
      allow read: if true;
      allow write: if request.auth != null &&
                    get(/databases/$(database)/documents/restaurants/$(resource.data.restaurantId)).data.owner == request.auth.uid;
    }

    // Orders - customers can create, view their own, staff can view/update all
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (
                    request.auth.uid == resource.data.customerId ||
                    get(/databases/$(database)/documents/restaurants/$(resource.data.restaurantId)).data.owner == request.auth.uid
                  );
      allow update: if request.auth != null &&
                    get(/databases/$(database)/documents/restaurants/$(resource.data.restaurantId)).data.owner == request.auth.uid;
    }

    // Menu items - public read, staff can write
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null &&
                    get(/databases/$(database)/documents/restaurants/$(resource.data.restaurantId)).data.owner == request.auth.uid;
    }
  }
}
```

## Step 8: Firebase Functions Setup

1. Navigate to the functions directory:

```bash
cd functions
```

2. Install dependencies:

```bash
npm install
```

3. Build the functions:

```bash
npm run build
```

## Step 9: Deploy to Firebase

Deploy everything to Firebase:

```bash
firebase deploy
```

Or deploy individual services:

```bash
firebase deploy --only firestore,functions
firebase deploy --only hosting
firebase deploy --only storage
```

## Step 10: Set Up Authentication

1. In the Firebase console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. (Optional) Enable Google authentication or other providers

## Step 11: Set Up Firestore Indexes

If you encounter any index errors during development, follow the link in the error message to create the required index.

## Troubleshooting

### CORS Issues with Storage

If you encounter CORS issues when accessing Firebase Storage, you may need to configure CORS for your storage bucket:

1. Create a file named `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

2. Set the CORS configuration using gsutil:

```bash
gsutil cors set cors.json gs://YOUR-STORAGE-BUCKET
```

### Cloud Functions Deployment Issues

If you have problems deploying Cloud Functions:

1. Make sure you're on a paid Firebase plan (Blaze)
2. Check that your Node.js version matches the one specified in `functions/package.json`
3. Verify that you have properly built the functions (`npm run build` in the functions directory)

## Testing Locally with Emulators

To test your application locally without affecting production data:

```bash
firebase emulators:start
```

This will start local emulators for Firestore, Functions, Auth, and Storage that you can use during development.
