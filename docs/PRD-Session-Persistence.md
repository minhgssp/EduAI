# PRD: Session Persistence via LocalStorage

- **Version:** 1.0
- **Status:** Completed
- **Author:** Senior Frontend Engineer
- **Date:** 2024-08-07

## 1. Background

The EduAI Builder is an interactive tool where users invest significant time and effort crafting a course plan. The current architecture is stateless between sessions; if a user accidentally closes their browser tab, refreshes the page, or experiences a browser crash, all their progress—including the topic, generated options, selections, and chat history—is permanently lost.

## 2. Problem Statement

The lack of session persistence creates a high-risk, high-friction user experience. Users are hesitant to commit to a lengthy session for fear of losing their work, which severely impacts user retention and satisfaction. A single accidental action can wipe out an entire session's progress, leading to extreme frustration and abandonment of the tool.

## 3. Goals & Objectives

- **Primary Goal:** Eliminate accidental data loss and provide a seamless, persistent user experience.
- **Objective 1:** Automatically save the entire application state to the user's browser on any change.
- **Objective 2:** Automatically restore the application state when the user returns to the application.
- **Objective 3:** Ensure the "Start Over" functionality correctly clears the saved state for a clean reset.
- **Success Metric:** A user can close and reopen their browser tab at any point in the workflow and find their progress exactly as they left it.

## 4. Solution & Implementation Plan

The chosen solution is to use the browser's `localStorage` API, which is simple, robust, and well-supported.

### 4.1. Data Storage
- **Mechanism:** The entire relevant state from `BuilderContext` will be serialized into a single JSON string.
- **Key:** This string will be stored in `localStorage` under a dedicated key (e.g., `eduai-builder-session`).
- **Data Scope:** The saved state will include:
    - `courseTopic`
    - `analysisOptions`, `selectedAnalysis`
    - `objectivesOptions`, `selectedObjectives`
    - `outlineOptions`, `selectedOutline`
    - `activitiesOptions`, `selectedActivities`
    - `chatHistory`

### 4.2. State Persistence (Saving)
- A `useEffect` hook will be implemented within `BuilderProvider`.
- This hook will have a dependency array containing all the state variables listed in the scope.
- Whenever any of these dependencies change, the effect will trigger, re-serializing the entire state and overwriting the existing key in `localStorage`.

### 4.3. State Hydration (Loading)
- The `useState` hooks in `BuilderProvider` will be initialized using a lazy initializer function.
- This function will attempt to read and parse the state from `localStorage` on the initial component mount.
- A `try...catch` block will be used during parsing to gracefully handle potential errors (e.g., corrupted data), falling back to the default empty state if parsing fails.

### 4.4. State Resetting
- The `resetBuilder` function will be updated to explicitly call `localStorage.removeItem()` with the dedicated key, in addition to resetting the React state.

## 5. Technical Requirements

- **File:** `contexts/BuilderContext.tsx`.
- **Logic:**
    - Implement a `useEffect` hook for saving state.
    - Modify `useState` initial values to load from `localStorage`.
    - Update `resetBuilder` to clear `localStorage`.
- **Error Handling:** Robustly handle JSON parsing errors to prevent the application from crashing on corrupted saved data.