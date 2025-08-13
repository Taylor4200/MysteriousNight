# Reusable UI Components

This folder contains all the reusable UI components, styling, and utilities from the lines game that can be used to maintain consistent provider branding across multiple games.

## 📁 Folder Structure

```
reusable-ui-components/
├── components-ui-pixi/           # PIXI-based UI components
│   ├── components/               # Button, label, and layout components
│   ├── i18n/                    # Internationalization
│   ├── constants.ts             # UI sizing constants
│   ├── types.ts                 # TypeScript types
│   └── context.ts               # Context provider
├── components-ui-html/          # HTML-based modal components
│   └── components/              # Modal and popup components
├── components-layout/           # Layout system components
│   └── components/              # Responsive containers
├── utils-layout/                # Layout utilities
│   └── src/                     # Core layout system
├── constants-shared/            # Shared constants
├── state-shared/                # State management
├── utils-event-emitter/         # Event system
└── config-lingui/               # Internationalization config
```

## 🎯 Core UI Components (PIXI-based)

### Button Components
- **ButtonAutoSpin.svelte** - Auto-spin button with counter
- **ButtonBet.svelte** - Main spin/bet button
- **ButtonBetProvider.svelte** - Bet button state management
- **ButtonBetAutoSpinsCounter.svelte** - Auto-spin counter overlay
- **ButtonBuyBonus.svelte** - Buy bonus button
- **ButtonDecrease.svelte** - Bet decrease button
- **ButtonIncrease.svelte** - Bet increase button
- **ButtonMenu.svelte** - Menu hamburger button
- **ButtonMenuClose.svelte** - Menu close button
- **ButtonPayTable.svelte** - Paytable button
- **ButtonGameRules.svelte** - Info/rules button
- **ButtonSettings.svelte** - Settings button
- **ButtonSoundSwitch.svelte** - Sound toggle button
- **ButtonTurbo.svelte** - Turbo mode button
- **ButtonDrawer.svelte** - Drawer control button

### Label Components
- **LabelBalance.svelte** - Balance display
- **LabelBet.svelte** - Bet amount display
- **LabelWin.svelte** - Win amount display
- **LabelFreeSpinCounter.svelte** - Free spin counter
- **UiLabel.svelte** - Generic label component

### Layout Components
- **LayoutDesktop.svelte** - Desktop layout
- **LayoutTablet.svelte** - Tablet layout
- **LayoutLandscape.svelte** - Landscape mobile layout
- **LayoutPortrait.svelte** - Portrait mobile layout
- **MainContainer.svelte** - Main container with responsive positioning

### UI Utility Components
- **UiButton.svelte** - Base button component
- **UiSprite.svelte** - Sprite wrapper
- **UiFadeContainer.svelte** - Fade animation container
- **UiDoublePress.svelte** - Double press detection
- **SpinPanel.svelte** - Unified spin control panel

## 🎨 HTML Modal Components

### Modal Components
- **ModalAutoSpin.svelte** - Auto-spin configuration modal
- **ModalAutoSpinMessage.svelte** - Auto-spin messages
- **ModalBetMenu.svelte** - Bet amount selection modal
- **ModalBuyBonus.svelte** - Buy bonus modal
- **ModalBuyBonusConfirm.svelte** - Buy bonus confirmation
- **ModalError.svelte** - Error display modal
- **ModalGameRules.svelte** - Game rules modal
- **ModalPayTable.svelte** - Paytable modal
- **ModalSettings.svelte** - Settings modal

### Base Modal Components
- **BaseContent.svelte** - Modal content wrapper
- **BaseTitle.svelte** - Modal title
- **BaseScrollable.svelte** - Scrollable content
- **BaseButtonWrap.svelte** - Button container
- **BaseIcon.svelte** - Icon component
- **BaseButtonContent.svelte** - Button content

## 🎯 Layout & Responsive Utilities

### Layout System
- **createLayout.svelte.ts** - **CORE LAYOUT SYSTEM** - handles all responsive positioning
- **context.ts** - Layout context provider
- **MainContainer.svelte** - Responsive container
- **CanvasSizeRectangle.svelte** - Canvas size detection

### Layout Configuration Files
- **constants.ts** - UI sizing constants

## 🎨 Styling & Constants

### Constants
- **colors.ts** - Color definitions
- **zIndex.ts** - Z-index management
- **bet.ts** - Bet-related constants
- **time.ts** - Time constants

## 🔧 Core Utilities

### State Management
- **state-shared/** - All shared state management
- **utils-event-emitter/** - Event system
- **utils-layout/** - Layout utilities

### Internationalization
- **i18nDerived.ts** - UI text translations
- **config-lingui/** - Lingui configuration

## 🚀 Key Files for Mobile/Desktop Centering

1. **`utils-layout/src/createLayout.svelte.ts`** - **MOST IMPORTANT** - Handles all responsive breakpoints and positioning
2. **`components-layout/components/MainContainer.svelte`** - Responsive container with automatic centering
3. **Layout components** (`LayoutDesktop.svelte`, `LayoutPortrait.svelte`, etc.) - Device-specific layouts
4. **`components-ui-pixi/constants.ts`** - UI sizing constants for different devices

## 📋 Essential for New Games

**Must-have files for consistent UI:**
1. All `Button*.svelte` components from `components-ui-pixi/components/`
2. All `Layout*.svelte` components for responsive design
3. All modal components from `components-ui-html/components/`
4. `utils-layout/` - The entire layout system
5. `constants-shared/` - All constants
6. `state-shared/` - State management
7. `components-ui-pixi/constants.ts` - UI sizing
8. `components-ui-pixi/i18n/i18nDerived.ts` - Translations

## 🎯 Usage

To use these components in a new game:

1. Copy the entire `reusable-ui-components` folder to your new game
2. Import the components you need
3. Use the layout system for responsive positioning
4. Customize colors and styling as needed while maintaining the same structure

This will give you a complete, consistent UI system that maintains the same look and feel across all your games!









