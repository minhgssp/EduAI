# PRD: UI/UX Polish & Bug Fixes

- **Version:** 1.0
- **Status:** Completed
- **Author:** Senior Frontend Engineer
- **Date:** 2024-08-03

## 1. Background

Following the successful implementation of the `OptionDetailView` component (v1.4.0), minor UI inconsistencies and layout bugs were identified that detract from the overall professional feel of the application. These issues, while not critical blockers, create a jarring user experience and need to be addressed to maintain a high quality standard.

## 2. Problem Statement

1.  **Inconsistent Markdown Rendering:** The custom parser in `OptionDetailView` correctly handles structured data (like `### Persona`) but fails to render standard inline Markdown (like `**bold text**`) within paragraphs or list items. This leads to inconsistent text formatting across different steps.
2.  **Unstable Sidebar Layout:** The height of the AI Assistant sidebar is currently coupled to the height of the main content column. As the main content expands (e.g., when a user generates options), the sidebar also stretches vertically, causing distracting layout shifts.

## 3. Goals & Objectives

- **Primary Goal:** Improve UI consistency and stability for a smoother, more professional user experience.
- **Objective 1:** Ensure all Markdown, including inline formatting, is rendered correctly and consistently in all `OptionDetailView` instances.
- **Objective 2:** Decouple the sidebar height from the main content, making it a fixed, sticky element on the page.

## 4. Solution & Implementation Plan

### 4.1. Markdown Rendering Fix
- **Action:** Modify the `OptionDetailView` component. For any text content (like key-value pairs, list items, or paragraphs), pipe the string through the `marked.parseInline()` or `marked.parse()` function before rendering.
- **Rationale:** This leverages the existing `marked.js` library to handle all standard Markdown syntax, while our custom parser continues to provide the high-level structure (sections, icons). It combines the best of both approaches.

### 4.2. Sticky Sidebar Fix
- **Action:** Refactor the layout CSS in `BuilderView.tsx`.
    - Apply `items-start` to the main flex container to align items to the top.
    - Make the sidebar container `sticky` and set its `top` position.
    - Apply a maximum height to the sidebar's inner container (e.g., `h-[calc(100vh-3rem)]`) to ensure it fits within the viewport and becomes scrollable if its content overflows.
- **Rationale:** This uses standard CSS properties (`position: sticky`) to achieve the desired layout without complex JavaScript. It's a robust and performant solution for creating fixed sidebars.

## 5. Success Metrics
- **Visual Confirmation:** All bolded text (`**text**`) and other Markdown formats render correctly within the option details.
- **Behavioral Confirmation:** The sidebar remains in a fixed position with a consistent height, regardless of how long the main content column becomes. The application feels more stable and polished.