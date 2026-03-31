# DocIntel AI - Detailed Design Document

## 1. Project Overview
**DocIntel AI** is a specialized research platform designed to simplify the complexity of Indian education policies (UGC, AICTE, MoE) and digital laws. It leverages AI-driven retrieval to provide instant, plain-English answers with direct source citations, bridging the gap between dense legal documents and end-user understanding.

---

## 2. Target Audience
- **Students:** Understanding scholarship eligibility, credit transfers, and academic regulations.
- **Researchers:** Tracking policy evolution and cross-referencing circulars.
- **Educators/Administrators:** Ensuring institutional compliance with national standards.
- **Policy Makers:** Analyzing the impact and accessibility of existing frameworks.

---

## 3. Core Features
### 3.1. AI Policy Assistant (RAG)
- **Natural Language Querying:** Users ask questions in plain English.
- **Context-Aware Analysis:** Uses Retrieval-Augmented Generation (RAG) to ensure accuracy.
- **Source Citations:** Every response includes links to official government documents.

### 3.2. Research Library & History
- **Search History:** Persistent log of previous inquiries stored locally.
- **Revisit Capability:** Quickly jump back into past analyses.

### 3.3. Account & Personalization
- **Scholar Profile:** Manage name, role, and institution.
- **Preferences:** Toggle email notifications and select interface language (English, Hindi, Sanskrit).

### 3.4. Adaptive Interface
- **Dual-Theme System:** Seamless switching between Light and Dark modes.
- **Responsive Design:** Optimized for desktop research and mobile quick-checks.

---

## 4. Technical Architecture

### 4.1. Frontend Stack
- **Framework:** React 18+ with TypeScript.
- **Routing:** `react-router-dom` for SPA navigation.
- **Styling:** Tailwind CSS (Utility-first approach).
- **Animations:** `framer-motion` for fluid transitions.
- **Icons:** `lucide-react`.

### 4.2. State Management
- **Theme Context:** Custom React Context for global theme state.
- **Local State:** `useState` for component-level data (forms, tabs).
- **Persistence:** `localStorage` for theme preference and search history.

### 4.3. AI Integration
- **Service Layer:** `generatePolicyResponse` function (integrating with Gemini API).
- **Prompt Engineering:** System instructions focused on factual accuracy and scholarly tone.

---

## 5. Design Principles

### 5.1. Aesthetic: "Editorial Technical"
- **Typography:** Hybrid of Serif (Playfair Display) for headings and Sans-Serif (Inter) for utility.
- **Grid System:** Visible borders and structured layouts reminiscent of high-end academic journals.
- **Color Palette:**
  - **Light Mode:** Brand Primary (`#1A4D3E` - Deep Emerald), Brand Secondary (`#8B2635` - Madder Lake).
  - **Dark Mode:** Dark Surface (`#151619`), Dark Primary (`#00FF00` - Neon Green accent).

### 5.2. User Experience (UX)
- **Minimalist Navigation:** Removed "About" section to focus on core utility (Ask/History).
- **Feedback Loops:** Loading states with animated pulses and bounce effects.
- **Accessibility:** High contrast ratios and clear focus states.

---

## 6. Component Structure

### 6.1. Layouts
- **DashboardLayout:** Shared sidebar and header for authenticated-style pages.

### 6.2. Pages
- **LandingPage:** High-impact hero section with feature highlights.
- **LoginPage:** Dual-tab (Sign In/Sign Up) with scholarly branding.
- **InquiryPage:** Chat-style interface for AI interaction.
- **HistoryPage:** Grid-based archive of past searches.
- **AccountPage:** Split-pane profile and settings management.

---

## 7. Data Models

### 7.1. History Item
```typescript
interface HistoryItem {
  tag: string;      // e.g., "POLICY INQUIRY"
  date: string;     // Formatted timestamp
  title: string;    // The user's query
  desc: string;     // Snippet of the AI response
}
```

### 7.2. User Profile
```typescript
interface UserProfile {
  name: string;
  email: string;
  role: string;
  institution: string;
  bio: string;
  notifications: boolean;
  language: string;
}
```

---

## 8. Future Roadmap
- **PDF Upload:** Allow users to upload specific institutional circulars for private analysis.
- **Multi-Lingual Voice:** Voice-to-voice interaction for policy queries.
- **Institutional Dashboard:** Admin view for tracking compliance across an entire university.
- **Real-Time Web Search:** Integration with Google Search grounding for breaking news on policy changes.
