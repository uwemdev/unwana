# Unwana – Blockchain Security Platform

**Unwana** is a community-driven blockchain security platform developed for the **ICP25 Hackathon 2025**. It combines advanced threat detection algorithms with community intelligence to protect cryptocurrency users from scams, fraudulent wallet addresses, and malicious smart contracts.  

---

## 🚀 Project Overview
Unwana leverages the **ICP blockchain** to provide real-time scanning of wallet addresses, token contracts, and DApp URLs while enabling community-driven verification through voting, comments, and reputation scoring. All data is stored securely and transparently on-chain to ensure trust.

---

## 🔑 Core Features

### 1. Real-time Security Scanning
- **Multi-format Support:** Analyzes wallet addresses, token contracts, and DApp URLs  
- **Instant Analysis:** Sub-second scan results powered by ICP infrastructure  
- **Risk Scoring:** 0–100 risk assessment with a detailed breakdown  
- **Pattern Detection:** Advanced algorithms identify suspicious transaction patterns  

### 2. Community-Driven Intelligence
- **Voting System:** Users vote on scan results (Safe/Scam/Unsure)  
- **Comment System:** Share experiences and additional context on scans  
- **Reputation Scoring:** Community consensus builds over time  
- **Social Posts:** Twitter-like posting system with @mentions and #hashtags  

### 3. ICP Wallet Integration
- **Native ICP Support:** Built-in Internet Identity integration  
- **Seamless Authentication:** One-click wallet connection  
- **Session Persistence:** Maintains connection across page reloads  
- **Secure Identity:** Uses ICP’s cryptographic identity system  

---

## 🛠 Technical Architecture

### Frontend Stack
- React 18.3.1 with TypeScript  
- Vite for fast development  
- Tailwind CSS with a custom design system  
- Shadcn/ui component library  
- React Router for navigation  
- TanStack Query for state management  

### Blockchain Integration
- `@dfinity/agent` for ICP communication  
- `@dfinity/auth-client` for wallet connection  
- `@dfinity/identity` for user authentication  
- `@dfinity/principal` for identity management  

### Backend Services
- **Supabase** as the primary database  
- **Edge Functions** for Google search integration  
- **Real-time subscriptions** for live updates  
- **Row Level Security (RLS)** for data protection  

### Database Schema
- `users`: User profiles and wallet data  
- `search_results`: Scan results and risk assessments  
- `votes`: Community voting on scans  
- `comments`: Discussion threads on scans  
- `posts`: Social media-style community posts  
- `post_likes` / `post_comments`: Social engagement features  
- `wallet_sessions`: Session tracking and analytics  

---

## 📊 Key Components

### Scanner Engine
- Wallet address validation (multi-format)  
- Token contract analysis  
- DApp URL security checks  
- Pattern matching for known threats  
- Community consensus integration  

### Community Platform
- Real-time voting and threaded comments  
- Social posts with rich text support  
- User reputation tracking  
- Notifications  

### Analytics Dashboard
- Scan history tracking  
- Risk trend analysis  
- Community engagement metrics  
- Threat detection patterns  

---

## 🔒 Security Features

**Multi-layer Protection**
- Comprehensive input validation  
- Advanced risk assessment algorithms  
- Crowd-sourced threat intelligence  
- Real-time updates on new threats  

**Privacy & Security**
- Encrypted data at rest  
- RLS for database-level access controls  
- Secure wallet session handling  
- Privacy-preserving analytics  

---

## 🎨 User Experience
- Responsive and mobile-friendly design  
- Progressive Web App (PWA) support  
- Accessibility with screen reader and keyboard navigation  
- Dark/Light mode preferences  
- Sub-second scanning with optimistic UI feedback  

---

## 💼 Business Model & Sustainability
- **Free Core Features:** Basic scanning is always free  
- **Premium Analytics:** Advanced insights for power users  
- **API Access:** Developer integrations and enterprise partnerships  
- **Community Governance:** Decentralized decision-making  
- **Monetization:** Subscriptions, enterprise APIs, and partner integrations  

---

## 📅 Development Roadmap

### Phase 1 – Foundation (Completed)
- Core scanning functionality  
- ICP wallet integration  
- Community voting system  
- Basic UI/UX  

### Phase 2 – Enhancement (In Progress)
- Advanced threat detection algorithms  
- Mobile app development  
- API documentation and SDKs  
- Partnership integrations  

### Phase 3 – Scale (Planned)
- Multi-blockchain support  
- AI-powered threat detection  
- Governance token launch  
- Fully decentralized hosting on ICP  

---

## 🏆 Hackathon Achievements
- **Full-stack Implementation:** End-to-end solution  
- **ICP Integration:** Native blockchain functionality  
- **Community Features:** Social collaboration tools  
- **Security Focus:** Robust threat detection and reporting  

---

## 🌍 Social Impact
Unwana aims to make crypto safer by preventing scams, building trust through transparent results, and fostering a global, collaborative security network. The platform also educates users and promotes shared knowledge about blockchain security.

---

## 🔮 Future Vision
Unwana envisions becoming the **ultimate security layer for Web3**, featuring:
- Universal protection across multiple blockchains  
- AI-powered detection for emerging threats  
- Real-time alerts and monitoring  
- Developer APIs and SDKs  
- Community governance for long-term sustainability  

---

## 🧑‍💻 Team Roles
- Team Lead / Project Manager  
- Blockchain Developer (ICP Integration)  
- Backend Developer (Supabase & API)  
- Frontend Developer (React, Tailwind)  
- UI/UX Designer  
- Research and Data Analyst  
- QA and Community Manager  

---

## 📜 License
This project is developed for the **ICP25 Hackathon 2025**. License terms will be defined post-hackathon.

---

## 🔗 Links
- **ICP25 Hackathon:** [https://internetcomputer.org/hackathons](https://internetcomputer.org/hackathons)  
- **Project Logo:** Included in repository assets  

---
