# 🎓 RivisOnly — Your AI Study Partner & Focus Sanctuary

<div align="center">

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Study Smarter. Retain Deeper. Built for Pure Focus.**

An architectural, distraction-free digital study sanctum crafted for scholars, engineers, and focused minds. RivisOnly integrates synchronized virtual study rooms, AI-powered spaced repetition, active 1v1 recall duels, a full markdown notes vault, and an ambient floating lo-fi radio into one cohesive workspace.

[Explore Features](#-core-features) • [Quick Start](#-quick-start) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Project Structure](#-project-structure)

</div>

---

## 🌟 Why RivisOnly?

Most modern study workflows require juggling 5+ disjointed applications: a standalone timer, noisy chat apps, music players, flashcard decks, and messy note trees. **RivisOnly** consolidates the entire cognitive cycle into a unified, high-aesthetic ecosystem:

```
[ Focus (Pomodoro) ] ──▶ [ Note & Vault ] ──▶ [ Spaced Repetition ] ──▶ [ 1v1 Duels ] ──▶ [ Deep Analytics ]
          │                                                                                       │
          └───────────────────── Ambient Lo-Fi & Co-Working Rooms ────────────────────────────────┘
```

---

## ✨ Core Features

### ⏱️ 1. Pomodoro Focus Studio
- **Configurable Cadence**: Classic 25/5 min Pomodoro, 50/10 min Deep Focus intervals, or custom cycles.
- **Session Goals & Task Linking**: Bind Pomodoros directly to target subjects and deliverables.
- **Visual Progress & Streak Tracking**: Live circular timers, audio cues, and continuous daily streak mechanics.

### 👥 2. Virtual Study Rooms & Peer Co-Working
- **Silent Accountability**: Co-study alongside peers with live subject statuses and synchronized work pulses without awkward webcam pressure.
- **Topic Rooms**: Dedicated study spaces categorized by disciplines (e.g., Computer Science, Medicine, Mathematics, Humanities).
- **Commitment Tracker**: Stake intentional hours for each study block to build mutual accountability.

### ⚔️ 3. 1v1 Active Recall Duels
- **Gamified Mastery Testing**: Challenge classmates or study buddies to live 10-question rapid quiz duels.
- **High-Yield Concept Testing**: Solidify key formulas, definitions, and theories under pressure before exams.
- **Leaderboards & Skill Ratings**: Track your recall speed, accuracy, and win streaks.

### 🧠 4. AI-Powered Spaced Repetition & Revision
- **Ebbinghaus Decay Curve Tracking**: Predicts memory decay and flags critical concepts right before you forget them.
- **Smart Key Points Extraction**: Auto-condense notes and study material into concise bulleted takeaways.
- **Interactive Flashcards & Quizzes**: Multi-mode testing (flashcards, multi-choice, proficiency tests) to cement long-term retention.

### 📝 5. Notes Vault & Markdown Workspace
- **Distraction-Free Editor**: Native Markdown editor supporting headings, code blocks, checklists, and formulas.
- **Hierarchical File Tree**: Group notes into nested subject folders and tags.
- **Revision Reminders**: Schedule spaced reminders directly from individual notes.

### 📊 6. Cognitive Analytics & Deep Study Metrics
- **Visual Heatmaps & Charts**: Interactive study time distributions powered by Recharts.
- **Cognitive Peak Analysis**: Discover your peak productivity hours and most challenging subjects.
- **Completion Milestones**: Track daily, weekly, and monthly goal completions.

### 🎵 7. Integrated Lo-Fi Sanctuary
- **Floating Ambient Radio**: Unobtrusive, collapsible player accessible across all pages.
- **Royalty-Free Tracks**: Curated collection of focus-inducing lo-fi beats, rain ambiences, and binaural textures.

### 🌓 8. Bespoke Light & Dark Themes
- Seamlessly transition between warm terracotta slate dark mode and clean parchment daylight aesthetics with full CSS variable design tokens.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Design Tokens |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Data Visualizations** | [Recharts](https://recharts.org/) + [React Circular Progressbar](https://github.com/kevinsqi/react-circular-progressbar) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Code Quality** | [Oxlint](https://oxc.rs/) |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ashmit-kansal/RivisOnly.git
   cd RivisOnly
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to start focusing!

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Runs the Vite local development server with Hot Module Replacement (HMR) |
| `npm run build` | Bundles and optimizes the production build into the `/dist` directory |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Lints the codebase with Oxlint for ultra-fast validation |

---

## 📂 Project Structure

```text
RivisOnly/
├── public/                     # Static assets and icons
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                 # Brand illustrations & SVG assets
│   ├── components/
│   │   ├── auth/               # LoginModal, SignupModal
│   │   ├── layout/             # Navbar, Footer
│   │   ├── lofi/               # LofiPlayer (floating radio)
│   │   └── ui/                 # Reusable UI elements (Modal, Logo, ProgressBar)
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication state
│   │   └── ThemeContext.jsx    # Dark / light theme provider
│   ├── data/                   # Mock data & audio soundscape registries
│   │   ├── lofiTracks.js
│   │   ├── mockNotes.js
│   │   ├── mockRevision.js
│   │   ├── mockRooms.js
│   │   └── mockStats.js
│   ├── features/
│   │   ├── analytics/          # Study charts and productivity metrics
│   │   ├── notes/              # Note editor, file tree & reminders
│   │   ├── pomodoro/           # Focus timer & interval engine
│   │   ├── revision/           # Spaced repetition, flashcards & quizzes
│   │   └── rooms/              # Live study rooms, peer presence & duels
│   ├── pages/                  # Top-level view routes
│   │   ├── Landing.jsx
│   │   ├── Pomodoro.jsx
│   │   ├── StudyRooms.jsx
│   │   ├── NotesVault.jsx
│   │   ├── Revision.jsx
│   │   └── Analytics.jsx
│   ├── App.jsx                 # Routing and layout shell
│   ├── index.css               # Design system tokens and global styles
│   └── main.jsx                # Application root entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🤝 Contributing

Contributions, feature suggestions, and feedback are warmly welcomed!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m "Add some AmazingFeature"`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ☕ and passion by <a href="https://github.com/Ashmit-kansal">Ashmit Kansal</a></sub>
</div>
