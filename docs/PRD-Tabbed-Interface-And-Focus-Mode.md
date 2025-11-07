# PRD: Tabbed Interface & AI Focus Mode

- **Version:** 1.0
- **Status:** Completed
- **Author:** Senior Frontend Engineer
- **Date:** 2024-08-04

## 1. Background

The initial design of the EduAI Builder presented all course creation steps in a single, long-scrolling page. While straightforward, this design presents usability challenges as users progress and the page content grows. It requires excessive scrolling to navigate between steps, leading to a potential loss of context. Furthermore, the fixed-width AI assistant sidebar is restrictive during complex, conversational interactions where more screen real estate is beneficial.

## 2. Problem Statement

1.  **Poor Navigation:** The linear, top-to-bottom layout forces users to scroll extensively, leading to a poor user experience and making it difficult to focus on the current task.
2.  **Limited Interaction Space:** The AI assistant's confined screen real estate hinders readability and fluid interaction during lengthy or detailed conversations.

## 3. Goals & Objectives

- **Primary Goal:** Substantially improve the application's usability by creating a more focused and flexible workspace.
- **Objective 1:** Improve navigation and reduce cognitive load by organizing the builder steps into a clear, tabbed interface.
- **Objective 2:** Enhance the user's interaction with the AI assistant by providing an optional, expanded "focus mode".
- **Success Metric:** Reduced time on task for users, positive qualitative feedback on the new layout, and increased use of the AI assistant for complex queries.

## 4. Solution & Implementation Plan

### 4.1. Tabbed Interface
- **Action:** The vertical stack of `StepCard` components in `BuilderView` is replaced with a horizontal tab navigator.
- **Details:**
    - Each step (`Analysis`, `Objectives`, `Outline`, `Activities`) is represented by a distinct tab.
    - Tabs are progressively unlocked as the user completes the previous step, maintaining the guided workflow.
    - The UI displays only the content for the currently active tab, creating a clean and focused view.

### 4.2. AI Focus Mode
- **Action:** Introduce a toggle button in the AI assistant header to switch between "standard" and "focus" views.
- **Details:**
    - When activated, the main content area (containing the tabs) gracefully collapses into a narrow, icon-based navigation bar on the far left.
    - The AI assistant view expands to occupy the majority of the screen space.
    - This provides an immersive, distraction-free environment for interacting with the AI, ideal for refining content or brainstorming ideas.
    - The icon bar still allows for quick navigation between steps without leaving focus mode.

## 5. Technical Requirements

- **State Management (`BuilderView.tsx`):**
    - Introduce `activeStep: GenerationStep` state to track the currently selected tab.
    - Introduce `isChatExpanded: boolean` state to manage the focus mode.
- **UI Components:**
    - Create a reusable `Tab` component for the navigation bar.
    - Refactor `BuilderView` to conditionally render step content based on `activeStep`.
    - Create a new collapsed icon-based navigation view for when `isChatExpanded` is true.
- **Layout:**
    - Utilize Flexbox and conditional TailwindCSS classes to manage the animated transition between the standard and focus-mode layouts.
- **Props (`Sidebar.tsx`):**
    - The `Sidebar` component will receive `isChatExpanded` state and its setter function `setIsChatExpanded` as props from `BuilderView`.
