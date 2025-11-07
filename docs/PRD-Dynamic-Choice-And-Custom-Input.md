# PRD: Dynamic Choice Types & Custom User Input

- **Version:** 1.0
- **Status:** In Development
- **Author:** Senior Frontend Engineer
- **Date:** 2024-08-01

## 1. Background

The "Choice-Driven Workflow" was a successful strategic pivot, shifting the user from an editor to a decision-maker. However, user feedback and analysis show that a one-size-fits-all "single choice" approach is still too rigid. Certain design phases are foundational (requiring a single path), while others are creative and benefit from combining multiple ideas. Furthermore, users must have an escape hatch if none of the AI's suggestions are suitable.

## 2. Problem Statement

The current workflow forces a single choice at every step. This prevents users from selecting multiple learning objectives or combining several activity ideas. It also provides no clear path for users to input their own content if the AI's suggestions miss the mark, forcing them to rely on the AI assistant chat, which is a less direct workflow.

## 3. Goals & Objectives

- **Primary Goal:** Enhance user agency and flexibility to create a truly customized and high-quality course plan.
- **Objective 1:** Differentiate between steps that require a single, foundational choice and steps that benefit from multiple selections.
- **Objective 2:** Implement a seamless way for users to provide their own custom content for any step.
- **Objective 3:** Ensure the system correctly processes and passes context from both single and multiple selections to subsequent steps.

## 4. Solution & Implementation Plan

### 4.1. Differentiated Choice Types

We will categorize each step to determine the appropriate input mechanism:

-   **Single Choice (Radio Buttons):** For foundational decisions that define the path forward.
    -   `Analysis`: The target audience is a single, core decision.
    -   `Outline`: The overall structure of the course should be cohesive and singular.
-   **Multiple Choice (Checkboxes):** For creative steps where multiple ideas can be combined.
    -   `Objectives`: A course can and often should have multiple learning objectives.
    -   `Activities`: A well-rounded course uses a variety of activities to engage learners.

### 4.2. "Other..." Custom Input

-   **Functionality:** Every step, regardless of type, will feature a final option labeled "Other...".
-   **UI Behavior:**
    -   When a user selects the "Other..." radio button or checkbox, a `textarea` will appear.
    -   The user can then type their own content directly into this field.
    -   If the user selects a different, AI-generated option, the "Other..." option will be deselected, and the `textarea` will hide.
-   **State Management:** The content from the `textarea` will be saved into the application's state as a `CourseOption` with a special flag (e.g., `isCustom: true`).

## 5. Technical Requirements

### 5.1. State Management (`BuilderContext`)

-   **`selectedObjectives` & `selectedActivities`**: These state variables must be changed from `CourseOption | null` to `CourseOption[]` to hold multiple selections.
-   **`selectOption` Logic:** This central function must be updated to:
    -   Handle toggling items in an array for multiple-choice steps.
    -   Handle replacing the current item for single-choice steps.
    -   Correctly manage the state of the custom input option.

### 5.2. AI Interaction (`createGenerationPrompt`)

-   The prompt generation logic must be updated. For steps that follow a multiple-choice step (e.g., `Outline` follows `Objectives`), the prompt must correctly aggregate and format the details from all selected options to provide complete context to the AI.

### 5.3. UI Component (`StepCard`)

-   The `StepCard` component will receive a new prop, `selectionType: 'single' | 'multiple'`.
-   It will conditionally render `<input type="radio">` or `<input type="checkbox">`.
-   It will contain the logic to render and manage the state of the "Other..." option and its associated `textarea`.

## 6. Success Metrics

-   **User Behavior:** Observation of users selecting multiple options in the "Objectives" and "Activities" steps.
-   **User Behavior:** Observation of users utilizing the "Other..." input field.
-   **Qualitative Feedback:** Positive user feedback regarding the increased flexibility and control over the course creation process.
