# Firebase Deployment Guide for ScamReport App

This guide will walk you through deploying the ScamReport app to Firebase Hosting.

## Prerequisites

1. Install Firebase CLI:
   \`\`\`bash
   npm install -g firebase-tools
   \`\`\`

2. Login to Firebase:
   \`\`\`bash
   firebase login
   \`\`\`

3. Initialize Firebase in your project:
   \`\`\`bash
   firebase init
   \`\`\`
   - Select Hosting, Firestore, Storage, and Authentication
   - Choose your Firebase project
   - Use "out" as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: Optional

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App Config
NEXT_PUBLIC_APP_URL=https://your-app-url.web.app

# Other Environment Variables
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
NEXTAUTH_SECRET=your_nextauth_secret
CRON_SECRET=your_cron_secret
OPENAI_API_KEY=your_openai_api_key
\`\`\`

## Build and Deploy

1. Build your Next.js app:
   \`\`\`bash
   npm run build
   \`\`\`

2. Export your app:
   \`\`\`bash
   npm run export
   \`\`\`

3. Deploy to Firebase:
   \`\`\`bash
   firebase deploy
   \`\`\`

## Firebase Authentication Setup

1. Go to the Firebase Console
2. Navigate to Authentication
3. Enable Email/Password authentication
4. Optionally enable Google and Facebook authentication

## Firestore Database Setup

1. Go to the Firebase Console
2. Navigate to Firestore Database
3. Create a new database in production mode
4. Set up the following collections:
   - users
   - scam_reports
   - comments
   - me_too
   - notifications
   - advertisements

## Firebase Storage Setup

1. Go to the Firebase Console
2. Navigate to Storage
3. Initialize Storage
4. Create the following folders:
   - profile_images
   - scam_evidence
   - id_verification

## Firebase Hosting Setup

1. Go to the Firebase Console
2. Navigate to Hosting
3. Connect your domain if you have one

## Firebase Functions (Optional)

If you want to use Firebase Functions for server-side operations:

1. Initialize Firebase Functions:
   \`\`\`bash
   firebase init functions
   \`\`\`

2. Deploy Functions:
   \`\`\`bash
   firebase deploy --only functions
   \`\`\`

## Troubleshooting

- If you encounter CORS issues, set up CORS configuration in Firebase
- For authentication issues, check Firebase Authentication rules
- For database access issues, check Firestore security rules

## Monitoring

1. Go to the Firebase Console
2. Navigate to Analytics to monitor app usage
3. Check Crashlytics for any app crashes
4. Monitor Performance to ensure optimal app performance
