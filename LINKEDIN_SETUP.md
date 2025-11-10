# LinkedIn OAuth Setup Guide for Firebase

## Your LinkedIn Credentials

**Client ID:** `86t5emoi9eyiir`
**Client Secret:** `WPL_AP1.DG0pCi9QTHflwU9s.IB9bfg==`

⚠️ **CRITICAL SECURITY WARNING:**
These credentials have been shared in our conversation. For security, you should:
1. Complete this setup
2. Test the integration
3. **REGENERATE these credentials** in LinkedIn Developer Portal
4. Update them in Firebase Console

---

## Step-by-Step Setup

### Part 1: Configure Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: **grit-ae74c**

2. **Enable LinkedIn Authentication**
   - Navigate to: **Authentication** → **Sign-in method**
   - Click **Add new provider**
   - Select **LinkedIn** from the list
   - You'll see a configuration screen

3. **Enter LinkedIn Credentials**
   - **Client ID:** `86t5emoi9eyiir`
   - **Client Secret:** `WPL_AP1.DG0pCi9QTHflwU9s.IB9bfg==`
   - Click **Save**

4. **Copy the Redirect URL**
   - Firebase will show you a redirect URL like:
   ```
   https://grit-ae74c.firebaseapp.com/__/auth/handler
   ```
   - **Copy this URL** - you'll need it for LinkedIn

---

### Part 2: Configure LinkedIn Developer Portal

1. **Go to LinkedIn Developers**
   - Visit: https://www.linkedin.com/developers/apps
   - Sign in with your LinkedIn account

2. **Select Your App**
   - Find your app with Client ID: `86t5emoi9eyiir`
   - Click on the app name to open settings

3. **Configure OAuth 2.0 Settings**

   **a) Add Authorized Redirect URLs:**
   - Go to **Auth** tab
   - Under **OAuth 2.0 settings**
   - Click **Add redirect URL**
   - Add these URLs:
     ```
     https://grit-ae74c.firebaseapp.com/__/auth/handler
     http://localhost:5173/__/auth/handler
     ```
   - Click **Update**

4. **Verify Required Scopes**
   - Go to **Products** tab
   - Ensure **Sign In with LinkedIn using OpenID Connect** is added
   - Required scopes should include:
     - `openid`
     - `profile`
     - `email`

5. **Application Status**
   - Make sure your app is **In Development** or **Published**
   - For development: Keep it as "In Development"
   - For production: Submit for LinkedIn review

---

### Part 3: Testing the Integration

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Test LinkedIn Sign-In**
   - Open: http://localhost:5173
   - Click **"Join Waitlist"** or **"Log In"**
   - Click **"Sign in with LinkedIn"**

3. **Expected Flow**
   - LinkedIn authorization popup appears
   - You authorize the app
   - Popup closes
   - You're signed in
   - Avatar appears in navigation

4. **Verify in Firebase Console**
   - Go to **Authentication** → **Users**
   - Your LinkedIn user should appear
   - Go to **Firestore Database** → **waitlist**
   - Your entry should be there

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** LinkedIn redirect URL doesn't match Firebase URL

**Solution:**
1. Check LinkedIn app settings → Auth tab
2. Ensure redirect URL exactly matches:
   ```
   https://grit-ae74c.firebaseapp.com/__/auth/handler
   ```
3. No trailing slashes, exact match required

---

### Error: "unauthorized_client"

**Problem:** LinkedIn app not configured properly

**Solution:**
1. Verify Client ID and Secret in Firebase Console
2. Ensure "Sign In with LinkedIn using OpenID Connect" product is added
3. Check app status is not "Rejected"

---

### Error: "access_denied"

**Problem:** User cancelled authorization or app lacks permissions

**Solution:**
1. Try sign-in again
2. Verify required scopes are enabled
3. Check LinkedIn app has necessary permissions

---

### LinkedIn Popup Blocked

**Problem:** Browser blocked the popup

**Solution:**
1. Allow popups for your site
2. User must interact directly with the button (no auto-clicks)

