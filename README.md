# 🕯️ Ambre Candle | Premium E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Ambre Candle** is a high-performance, luxury e-commerce platform designed for artisanal fragrance brands. Built with the latest **Next.js 15** and **React 19**, it offers a prestigious shopping experience with a focus on visual excellence and seamless interactions.

---

## 🚀 Key Highlights

- **💎 Premium Aesthetics**: Curated design system with glassmorphism and golden accents.
- **📊 Smart Admin Dashboard**: Advanced order management and real-time data visualization.
- **🧠 Interactive Scent Quiz**: Lead-generation tool that matches users with their perfect fragrance.
- **⚡ Blazing Fast**: Fully optimized with Next.js App Router and server-side rendering.

---

## 🌐 Live Demo & Links

**🚀 [Live Site & Link](https://your-deployment-link.vercel.app)**

**📌 [GitHub Repository](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)**

---

## 🔐 Firebase Authentication Setup

### Firebase Configuration
- **Project ID**: `your-firebase-project-id`
- **Authentication**: Email/Password enabled
- **Status**: ✅ Fully Configured

### Test Credentials
```
Email: your-email@example.com
(Or create your own account via signup)
```

### Setup Instructions for Developers

1. **Firebase Project Settings**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your Firebase project
   - Navigate to Project Settings → General

2. **Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Firebase config from Project Settings:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Enable Authentication Methods**
   - Go to Authentication → Sign-in Method
   - Ensure "Email/Password" is enabled ✅

---

## ✨ Features

### 🛍️ **E-Commerce Functionality**
- **Product Catalog**: Browse luxury candles with filtering and sorting
- **Shopping Cart**: Real-time cart updates with local storage persistence
- **Wishlist**: Save favorite products for later
- **Checkout Flow**: Seamless checkout experience with order confirmation
- **Product Details**: Rich product pages with image galleries and descriptions

### 🎨 **Premium UI/UX**
- **Modern Design**: Clean, elegant interface with premium aesthetics
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop
- **Dark Theme Footer**: Professional gradient footer with social links
- **Interactive Elements**: Hover effects, micro-animations, and transitions

### 🧪 **Interactive Features**
- **Scent Soulmate Quiz**: 5-question interactive quiz to find perfect candle match
- **Smart Recommendations**: Personalized product suggestions based on preferences
- **Contact Form**: Professional contact page with success modal
- **Newsletter Signup**: Email subscription with validation

### 🔐 **User Authentication** (Firebase)
- **Email/Password Login**: Secure authentication with Firebase
- **User Registration**: Create new account with email verification
- **User Profile**: Personalized user experience with display name
- **Logout**: Secure session management
- **Protected Routes**: Secure checkout and order management

### 📱 **Pages**
- **Home**: Hero carousel, best sellers, featured collections
- **Shop**: Product grid with filters and sorting
- **Product Detail**: Individual product pages with full details
- **Quiz**: Interactive scent personality quiz
- **About**: Brand story and mission
- **Contact**: Contact form with location and social links
- **Cart**: Shopping cart management
- **Checkout**: Order placement and confirmation
- **Wishlist**: Saved products

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.12
- **React**: 19.0.0
- **Styling**: Custom CSS with CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter, Playfair Display)
- **State Management**: React Context API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase Account (with ambre-candle-product-catalog project configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd "Ambre Candle Product Catalog"
   ```

2. **Set up Firebase Configuration**
   - Copy `.env.local.example` to `.env.local`
   - Add your Firebase credentials (see [Firebase Authentication Setup](#-firebase-authentication-setup) section above)

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing the Application

**User Authentication**
- Go to [http://localhost:3000/login](http://localhost:3000/login)
- Try login with your registered admin email
- Or create new account at [http://localhost:3000/signup](http://localhost:3000/signup)

**Browse Products**
- Visit [http://localhost:3000/shop](http://localhost:3000/shop) to see all candles
- Try the interactive quiz at [http://localhost:3000/quiz](http://localhost:3000/quiz)

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The project is configured to auto-deploy from GitHub:
1. Push changes to `main` branch
2. Vercel automatically builds and deploys
3. View deployment at your Vercel URL

---

## 🔄 Migration to New GitHub Account

If you are moving this project to a new GitHub account, follow these steps:

1. **Change Git Remote**:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/NEW_USERNAME/NEW_REPO_NAME.git
   git push -u origin main
   ```

2. **Update Deployment (Vercel)**:
   - Connect the new repository to Vercel.
   - Copy all Environment Variables from your `.env.local` to the Vercel project settings.

3. **Firebase**:
   - No changes needed in Firebase Console unless you want to create a new project.
   - Just ensure the "Authorized Domains" in Firebase Authentication includes your new Vercel domain.

---

## 📂 Project Structure

```
Ambre Candle Product Catalog/
├── app/
│   ├── page.js              # Home page
│   ├── shop/                # Shop page
│   ├── product/[id]/        # Product detail pages
│   ├── quiz/                # Scent quiz page
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── cart/                # Cart page
│   ├── checkout/            # Checkout page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Footer.jsx       # Footer component
│   │   ├── Logo.jsx         # Brand logo
│   │   └── AnnouncementBar.jsx  # Top announcement
│   ├── context/
│   │   ├── CartContext.js   # Cart state management
│   │   ├── WishlistContext.js   # Wishlist management
│   │   └── AuthContext.js   # Authentication
│   └── styles/
│       ├── Navbar.css
│       ├── Footer.css
│       ├── Home.css
│       ├── Shop.css
│       └── ...
└── public/
    └── images/              # Product images
```

---

## 🎨 Customization

### Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --color-accent: #c9a05c;
  --color-bg-primary: #fdfbf7;
  --color-text-primary: #1a1a1a;
}
```

### Fonts
Update Google Fonts in `app/layout.js`:
```javascript
const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
```

### Content
- **Products**: Update product data in shop pages
- **Images**: Replace images in `public/images/`
- **Text**: Edit content in respective page components

---

## 🌟 Key Features Explained

### Scent Soulmate Quiz
- 5 interactive questions about preferences
- Smart algorithm to match user with perfect candle
- Beautiful results page with product recommendations
- Accessible via top announcement bar or `/quiz` route

### Contact Page
- Professional form with validation
- Success modal on submission
- Clickable contact information (email, phone)
- Social media integration
- Interactive map location

### Footer
- Clean 4-column layout
- Brand information and mission
- Quick links to all pages
- Social media icons with hover effects
- Responsive design

---

## 🐛 Known Issues & Solutions

### Hydration Error Fix
The cart/wishlist badges use client-side only rendering to prevent hydration mismatches:
```javascript
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);
{isMounted && totalItems > 0 && <span>{totalItems}</span>}
```

---

## 🔧 Recent Updates & Fixes (Feb 2026)

### Firebase Authentication ✅
- Fixed AuthProvider loading state issue
- Email/Password login integration
- User display name in navbar
- Proper error handling for duplicate emails
- Signup/Login flow fully working

### UI/UX Improvements ✅
- Fixed blank page on login route
- User profile dropdown menu
- Logout functionality
- Responsive auth pages
- Better error messages

### Deployment ✅
- GitHub repository updated
- Vercel auto-deployment configured
- Environment variables properly set
- Production build working

---

## 📝 License

© 2026 Ambre Candle Studio. All rights reserved.

---

## 🤝 Contributing

This is a showcase project. Feel free to fork and customize for your own use!

---

## 📧 Contact

For questions or feedback, visit the contact page at `/contact` or reach out via social media.

---

**Built with ❤️ and 🕯️**
