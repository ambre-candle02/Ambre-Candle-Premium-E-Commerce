# 🕯️ Ambre Candle | Premium E-Commerce Platform

A luxury candle e-commerce platform built with **Next.js 15**, featuring advanced animations, interactive quiz, and a premium user experience.

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

### 🔐 **User Authentication**
- **Login/Signup**: Complete authentication flow
- **User Profile**: Personalized user experience
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

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Advance Veloria Candles"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
Advance Veloria Candles/
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
