# CAB-I-NET - Premium Cab Booking Experience

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   - Main app: `http://localhost:8080`
   - Test page: `http://localhost:8080/test-auth`

## 🔐 Authentication System

### Firebase Authentication (Default)
The application uses Firebase Authentication by default, providing:
- ✅ Google Sign-In
- ✅ Email/Password Authentication
- ✅ User Registration
- ✅ Password Reset
- ✅ Real-time User Data Sync

### Demo Authentication (Fallback)
For testing purposes, demo authentication is available:
- ✅ Quick Demo Login Buttons
- ✅ Developer Portal Access
- ✅ Mock User Data

## 🧪 Testing Authentication

### 1. Test Page
Visit `http://localhost:8080/test-auth` for comprehensive testing:
- **Individual Tests**: Test specific login methods
- **Run All Demo Tests**: Test all demo authentication flows
- **Run Firebase Tests**: Test Firebase authentication (including Google login)
- **Environment Info**: Check Firebase configuration status

### 2. Demo Login Buttons
Quick access buttons are available on all pages:
- **Quick User Demo**: Login as regular user
- **Quick Developer Demo**: Login as developer
- **Direct Demo Login**: Multiple developer options (CTO, CEO, COO)

### 3. Login Page
Visit `http://localhost:8080/login` for full authentication:
- **Sign In**: Email/password login
- **Sign Up**: User registration with OTP verification
- **Google Login**: One-click Google authentication
- **Password Reset**: Forgot password functionality

## 👥 Demo Credentials

### User Accounts
```
Email: demo@cabinet.com
Password: demo123
User Type: user
```

### Developer Accounts
```
CTO: aryan@cabinet.com / admin123
CEO: utkarsh@cabinet.com / admin123
COO: lucky@cabinet.com / admin123
```

## 🏗️ Developer Portal

### Access Requirements
- Must be logged in as a developer account
- Developer accounts have access to:
  - Developer Dashboard
  - Live Rides Management
  - Customer Feedback
  - Revenue Analytics

### Quick Access
1. Use "Quick Developer Demo" button
2. Or login with any developer credentials
3. Navigate to `/developer-dashboard`

## 🔧 Configuration

### Environment Variables
The application automatically detects Firebase configuration:
- `VITE_FIREBASE_API_KEY`: Firebase API Key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID
- `VITE_USE_FIREBASE_AUTH`: Set to 'true' for Firebase auth

### Firebase Setup
Firebase is pre-configured with fallback values:
- API Key: `AIzaSyA1YPpvErdlMlWoYMat1L0rxmvsqqVIdtY`
- Project ID: `cab-i-net-87713`
- Auth Domain: `cab-i-net-87713.firebaseapp.com`

## 🐛 Troubleshooting

### Google Login Not Working
1. Check browser console for errors
2. Ensure popup blockers are disabled
3. Verify Firebase configuration in test page
4. Check if running on HTTPS (required for Google auth)

### Demo Login Not Working
1. Check if `useNavigate` error appears in console
2. Ensure components are inside `BrowserRouter`
3. Verify demo credentials are correct

### Developer Portal Access Denied
1. Ensure you're logged in as a developer account
2. Check user type in authentication state
3. Try logging out and logging back in

## 📱 Features

### User Features
- 🚗 Ride Booking
- 📍 Real-time Location Tracking
- 💳 Payment Integration
- 👥 Social Features (Friends, Favorites)
- 🎮 Entertainment Integration
- 📊 Ride History & Analytics

### Developer Features
- 📊 Revenue Analytics
- 🚗 Live Ride Management
- 💬 Customer Feedback System
- 👥 User Management
- 📈 Performance Metrics

## 🛠️ Development

### Project Structure
```
client/
├── components/          # UI Components
├── hooks/              # Custom Hooks
├── pages/              # Page Components
├── lib/                # Utilities & Config
└── types/              # TypeScript Types
```

### Key Files
- `App.tsx`: Main application with routing
- `useUnifiedAuth.ts`: Unified authentication hook
- `useFirebaseAuth.ts`: Firebase authentication
- `useAuth.ts`: Demo authentication
- `TestAuthPage.tsx`: Authentication testing

### Adding New Features
1. Create component in `components/`
2. Add route in `App.tsx`
3. Update navigation as needed
4. Test with both auth systems

## 🚀 Deployment

### Netlify (Recommended)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Environment Variables for Production
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_USE_FIREBASE_AUTH=true
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This application supports both Firebase and demo authentication. Firebase is used by default for full functionality, while demo authentication is available for testing and development purposes.
# Cabi_Final
