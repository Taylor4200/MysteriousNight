# Slot Game UI Specification for Fiverr Freelancers

## 🎯 Project Overview
We need a modern, responsive slot game UI built with **Svelte + PixiJS** that works seamlessly within a Stake iframe environment. The UI should follow modern gaming design principles similar to Hacksaw Gaming and Pragmatic Play.

## 📐 Viewport Specifications

### Primary Target Viewport
- **Main Viewport**: 1200x675 (Stake iframe)
- **Aspect Ratio**: 16:9 (1.778:1)

### Responsive Breakpoints
The UI must be responsive across these viewport sizes:

| Layout Type | Width | Height | Aspect Ratio | Use Case |
|-------------|-------|--------|--------------|----------|
| **Desktop** | 1422px | 800px | 1.778:1 | Primary target (Stake iframe) |
| **Landscape** | 1600px | 900px | 1.778:1 | Wide screens |
| **Tablet** | 1000px | 1000px | 1:1 | Square tablets |
| **Portrait** | 800px | 1422px | 0.563:1 | Mobile portrait |

### Responsive Behavior
- **Desktop/Landscape**: Full UI bar at bottom
- **Tablet**: Compact UI with stacked elements
- **Portrait**: Vertical layout with minimal UI

## 🎮 Core UI Components

### 1. 🍔 Burger Menu (3-line hamburger)
**Location**: Top-left or bottom-left
**Functionality**:
- **Sound Toggle**: On/Off with visual indicator
- **Info/Help**: Game rules and paytable
- **Turbo Mode**: Fast spin toggle
- **Settings**: Additional game options

**Design Requirements**:
- Clean 3-line hamburger icon
- Dropdown or slide-out menu
- Hover effects and smooth animations
- Accessible touch targets (min 44px)

### 2. 💰 Bet Size Display & Adjuster
**Location**: Bottom center-left
**Components**:
- **Current Bet Display**: Large, prominent number
- **Bet Increase Button** (+): Up arrow or plus icon
- **Bet Decrease Button** (-): Down arrow or minus icon

**Design Requirements**:
- Clear, readable font (Proxima Nova or similar)
- Prominent bet amount display
- Intuitive up/down controls
- Visual feedback on hover/press

### 3. 🎰 Spin Button
**Location**: Bottom center
**Functionality**:
- **Primary Action**: Start spin
- **State Changes**: 
  - Idle: "SPIN" text
  - Spinning: "STOP" text (to stop spin)
  - Disabled: Grayed out when can't spin

**Design Requirements**:
- **Large, prominent button** (primary CTA)
- **Circular or rounded rectangle** design
- **Eye-catching colors** (gold, orange, or brand colors)
- **Hover/press animations**
- **Disabled state styling**

### 4. 🔄 Auto Spin Button
**Location**: Bottom center-left (next to bet controls)
**Functionality**:
- **Auto Spin Options**: 10, 25, 50, 100, 250, 500, 1000 spins
- **Quick Selection**: Common options (10, 25, 50, 100)
- **Advanced Menu**: Full list with custom input

**Design Requirements**:
- **Toggle-style button** (on/off state)
- **Dropdown menu** with spin count options
- **Visual indicator** when auto spin is active
- **Stop auto spin** functionality

### 5. 🎁 Buy Bonus Component
**Location**: Bottom right
**Functionality**:
- **Bonus Buy Modal**: Full-screen overlay
- **Bet Size Controls**: Adjust bet within modal
- **Bonus Features**: All available bonus features
- **Feature Spins**: Special spin modes

**Modal Design Requirements**:
- **Full-screen overlay** with semi-transparent background
- **Bet adjustment controls** (up/down arrows)
- **Bonus feature cards** with:
  - Feature name and description
  - Cost multiplier (e.g., "100x bet")
  - Visual preview/icon
  - Buy button
- **Responsive grid layout** for bonus cards
- **Close button** (X) in top-right corner

## 🎨 Design System

