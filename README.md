# 🍽️ Cravely

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Cravely** is a comprehensive digital solution that revolutionizes restaurant operations and enhances customer dining experiences with advanced ordering systems, real-time tracking, and data-driven insights - all in one unified platform.

![Cravely Dashboard Preview](https://via.placeholder.com/1200x600?text=Cravely+Dashboard+Preview)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🔍 Overview

Cravely transforms restaurant operations with a modern, intuitive platform designed for both restaurant owners/staff and customers. Our solution combines powerful management tools with a seamless ordering experience, all powered by Firebase and React.

### Target Users

- **Restaurant Owners & Administrators**: Streamline operations, gain business insights, and enhance customer satisfaction
- **Restaurant Staff**: Efficiently manage orders, tables, and customer interactions
- **Restaurant Customers**: Enjoy convenient menu browsing, easy ordering, and flexible payment options

## ✨ Features

### For Restaurant Management

- **🔐 Secure Dashboard Access**: Role-based authentication with customizable permissions
- **📊 Live Order Management**: Real-time visualization of active orders with dynamic status tracking
- **🍽️ Intuitive Menu Management**: User-friendly interface for creating and organizing menu items
- **📱 QR Code Integration**: Generate and manage custom QR codes for tableside ordering
  - Create unique QR codes for each table
  - Download and print QR codes for placement on tables
  - Monitor order activity by table
- **🪑 Visual Table Management**: Interactive restaurant layout with real-time status indicators
- **💳 Flexible Payment Solutions**: Multiple payment gateway integrations with split bill capabilities
- **🤖 AI-Powered Business Intelligence**: Performance analytics with automated optimization suggestions
- **👥 Staff Management Tools**: Employee accounts with permission settings and performance tracking
- **📈 Comprehensive Reporting**: Customizable reports with visual data representations
- **🔔 Smart Notification System**: Real-time alerts across multiple channels
  - Browser notifications for new orders
  - Sound alerts for immediate attention
  - Visual indicators in sidebar and orders page

### For Customers

- **📱 Seamless Menu Experience**: Visually appealing interface with intuitive navigation
- **🧠 Personalized Recommendations**: AI-driven suggestions based on preferences
- **🛒 Effortless Ordering**: Intuitive item selection with customization options
- **⏱️ Real-Time Updates**: Dynamic preparation time estimates and status tracking
- **💰 Multiple Payment Options**: Secure in-app payments with digital receipts
- **⭐ Feedback System**: Post-dining feedback with ratings and photo sharing

## 🛠️ Tech Stack

### Frontend

- **React 18+**: Component-based UI architecture
- **TypeScript**: Type safety and improved developer experience
- **Vite**: Next-generation frontend tooling for faster development
- **React Router**: Declarative routing for React applications
- **React Query**: Data fetching, caching, and state management
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework for custom designs
- **Shadcn/UI**: Accessible component library built on Radix UI
- **Framer Motion**: Animation library for React

### Backend (Firebase)

- **Firebase Authentication**: Multi-factor authentication with role-based access
- **Firestore**: NoSQL database for real-time data synchronization
- **Firebase Cloud Functions**: Serverless backend logic
- **Firebase Hosting**: Global CDN for fast content delivery
- **Firebase Storage**: Media and file storage
- **Firebase Analytics**: User behavior insights
- **Firebase Security Rules**: Declarative security model

### Developer Experience

- **ESLint**: Linting utility for identifying problematic patterns
- **Prettier**: Code formatter for consistent style
- **Husky**: Git hooks for pre-commit checks
- **Vitest**: Unit testing framework
- **Cypress**: End-to-end testing framework
- **GitHub Actions**: CI/CD automation

## 🏗️ Architecture

Cravely follows a modern, scalable architecture pattern:

```
cravely/
├── .github/              # GitHub Actions workflows
├── .husky/               # Git hooks
├── firebase/             # Firebase configuration and functions
│   ├── functions/        # Cloud Functions
│   └── rules/            # Security rules
├── public/               # Static assets
└── src/
    ├── assets/           # Images, fonts, etc.
    ├── components/       # Reusable UI components
    │   ├── ui/           # Base UI components
    │   └── features/     # Feature-specific components
    ├── config/           # App configuration
    ├── contexts/         # React contexts
    ├── features/         # Feature modules    │   ├── auth/         # Authentication
    │   ├── dashboard/    # Admin dashboard
    │   ├── menu/         # Menu management
    │   ├── tables/       # Table & QR code management
    │   ├── orders/       # Order processing system
    │   └── customer/     # Customer-facing ordering experience
    │   ├── orders/       # Order processing
    │   └── tables/       # Table management
    ├── hooks/            # Custom React hooks
    ├── layouts/          # Page layouts
    ├── lib/              # Utility libraries
    ├── pages/            # Route pages
    ├── services/         # API services
    ├── stores/           # State management
    ├── types/            # TypeScript types
    ├── utils/            # Utility functions
    ├── App.tsx           # Root component
    └── main.tsx          # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-organization/cravely.git
cd cravely
```

2. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

3. Set up Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init
```

4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase configuration. This file is excluded from git commits to keep your API keys secure.

> ⚠️ **SECURITY WARNING**: Never commit your `.env` file or any other files containing API keys, tokens, or other sensitive credentials to version control. These files are already added to `.gitignore` to prevent accidental commits.

5. Set up service account key

```bash
cp scripts/service-account-key.example.json scripts/service-account-key.json
```

Edit `scripts/service-account-key.json` with your Google Cloud service account credentials. This file is in `.gitignore` to prevent accidental commits of sensitive data.

6. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 💻 Development

### Commands

- **dev**: Start development server
- **build**: Build for production
- **preview**: Preview production build
- **test**: Run tests
- **lint**: Lint code
- **format**: Format code
- **firebase:emulate**: Run Firebase emulators

```bash
# Development server
npm run dev

# Production build
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Firebase emulators
npm run firebase:emulate
```

### Environment Variables

Create a `.env.local` file with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📦 Deployment

### Firebase Deployment

1. Build the project

```bash
npm run build
```

2. Deploy to Firebase

```bash
firebase deploy
```

### CI/CD Pipeline

This project utilizes GitHub Actions for continuous integration and deployment:

- Code quality checks run on every pull request
- Automated tests run on pull requests and merges to main
- Automatic deployment to Firebase on merges to main

## 🤝 Contributing

We welcome contributions to Cravely! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all code meets our style guidelines and passes tests.

### Code Style

This project follows strict TypeScript guidelines with ESLint and Prettier configuration. All code is automatically formatted on commit using Husky.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support with Cravely:

- Check the [documentation](https://docs.cravely.com)
- Submit an issue on GitHub
- Contact support at support@cravely.com

## 🔒 Security

### API Keys and Credentials

- All sensitive credentials are stored in environment variables
- Never commit `.env` files or service account keys to the repository
- The `.gitignore` file is configured to exclude the following sensitive files:
  - `.env` and all `.env.*` files (except `.env.example`)
  - `*firebase-adminsdk*.json` files
  - `*serviceAccount*.json` files
  - `*service-account*.json` files
  - `.secret.*` files
  - `credentials*.json` files
  - Firebase debug logs

### Best Practices

1. Always use environment variables for API keys
2. Check `.gitignore` before committing changes
3. When adding new team members, provide them with the `.env.example` file and instruct them to create their own `.env` file
4. Rotate API keys periodically for enhanced security
5. Use restricted API keys with limited permissions when possible

---

© 2025 Cravely. All rights reserved.

_Transforming restaurant management and dining experiences through intelligent digital solutions._
