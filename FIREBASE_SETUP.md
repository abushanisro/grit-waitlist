# Firebase Authentication Setup Guide

## Overview
Your GRIT landing page now has full Firebase Authentication integration with Google and LinkedIn sign-in, plus automatic waitlist management.

## What's Been Implemented

### 1. **Firebase Authentication**
- Google OAuth sign-in
- LinkedIn OAuth sign-in
- Persistent authentication state
- Automatic user session management

### 2. **Waitlist System**
- Users are automatically added to Firestore `waitlist` collection upon sign-in
- Prevents duplicate entries
- Stores user information:
  - Name
  - Email
  - Profile picture
  - Provider (Google/LinkedIn)
  - Join timestamp
  - Status (pending)

### 3. **User Profile Storage**
- User profiles saved in Firestore `users` collection
- Includes all authentication data
- Updates on each login

## Firebase Console Setup Required

### Step 1: Enable Authentication Methods

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `grit-ae74c`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable the following providers:

#### **Google Sign-In:**
- Click "Google" provider
- Toggle "Enable"
- Set your support email
- Save

#### **LinkedIn Sign-In (Advanced):**
LinkedIn requires additional setup:

1. In Firebase Console:
   - Click "Add new provider"
   - Select "LinkedIn"
   - Toggle "Enable"

2. In LinkedIn Developer Portal:
   - Go to: https://www.linkedin.com/developers/
   - Create a new app or use existing
   - Add these OAuth 2.0 scopes:
     - `openid`
     - `profile`
     - `email`
   - Add authorized redirect URLs:
     - Development: `https://grit-ae74c.firebaseapp.com/__/auth/handler`
     - Production: `https://yourdomain.com/__/auth/handler`

3. Copy LinkedIn credentials to Firebase:
   - Client ID → Firebase LinkedIn provider
   - Client Secret → Firebase LinkedIn provider

### Step 2: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (we'll set rules next)
4. Select your preferred region
5. Click "Enable"

### Step 3: Set Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Waitlist collection - authenticated users can read their own, write once
    match /waitlist/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 4: Add Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (already added by default)
   - Your production domain (e.g., `grit.com`)

## Environment Variables

Your `.env` file already contains your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyAMoGQXuaAs3s93hpl4zXdkulTosnm0U-0
VITE_FIREBASE_AUTH_DOMAIN=grit-ae74c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=grit-ae74c
VITE_FIREBASE_STORAGE_BUCKET=grit-ae74c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=437978202207
VITE_FIREBASE_APP_ID=1:437978202207:web:c5aa62755d6f553df85bea
VITE_FIREBASE_MEASUREMENT_ID=G-XN7T5BC65L
```

⚠️ **SECURITY WARNING**:
- Never commit `.env` to version control (already in `.gitignore`)
- Regenerate API keys if accidentally exposed
- Use different keys for production

## How It Works

### User Sign-In Flow

1. **User clicks "Join Waitlist" or "Log In"**
   → Auth modal opens

2. **User selects sign-in method**
   → Google or LinkedIn button clicked

3. **Firebase Authentication**
   → OAuth popup appears
   → User authenticates with provider
   → Firebase creates/updates user

4. **Automatic Data Storage**
   ```
   ├── Firebase Auth: User account created
   ├── Firestore → users/{userId}: Profile saved
   └── Firestore → waitlist/{userId}: Added to waitlist
   ```

5. **UI Updates**
   → Modal closes
   → User avatar appears in navigation
   → Success toast notification shown

### Data Structure

#### Users Collection (`users/{userId}`)
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  picture: "https://...",
  provider: "google",
  updatedAt: Timestamp
}
```

#### Waitlist Collection (`waitlist/{userId}`)
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  picture: "https://...",
  provider: "google",
  joinedAt: Timestamp,
  status: "pending"
}
```

## Testing the Integration

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Google Sign-In
- Click "Join Waitlist" button
- Click "Sign in with Google"
- Select Google account
- Check Firestore console for new entries

### 3. Test LinkedIn Sign-In
- Click "Sign in with LinkedIn"
- Authorize app
- Check Firestore console

### 4. Verify Waitlist Entry
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check `waitlist` collection
4. Verify user data is present

## Viewing Waitlist Data

### Option 1: Firebase Console
1. Go to Firestore Database
2. Click `waitlist` collection
3. View all signed-up users

### Option 2: Export to CSV (via Firebase Console)
1. Use Cloud Functions to export data
2. Or manually export from Firestore UI

### Option 3: Build Admin Dashboard (Future)
Create a React admin panel to:
- View all waitlist users
- Filter by date, provider, status
- Export to CSV/Excel
- Send notifications

## Common Issues & Solutions

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add your domain to Authorized domains in Firebase Console

### Issue: LinkedIn sign-in not working
**Solution**:
1. Check LinkedIn app credentials in Firebase
2. Verify redirect URLs match exactly
3. Ensure all required scopes are enabled

### Issue: User not added to waitlist
**Solution**:
1. Check Firestore security rules
2. Verify user is authenticated
3. Check browser console for errors

## Production Deployment

### Before Deploying:

1. **Update .env for production**
   ```env
   VITE_APP_URL=https://yourdomain.com
   ```

2. **Add production domain to Firebase**
   - Authentication → Authorized domains
   - Add `yourdomain.com`

3. **Update OAuth redirect URLs**
   - LinkedIn app settings
   - Google Cloud Console

4. **Enable Firebase Analytics** (Optional)
   - Already configured with `measurementId`

## Security Best Practices

✅ **Implemented:**
- Environment variables for credentials
- Firestore security rules
- Authentication required for data access

❌ **TODO for Production:**
- Add rate limiting
- Implement email verification
- Add CAPTCHA for sign-ups
- Set up Firebase App Check
- Enable audit logging

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [LinkedIn OAuth Setup](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)

## Questions?

Check the Firebase Console for:
- Real-time authentication events
- Firestore data updates
- Error logs in Functions (if added)
- Analytics dashboard
