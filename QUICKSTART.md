# Cravely Quick Start Guide

This guide will help you quickly set up and run the Cravely application on your local development environment.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- Visual Studio Code (recommended)
- Firebase account

## Setup Steps

### 1. Clone the Repository

```powershell
git clone https://github.com/your-organization/cravely.git
cd cravely/cravely_app
```

### 2. Install Dependencies

```powershell
npm install
cd functions
npm install
cd ..
```

### 3. Set Up Firebase

a) **Create a Firebase project** at [firebase.google.com/console](https://firebase.google.com/console)

b) **Enable required services**:

- Authentication
- Firestore Database
- Storage
- Functions

c) **Install Firebase tools**:

```powershell
npm install -g firebase-tools
firebase login
```

d) **Initialize Firebase**:

```powershell
firebase init
```

Select Firestore, Storage, and Functions options when prompted.

e) **Create a `.env.local` file** with Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 4. Start Development Server

```powershell
# Start Firebase emulators
firebase emulators:start

# In a new terminal, start the development server
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:

- http://localhost:5173

## Key Directories

- `/src/components` - UI components
- `/src/pages` - Page components
- `/src/services` - API service abstraction
- `/src/hooks` - Custom React hooks
- `/functions/src` - Cloud Functions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `firebase emulators:start` - Start Firebase emulators
- `cd functions && npm run deploy` - Deploy Cloud Functions

## Testing Guest Ordering

1. Deploy or run Firebase emulators
2. Generate QR codes for test tables using the Cloud Function
3. Visit `/r/{restaurantId}/t/{tableId}` in your browser
4. Test the ordering flow

## Additional Resources

- [Full Backend Implementation Guide](./BACKEND_IMPLEMENTATION.md)
- [Technical Details](./TECHNICAL_DETAILS.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

For any questions, contact the development team at dev@cravely.app
