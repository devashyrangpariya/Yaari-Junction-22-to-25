# College Memory Gallery 🎓

A modern, interactive web application showcasing four years of college memories (2022-2025) with advanced animations, glassmorphism design, and seamless user experience.

## 🌟 Project Overview

This digital time capsule captures the essence of our college journey, featuring:
- **800+ memories** across 4 years
- **13 amazing friends** with their stories
- **Advanced animations** using Framer Motion
- **Glassmorphism design** with modern UI principles
- **Mobile-first responsive** design
- **Performance optimized** for all devices

## 🎨 Design Principles

### Glassmorphism
- Semi-transparent backgrounds with backdrop blur
- Subtle borders and soft shadows
- Layered depth with proper visual hierarchy
- Modern, clean aesthetic

### Animation Philosophy
- Smooth, purposeful animations that enhance user experience
- Performance-optimized with reduced motion for low-end devices
- Staggered entrance animations for visual appeal
- Interactive hover states and micro-interactions

## 📁 Folder Structure

```
college/
├── app/                          # Next.js app directory
│   ├── home/                     # Homepage with hero and stats
│   ├── gallery/                  # Image gallery with filtering
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── gallery/                  # Gallery-specific components
│   │   ├── ScrollableGallery.js  # Main gallery with infinite scroll
│   │   ├── EnhancedImageCard.js  # Optimized image card
│   │   ├── ImageLightbox.js      # Full-screen image viewer
│   │   └── data/                 # Gallery data
│   ├── layout/                   # Layout components
│   │   ├── Navigation.js         # Mobile navigation
│   │   ├── Header.js             # Site header
│   │   └── Footer.js             # Site footer
│   └── ui/                       # UI components
├── lib/                          # Utilities and configurations
│   ├── constants.js              # App constants and data
│   ├── animations.js             # Animation configurations
│   └── hooks/                    # Custom React hooks
└── public/                       # Static assets
    ├── images/                   # Image assets
    └── audio/                    # Background music
```

## ✨ Features & Usage

### 🏠 Homepage
- **Hero Section**: Animated background with 3D parallax effects
- **Stats Section**: Interactive statistics with glassmorphism cards
- **Background Music**: Optional audio with volume controls
- **Smooth Scroll**: Seamless navigation between sections

### 🖼️ Gallery
- **Year Filtering**: Browse memories by year (2022-2025)
- **Image Lightbox**: Full-screen viewing with navigation
- **Batch Download**: Download entire years as ZIP files
- **Mobile Optimized**: Touch-friendly interface
- **Lazy Loading**: Performance-optimized image loading

### 📱 Mobile Experience
- **Touch Gestures**: Swipe navigation support
- **Responsive Design**: Optimized for all screen sizes
- **Performance**: Reduced animations for low-memory devices
- **Accessibility**: Screen reader and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd college
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Technologies Used

- **Framework**: Next.js 15.4+ with App Router
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion 12.23+
- **Icons**: React Icons (Heroicons)
- **Image Processing**: Built-in Next.js Image optimization
- **Audio**: HTML5 Audio with React controls
- **File Handling**: JSZip for batch downloads

## 🎵 Audio Features

- **Background Music**: Immersive audio experience
- **Volume Control**: Adjustable volume with mute option
- **Auto-play**: Starts on user interaction
- **Visual Equalizer**: Animated audio visualization
- **Persistence**: Remembers user preferences

## 📊 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Images load as needed
- **Code Splitting**: Automatic route-based splitting
- **Mobile Optimization**: Reduced animations for performance
- **Caching**: Intelligent caching strategies
- **Bundle Analysis**: Built-in bundle analyzer

## 🎯 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## 🤝 Contributing

This is a personal project showcasing college memories. While contributions aren't expected, suggestions for improvements are welcome!

## 📝 License

This project is for personal use and showcases college memories from 2022-2025.

## 👥 Credits

**Friends Featured**: Fenil, Preetraj, Om, Vansh, Meet, Maharshi, Divy, Ansh, Kevel, Rudra, Smit, Devashy, Deepak

**Developer**: Devashy Rangpariya  
**Design**: Modern glassmorphism with advanced animations  
**Music**: Background audio for enhanced experience  

---

*Built with ❤️ to preserve memories of an amazing college journey (2022-2025)*