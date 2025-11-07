# PRD: Choice-Driven Generation Workflow

- **Version:** 1.0
- **Status:** In Development
- **Author:** Senior Frontend Engineer
- **Date:** 2024-07-31

## 1. Background

Based on strategic review, a key limitation of the current workflow is its linear, single-option nature. The AI provides one generated output per step, forcing the user into an editorial role rather than a strategic, decision-making one. To significantly enhance the quality of the final course plan, we need to empower the user to make critical choices throughout the design process.

## 2. Problem Statement

The current single-output generation process limits user agency and relies too heavily on the quality of a single AI response. Users cannot explore different pedagogical approaches or content structures without tedious manual regeneration and editing. This restricts creativity and diminishes the user's sense of ownership over the final product.

## 3. Goals & Objectives

- **Primary Goal:** Transform the user from a content editor into a strategic decision-maker in the course design process.
- **Objective 1:** Enable the AI to generate multiple, distinct, high-quality options for each step of the course creation process (Analysis, Objectives, etc.).
- **Objective 2:** Redesign the UI to present these options clearly, allowing the user to compare and select the best path forward.
- **Objective 3:** Ensure the user's choice at one step directly and logically informs the generation of options at the next step.
- **Success Metric:** Increase in user satisfaction and perceived quality of the final output.

## 4. Proposed Solution: The Choice-Driven Workflow

Instead of generating a single block of text, the AI will be prompted to generate an array of 2-4 distinct options for each step. Each option will have a concise `title` summarizing the approach and `details` containing the full text.

### User Flow:
1.  User clicks "Generate" for the "Analysis" step.
2.  The UI displays 3 options, e.g., "Focus on New Graduates", "Focus on Experienced Professionals", "Blended Audience Approach".
3.  The user can expand or review the details for each option.
4.  The user selects one option via a radio button. This selection becomes the confirmed content for the "Analysis" step.
5.  The "Objectives" step is now unlocked. When the user clicks "Generate" for Objectives, the *content of the selected Analysis option* is passed as context to the AI.
6.  This process repeats for all subsequent steps.

## 5. Technical Requirements

### 5.1. AI Interaction (JSON Mode)

The `generateStep` function will use the Gemini API with a strict `responseSchema` to ensure a reliable output structure.

**Required `responseSchema`:**
```typescript
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      description: "An array of 2 to 4 distinct options for the current course design step.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A short, descriptive title for this option (e.g., 'Project-Based Learning Approach')."
          },
          details: {
            type: Type.STRING,
            description: "The full, detailed text content for this option, written in Markdown."
          }
        },
        required: ["title", "details"]
      }
    }
  },
  required: ["options"]
};
```

### 5.2. Frontend State Management (`BuilderContext`)

The context state needs to be refactored:

-   From: `analysisResult: string`
-   To: `analysisOptions: CourseOption[]` and `selectedAnalysis: CourseOption | null`.

This pattern will be replicated for all steps (`objectives`, `outline`, `activities`).

### 5.3. UI Component (`StepCard`)

The `StepCard` component will be redesigned to:
-   Display a loading state while options are being generated.
-   Once options are received, map over the `options` array.
-   For each option, render a component that includes a radio button, the `option.title`, and the `option.details`.
-   Handle the `onSelect` event to update the `selected` state in the context.
-   The "Regenerate" button will clear both the `options` and the `selected` state for the current step.
