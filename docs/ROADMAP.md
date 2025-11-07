# Product Roadmap for EduAI Builder

This document outlines the strategic direction and feature prioritization for the EduAI Builder, guided by our core [JTBD and Opportunity Solution Tree](JTBD-Opportunity-Roadmap.md).

## Recently Shipped 🚀

-   **[FEATURE] Export to Markdown / PDF (v1.8.0)**
    -   **Why:** The application is a "dead end" if users cannot easily get their completed plan out to use it. This is critical for activation and makes the tool truly useful.
    -   **What:** Added "Export" buttons that convert the final, structured course plan into a clean Markdown file or a printable PDF document.
    -   **PRD:** [PRD-Export-Feature.md](PRD-Export-Feature.md)
    -   **Status:** `Shipped`

-   **[CORE] Session Persistence via `localStorage` (v1.7.0)**
    -   **Why:** Users lose all their work if they accidentally close the tab, which is a major point of friction and kills retention.
    -   **What:** Automatically save the entire builder state to the browser's `localStorage` on any change. On page load, check for saved state and restore it.
    -   **PRD:** [PRD-Session-Persistence.md](PRD-Session-Persistence.md)
    -   **Status:** `Shipped`

-   **[CORE] Conversational AI with Memory (v1.6.0)**
    -   **Why:** The AI assistant was stateless, unable to handle follow-up questions, which is a core expectation for a chatbot.
    -   **What:** Re-architected the chat feature to use Gemini's official Chat API (`ai.chats.create`). The assistant now remembers the conversation history within a session, making interaction natural and intuitive.
    -   **PRD:** [PRD-Conversational-Chatbot.md](PRD-Conversational-Chatbot.md)

-   **[UI/UX] Tabbed Interface & AI Focus Mode (v1.5.0)**
    -   **Why:** The previous long-scrolling layout was cumbersome and the fixed-size AI chat was restrictive for long conversations.
    -   **What:** Replaced the scrolling view with a clean, tab-based navigation for builder steps. Introduced an "Expand" mode for the AI Assistant, collapsing the main view into an icon bar and giving the chat full focus.

-   **[UI POLISH] UI Consistency & Stability (v1.4.2)**
    -   **Why:** To address minor but noticeable UI bugs that detracted from the professional user experience.
    -   **What:** Fixed inconsistent Markdown rendering in option details and stabilized the AI Assistant sidebar layout to prevent distracting resizing.

-   **[BUG FIX] Critical Workflow Fix (v1.4.1)**
    -   **Why:** A bug was preventing users from completing the full course generation workflow.
    -   **What:** Corrected a critical logic error in the prompt generation for the "Activities" step.

-   **[UI/UX] Structured Option Display (v1.4.0)**
    -   **Why:** To improve the scannability and readability of AI-generated content.
    -   **What:** Created a new `OptionDetailView` component that parses and displays choices in a structured format with icons and clear headings, making it easier for users to compare options.

-   **[FEATURE] Dynamic Choices & Custom Input (v1.3.0)**
    -   **Why:** The "single choice" model was too restrictive. Users needed more flexibility to combine ideas or add their own.
    -   **What:** Refactored steps to support both `single-choice` and `multiple-choice`, and introduced an "Other..." option with a textarea for custom user input.
    -   **PRD:** [PRD-Dynamic-Choice-And-Custom-Input.md](PRD-Dynamic-Choice-And-Custom-Input.md)


## Now (Ready for Next Sprint / P0)

The backlog is being prioritized. The next item to be worked on is at the top of the "Next" list.

## Next (Top of Backlog / P1)

These features address the most significant user pain points and opportunities after the current work is complete.

-   **[TECH DEBT] Refactor Prompt Generation Logic**
    -   **Why:** The current `createGenerationPrompt` function uses a large `switch` statement. A recent critical bug was caused by a copy-paste error within this logic. As we add more complexity, this function becomes harder to maintain and more prone to errors.
    -   **What:** Break down the monolithic prompt generation function into smaller, more modular, and testable units. This will improve maintainability and reduce the risk of future bugs.
    -   **Status:** `Planned`

## Later (Future Considerations / P2+)

These are valuable ideas that we will explore once the core experience is stable and robust.

-   **[FEATURE] Enhanced Context & Customization**
    -   **Why:** To improve the quality of the initial AI generation.
    -   **What:** Add initial setup fields for users to specify context like "Total Course Duration," "Learner Seniority Level," or "Delivery Format (Online/In-person)."

-   [FEATURE] Template Library
    -   **Why:** To accelerate the process for common course types.
    -   **What:** Create a library of pre-configured templates for popular topics like "New Manager Training," "Sales Onboarding," or "Technical Skills Workshop."

-   **[PLATFORM] Collaboration Features**
    -   **Why:** Course design is often a team effort.
    -   **What:** Explore real-time collaboration features allowing multiple stakeholders to view and comment on a course plan.