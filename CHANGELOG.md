# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2024-08-08

### Added
- **[FEATURE] Export to Markdown & PDF:** The application is no longer a dead-end. A new "Export" section appears upon course completion, allowing users to download their entire, structured course plan as a clean `.md` file or save it as a professional-looking PDF document, making the plan portable and actionable.

## [1.7.0] - 2024-08-07

### Added
- **[CORE] Session Persistence:** The application now automatically saves your entire course-building progress to your browser's local storage. If you refresh the page or close the tab, your work—including the course topic, all generated options, your selections, and even the AI chat history—will be restored automatically, preventing any loss of work.

## [1.6.0] - 2024-08-06

### Added
- **[CORE] Conversational AI with Memory:** Overhauled the AI Assistant to be fully conversational. It now remembers the history of your dialogue within a session, allowing for natural follow-up questions and refinements.
- **Gemini Best Practices:** Re-architected the chat feature to use the official `ai.chats.create` API, ensuring robust and efficient handling of conversation history.

### Changed
- **`BuilderContext.tsx`:** Refactored state management to maintain a stateful `Chat` session, which is created on-demand and reset when the course context changes to ensure the AI always has the latest information.

## [1.5.1] - 2024-08-05

### Changed
- **Roadmap Page:** Updated the public-facing Roadmap page to accurately reflect the current development status and future plans, ensuring transparency with users.

## [1.5.0] - 2024-08-04

### Added
- **AI Focus Mode:** Introduced an "Expand View" button in the AI Assistant. When clicked, the main content area collapses into a vertical icon-based navigation bar, allowing the chat interface to take up the majority of the screen for an improved conversational experience.

### Changed
- **UX Overhaul:** Refactored the main builder interface from a single, long-scrolling page into a tabbed view. Each step (`Analysis`, `Objectives`, etc.) is now a separate tab, improving navigation and reducing cognitive load. Tabs are unlocked progressively as the user completes previous steps.

## [1.4.2] - 2024-08-03

### Fixed
- **Markdown Rendering:** Corrected an issue where inline Markdown formatting (e.g., `**bold text**`) was not being rendered within the structured details of generated options in Steps 1, 3, and 4. All Markdown is now parsed and displayed consistently.
- **Sidebar Layout:** Fixed a layout bug causing the AI Assistant sidebar to resize vertically along with the main content. The sidebar is now sticky and maintains a constant height, preventing distracting page reflows.

## [1.4.1] - 2024-08-02

### Fixed
- **Critical Bug in Step 4:** Corrected a critical logic error that caused the application to crash when generating "Activities". The prompt generation was incorrectly trying to use context from `selectedActivities` (which were not yet created) instead of the correctly chosen `selectedObjectives`. This unblocked the core user workflow.

## [1.4.0] - 2024-08-02

### Added
- **New Component `OptionDetailView`:** Created a dedicated component to parse and render the AI-generated markdown details.
- **Structured Visual Display:** Instead of a plain markdown block, options are now displayed in a structured format with clear headings, key-value pairs, and lists.
- **Icons for Readability:** Added descriptive icons (for Persona, Goals, Needs, etc.) to each section within an option's details, making the content easier to scan and visually appealing.

### Changed
- **`BuilderView.tsx` (`StepCard`):** Replaced the generic `dangerouslySetInnerHTML` markdown rendering with the new `OptionDetailView` component. This improves both the UI and security by avoiding direct HTML injection where a structured parser is more appropriate.
- **UI/UX:** The overall appearance of the generated options is now significantly more polished, professional, and readable.

## [1.3.0] - 2024-08-01

### Added
- **Dynamic Choice Types:** Steps now support either single-choice (radio buttons) or multiple-choice (checkboxes) to better fit the nature of the decision being made (e.g., single choice for `Analysis`, multiple choice for `Objectives`).
- **Custom Input Option:** Added an "Other..." option to every step, allowing users to write their own content in a textarea instead of being limited to AI-generated choices.

### Changed
- **State Management:** `BuilderContext` now handles arrays of selections (`CourseOption[]`) for multiple-choice steps.
- **UI (`StepCard`):** The `StepCard` component has been significantly refactored to dynamically render radio buttons or checkboxes and to manage the state of the new custom input field.
- **AI Prompts:** Prompts for subsequent steps now correctly aggregate context from multiple selected options.

## [1.2.0] - 2024-07-31

### Added
- **Choice-Driven Generation Workflow:** Major strategic overhaul of the core user experience.
  - AI now generates 2-4 distinct options for each step (`Analysis`, `Objectives`, etc.) instead of a single output.
  - UI has been redesigned to present these options as a list of choices (radio buttons).
  - Users now act as decision-makers, selecting the best option to proceed, which then informs the context for the next step.
- **Structured JSON from AI:** Implemented `responseSchema` in Gemini API calls to ensure reliable, structured data (`{title, details}`) for each option.
- **New State Management:** `BuilderContext` was refactored to manage arrays of options and the single selected option for each step.

### Changed
- **`BuilderView.tsx`:** The `StepCard` component was completely rebuilt to display a list of selectable options instead of a single textarea.
- **`geminiService.ts`:** Added a new `callGeminiWithSchema` function to handle JSON mode requests separately.

## [1.1.0] - 2024-07-29

### Added
- **AI Agent Command Execution:** The AI Assistant can now understand user requests to modify course content and the application state is updated accordingly. This was achieved by using Gemini's JSON mode with a `responseSchema`.
- **Markdown Rendering:** The AI Assistant chat now correctly renders Markdown formatting (bold, lists, etc.), improving readability.
- **Public Roadmap Page:** Added a new "Roadmap" view to the application to transparently share the product's development plan.
- **JTBD & Opportunity Tree Documentation:** Formalized the product strategy by documenting the "Job to be Done," desired outcomes, and an Opportunity Solution Tree.

### Fixed
- The AI Assistant was previously a simple Q&A bot. It is now a functional agent capable of performing actions.
- Chat messages from the AI were displayed as plain text.

## [1.0.0] - 2024-07-28

### Added
- Initial release of the EduAI Builder.
- Core 3-step workflow (Analysis, Design, Finalize) based on a simplified ADDIE model.
- Integrated AI Assistant sidebar for conversational interaction.
- Basic project structure with React, TypeScript, and Tailwind CSS.
- Service layer for interacting with the Google Gemini API.