### Color Palette
- **Primary**: Gold/Yellow (#FFD700, #FFA500)
- **Secondary**: Blue/Purple (#4A90E2, #9B59B6)
- **Background**: Dark (#1A1A1A, #2D2D2D)
- **Text**: White (#FFFFFF) and Light Gray (#CCCCCC)
- **Accent**: Red (#E74C3C) for warnings, Green (#27AE60) for wins

### Typography
- **Primary Font**: Proxima Nova (or similar sans-serif)
- **Headings**: Bold, 18-24px
- **Body Text**: Regular, 14-16px
- **Button Text**: Semi-bold, 16-18px
- **Numbers**: Monospace font for bet amounts

### Button Styles
- **Primary Button**: Rounded corners, gradient background, shadow
- **Secondary Button**: Outlined style, transparent background
- **Icon Button**: Circular, icon-centered
- **Hover Effects**: Scale (1.05x), brightness increase, shadow
- **Press Effects**: Scale (0.95x), darker colors

### Spacing & Layout
- **Base Unit**: 8px grid system
- **Button Padding**: 12px-16px vertical, 20px-24px horizontal
- **Component Spacing**: 16px-24px between elements
- **Border Radius**: 8px-12px for cards, 4px-8px for buttons

## 🔧 Technical Requirements

### Framework & Libraries
- **Svelte 5** with Runes ($state, $derived, $effect)
- **PixiJS** for game rendering
- **Responsive design** with CSS Grid/Flexbox
- **Touch-friendly** interactions (44px minimum touch targets)

### State Management
- **Bet Amount**: Current bet value
- **Balance**: Player's current balance
- **Win Amount**: Current win display
- **Auto Spin**: Active auto spin state and count
- **Sound**: Audio on/off state
- **Turbo**: Fast spin mode state

### Interactions
- **Click/Tap**: All buttons must be clickable
- **Hover**: Desktop hover effects
- **Keyboard**: Spacebar for spin, arrow keys for bet adjustment
- **Touch**: Swipe gestures for mobile

### Performance
- **60 FPS** animations
- **Smooth transitions** (200-300ms duration)
- **Optimized rendering** for iframe environment
- **Memory efficient** component lifecycle

## 📱 Responsive Design Guidelines

### Desktop (1200x675 - Primary)
- **Full UI bar** at bottom
- **All controls visible** in single row
- **Large touch targets** (60px minimum)
- **Hover effects** enabled

### Tablet (1000x1000)
- **Compact UI** with stacked elements
- **Reduced button sizes** (50px minimum)
- **Simplified menu** structure
- **Touch-optimized** spacing

### Portrait (800x1422)
- **Vertical layout** with minimal UI
- **Essential controls only** (spin, bet, auto)
- **Collapsible menu** system
- **Large touch targets** (60px minimum)

## 🎯 Implementation Priority

### Phase 1: Core Components
1. **Spin Button** (primary CTA)
2. **Bet Display & Controls**
3. **Auto Spin Button**
4. **Basic Menu Structure**

### Phase 2: Advanced Features
1. **Buy Bonus Modal**
2. **Sound Controls**
3. **Info/Help System**
4. **Turbo Mode**

### Phase 3: Polish
1. **Animations & Transitions**
2. **Responsive Optimization**
3. **Accessibility Features**
4. **Performance Tuning**

## 📋 Deliverables

### Required Files
- **Main UI Component**: `SlotUI.svelte`
- **Button Components**: `SpinButton.svelte`, `BetControls.svelte`, etc.
- **Modal Components**: `BuyBonusModal.svelte`, `MenuModal.svelte`
- **Responsive Layouts**: `DesktopLayout.svelte`, `TabletLayout.svelte`, `PortraitLayout.svelte`
- **Style Files**: `ui-styles.css` or component-specific styles

### Documentation
- **Component API** documentation
- **State management** guide
- **Responsive behavior** documentation
- **Integration** instructions

## 🎨 Design Inspiration
- **Hacksaw Gaming**: Clean, modern, minimalist
- **Pragmatic Play**: Professional, polished, accessible
- **NetEnt**: Smooth animations, intuitive controls
- **Play'n GO**: Responsive design, mobile-first approach

## ⚠️ Important Notes
- **Stake iframe compatibility** is critical
- **Performance optimization** for smooth gameplay
- **Accessibility compliance** (WCAG 2.1 AA)
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Mobile responsiveness** is mandatory
- **Touch-friendly** design for mobile devices

## 📞 Questions & Clarifications
If you need clarification on any aspect of this specification, please ask before starting development. We want to ensure the final product meets our exact requirements and integrates seamlessly with our existing game engine. 