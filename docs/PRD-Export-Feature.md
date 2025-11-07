# PRD: Export to Markdown & PDF

- **Version:** 1.0
- **Status:** Completed
- **Author:** Senior Frontend Engineer
- **Date:** 2024-08-08

## 1. Background

The EduAI Builder guides users through a comprehensive process to create a detailed course plan. However, the value of this process is severely limited if the final output remains trapped within the application. For the tool to be truly useful, users must be able to easily extract their completed work into a standard, portable format that they can share, archive, or use in other tools.

## 2. Problem Statement

The application currently lacks any export functionality, creating a "dead end" user experience. Users invest time and effort to build a course plan but have no way to get it out of the system. This is a critical gap that prevents user activation and makes the tool a novelty rather than a productive part of their workflow.

## 3. Goals & Objectives

- **Primary Goal:** Enable users to export their complete course plan into common, usable document formats.
- **Objective 1:** Implement a function to export the plan as a well-structured Markdown (`.md`) file.
- **Objective 2:** Implement a function to generate a clean, professional, and printable PDF version of the plan.
- **Objective 3:** Make the export functionality clearly visible and accessible only after the user has completed the core workflow.
- **Success Metric:** Users can successfully download and open both `.md` and PDF files that accurately reflect their work in the application.

## 4. Solution & Implementation Plan

The export functionality will be added to the "Course Plan Complete!" confirmation card that appears at the end of the workflow.

### 4.1. UI/UX

-   Two distinct buttons will be added to the completion card: "Export as Markdown" and "Export as PDF".
-   These buttons will be styled to indicate primary and secondary actions.

### 4.2. Markdown Export (`handleExportMarkdown`)

-   **Content Aggregation:** A function will gather all the selected data points from the `BuilderContext`:
    -   `courseTopic`
    -   `selectedAnalysis.title` & `selectedAnalysis.details`
    -   `selectedObjectives` (iterating over the array)
    -   `selectedOutline.title` & `selectedOutline.details`
    -   `selectedActivities` (iterating over the array)
-   **Formatting:** The aggregated content will be compiled into a single string with appropriate Markdown headings (`#`, `##`, `###`) to create a clear document structure.
-   **File Generation:**
    -   The final string will be converted into a `Blob` with `type: 'text/markdown'`.
    -   `URL.createObjectURL` will be used to generate a temporary download link.
    -   A temporary `<a>` element will be programmatically created, its `href` and `download` attributes set, and a `click()` event triggered to initiate the download.
    -   The filename will be dynamically generated, e.g., `Course-Plan-Advanced-Public-Speaking.md`.

### 4.3. PDF Export (`handleExportPdf`)

-   **Strategy:** Instead of using a heavy client-side PDF library (which can be unreliable), we will leverage the browser's built-in "Print to PDF" functionality. This is robust and produces high-quality results.
-   **Implementation:**
    -   The function will aggregate content similarly to the Markdown export.
    -   The `details` from each step, which are in Markdown, will be converted to HTML using the `marked.parse()` function.
    -   A new, temporary browser window/tab (`window.open()`) will be created.
    -   A complete, clean HTML structure (including a `<head>` with basic print-friendly CSS) will be written to the new window's document. The CSS will ensure good typography and layout for a standard A4 page.
    -   `newWindow.print()` will be called, which opens the browser's print dialog.
    -   The user can then select "Save as PDF" as their destination. This provides a universally compatible and high-fidelity result.

## 5. Technical Requirements

-   **File:** `views/BuilderView.tsx`.
-   **Dependencies:** The globally available `marked.min.js` script will be used for Markdown-to-HTML conversion. No new libraries are needed.
-   **Logic:**
    -   Implement the two handler functions: `handleExportMarkdown` and `handleExportPdf`.
    -   Add the buttons to the completion card's JSX, linking them to the handlers.
    -   Ensure the buttons are only rendered when `selectedActivities.length > 0`.