---

## Production Checklist

Before going live:

- [ ] Test LinkedIn sign-in thoroughly
- [ ] Add production domain to LinkedIn redirect URLs
- [ ] Add production domain to Firebase authorized domains
- [ ] **Regenerate LinkedIn credentials** (for security)
- [ ] Update credentials in Firebase Console
- [ ] Submit LinkedIn app for review (if needed for > 100 users)
- [ ] Set up error monitoring
- [ ] Add analytics tracking

---

## LinkedIn App Review (For Production)

If you expect **more than 100 LinkedIn sign-ins**, you need to verify your app:

1. **Go to LinkedIn Developers**
   - Select your app
   - Click **Verify** tab

2. **Complete Verification**
   - Add company information
   - Upload company logo
   - Provide app description
   - Submit for review

3. **Review Process**
   - Takes 3-7 business days
   - LinkedIn will verify your app
   - Once approved, no user limit

---

## Security Best Practices

### Current Setup (Development):
✅ Credentials in `.env` file
✅ `.env` in `.gitignore`
✅ Firebase security rules configured

### Before Production:
❌ **MUST DO:**
1. Regenerate LinkedIn Client Secret
2. Use different credentials for production
3. Set up environment-specific configs
4. Enable Firebase App Check
5. Add rate limiting
6. Monitor authentication logs

---

## Next Steps After Setup

1. **Test Both Providers**
   - Sign in with Google ✓
   - Sign in with LinkedIn ✓

2. **Check Firestore Data**
   - Verify users collection
   - Verify waitlist collection
   - Check data structure

3. **Monitor Authentication**
   - Firebase Console → Authentication → Users
   - Check sign-in methods
   - Monitor for errors

4. **Build Admin Dashboard** (Optional)
   - View all waitlist users
   - Export to CSV
   - Send notifications
   - Manage user status

---

## Environment Variables Reference

Your current `.env` configuration:

```env
# LinkedIn OAuth
VITE_LINKEDIN_CLIENT_ID=86t5emoi9eyiir
VITE_LINKEDIN_CLIENT_SECRET=WPL_AP1.DG0pCi9QTHflwU9s.IB9bfg==

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyAMoGQXuaAs3s93hpl4zXdkulTosnm0U-0
VITE_FIREBASE_AUTH_DOMAIN=grit-ae74c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=grit-ae74c
```

**For Production:** Create separate `.env.production` file with new credentials.

---

## Support Resources

- **LinkedIn OAuth Docs:** https://docs.microsoft.com/en-us/linkedin/shared/authentication/
- **Firebase Auth Docs:** https://firebase.google.com/docs/auth
- **LinkedIn Developer Portal:** https://www.linkedin.com/developers/
- **Firebase Console:** https://console.firebase.google.com/

---

## Quick Reference

### LinkedIn App Settings:
- **Client ID:** `86t5emoi9eyiir`
- **Redirect URL:** `https://grit-ae74c.firebaseapp.com/__/auth/handler`
- **Scopes:** `openid`, `profile`, `email`

### Firebase Project:
- **Project ID:** `grit-ae74c`
- **Auth Domain:** `grit-ae74c.firebaseapp.com`

### Files to Check:
- `.env` - Environment variables
- `src/lib/firebase.ts` - Firebase configuration
- `src/components/AuthModal.tsx` - Auth UI

---

## Final Security Reminder

🔒 **REGENERATE YOUR CREDENTIALS AFTER TESTING!**

Since these credentials were shared in our conversation:
1. They are potentially compromised
2. Should only be used for initial setup
3. Must be regenerated before production
4. Use different keys for different environments

To regenerate:
1. Go to LinkedIn Developers
2. Select your app
3. Go to Auth tab
4. Click "Reset client secret"
5. Update Firebase Console with new secret
6. Update `.env` file with new secret

---

Need help? The authentication is already coded and ready. Just follow the Firebase Console and LinkedIn Developer Portal steps above!
