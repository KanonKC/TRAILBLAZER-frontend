# 🚀 TRAILBLAZER Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**TRAILBLAZER** is a cutting-edge dashboard and streaming overlay system designed to elevate the Twitch streaming experience. Built with a modular, feature-first architecture, it provides creators with powerful tools to interact with their community and manage their content seamlessly.

---

## ✨ Core Features

The application is built on a **Modular Widget System**, allowing for rapid development and deployment of new streaming tools:

- 🔗 **Account Binding**: Securely sync Twitch and other third-party accounts.
- 🎬 **Video Export**: Streamlined handling and exporting of Twitch VODs and clips.
- 📢 **Clip Shoutout**: Automated, visual shoutouts for community members.
- 🎮 **Gaming Widgets**: Dedicated tools like the *Random DBD Perk* generator.
- 🖼️ **Overlay Management**: Dynamic streaming overlays including *Drop Image* and real-time chat interactions (*First Word*).
- ☁️ **Asset Management**: Integrated file uploads with AWS S3 support.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (React 19) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/), Radix UI, Lucide React |
| **State & Logic** | Custom Hooks (Controller-View Pattern) |
| **Visuals** | Three.js (3D), @xyflow/react (Node-based workflows) |
| **API Client** | Axios (with relative proxying) |
| **Storage** | AWS SDK for S3 |

---

## 🏗️ Architecture

Trailblazer follows a **Feature-Based Modular Architecture**. All business logic and domain-specific code is encapsulated within the `features/` directory.

### Directory Structure
```text
app/                # Next.js App Router (Routing only)
├── dashboard/      # User management and settings
└── overlays/       # Streaming overlay views
features/           # Modular Domain Logic (The Core) 🟢
└── [feature-name]/
    ├── components/ # Local UI pieces
    ├── hooks/      # THE CONTROLLER (Business Logic & State)
    ├── api/        # THE REPOSITORY (Pure API calls)
    └── types.ts    # Domain-specific Typescript interfaces
components/         # Shared UI Design System (Shadcn + Custom)
lib/                # Core infrastructure (api-client.ts)
services/           # Shared/Legacy API wrappers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm or pnpm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `example.env` to `.env`
   - Fill in the required values (Twitch Login, API URLs, etc.)

### Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build
To create a production build:
```bash
npm run build
npm run start
```

---

## 📏 Development Guidelines

To maintain visual excellence and code quality, please adhere to the following rules:

1. **Visual Priority**: Always use **shadcn/ui** components first.
2. **Typography**: Smallest font-size is `text-sm`. **Do not use `text-xs`**.
3. **Design System**: Avoid using the primary CI color (`#FF8C00`) in input components.
4. **Clean Logic**: Never put complex state or API logic directly in the View component. Always extract it into a custom hook in the feature's `hooks/` directory.
5. **API Proxy**: Use the central `apiClient` in `lib/api-client.ts`. Relative URLs are mandatory for client-side calls to ensure proxy stability.

---

## 🔗 Ecosystem

TRAILBLAZER is part of a larger ecosystem:
- [TRAILBLAZER-backend](https://github.com/KanonKC/TRAILBLAZER-backend): High-performance Node.js API.
- [TRAILBLAZER-extension](https://github.com/KanonKC/TRAILBLAZER-browser-extension): Chrome extension for enhanced Twitch integration.

---

## 📄 License

This project is private and intended for internal use only.
