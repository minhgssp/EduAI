# PRD: Visual Enhancement for AI-Generated Options

- **Version:** 1.0
- **Status:** In Development
- **Author:** Senior Frontend Engineer
- **Date:** 2024-08-02

## 1. Background

While the choice-driven workflow is effective, the presentation of the AI-generated options is basic. The content for each choice is rendered as a single block of markdown, which can be dense and difficult for users to scan and compare quickly. To elevate the user experience and reinforce the product's professionalism, a more sophisticated visual presentation is needed.

## 2. Problem Statement

The current UI renders AI-generated details as plain, unstyled markdown. This lacks visual hierarchy and structure, forcing users to read through blocks of text to extract key information like "Learner Persona," "Goals," and "Learning Needs." This increases cognitive load and slows down the decision-making process.

## 3. Goals & Objectives

- **Primary Goal:** Improve the scannability, readability, and aesthetic appeal of the AI-generated options.
- **Objective 1:** Transform the plain markdown output into a structured, visually organized format.
- **Objective 2:** Introduce visual cues like icons and styled headings to help users quickly identify different sections of content.
- **Objective 3:** Implement this enhancement without relying on `dangerouslySetInnerHTML`, improving security and maintainability.
- **Success Metric:** Users can more quickly understand and compare the differences between options. The UI feels more polished and professional.

## 4. Proposed Solution: `OptionDetailView` Component

A new dedicated component, `OptionDetailView.tsx`, will be created to handle the parsing and rendering of the `details` markdown string.

### 4.1. Parsing Logic
- The component will contain a simple parser that splits the markdown string by line.
- It will be designed to recognize specific patterns used in our AI prompts:
    - `### Section Title`: To identify the start of a new section.
    - `**Key:** Value`: To identify key-value pairs.
    - `- List Item`: To identify list items.

### 4.2. Rendering Logic
- Once parsed, the component will map over the structured data.
- **Sections:** Each `###` title will be rendered as a styled heading, paired with a relevant icon (e.g., a user icon for "Learner Persona").
- **Key-Value Pairs:** Will be rendered with the "Key" in a bold, heavier font weight to distinguish it from the "Value."
- **Lists:** Will be rendered as standard HTML `<ul>` and `<li>` elements with appropriate styling for readability.
- **Layout:** The content within each section will be visually nested (e.g., indented with a subtle left border) to create a clear visual hierarchy.

### 4.3. Fallback Mechanism
- If the parser fails to find any recognizable structure in the markdown, it will gracefully fall back to rendering the content using the standard `marked.js` library to ensure nothing breaks if the AI's output format is unexpected.

## 5. Technical Requirements

- **New Component:** `components/OptionDetailView.tsx`.
- **Dependencies:** None. Will use standard React and Tailwind CSS. SVG icons will be embedded directly in the component for simplicity.
- **Integration:** The `StepCard` component in `views/BuilderView.tsx` will be updated to import and use `OptionDetailView` instead of its local `renderMarkdown` function.
- **Security:** This approach eliminates the use of `dangerouslySetInnerHTML` for this feature, which is a best practice.