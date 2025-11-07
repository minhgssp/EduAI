# PRD: Conversational AI Assistant with Memory

- **Version:** 1.0
- **Status:** In Development
- **Author:** Senior Frontend Engineer
- **Date:** 2024-08-06

## 1. Background

The AI Assistant is a core component of the EduAI Builder, intended to act as a collaborative partner. However, its current implementation is "stateless," meaning it treats every user message as a brand new, isolated query. It has no memory of the previous turns in the conversation, which severely limits its usefulness and prevents a natural, human-like interaction.

## 2. Problem Statement

The AI Assistant's lack of conversational memory forces users to repetitively provide context in every single prompt. Users cannot ask follow-up questions (e.g., "Can you make that more concise?" or "Explain the second point further"), which is a fundamental expectation for a chatbot. This makes the assistant feel unintelligent and cumbersome, reducing user engagement with a key feature.

## 3. Goals & Objectives

- **Primary Goal:** Transform the AI Assistant from a simple Q&A bot into a true conversational partner that remembers the context of the ongoing dialogue.
- **Objective 1:** Implement a stateful chat mechanism that maintains conversation history throughout a user's session.
- **Objective 2:** Adopt the official, recommended best practice from the Google Gemini API for building chatbots (`ai.chats.create`).
- **Objective 3:** Ensure the chat's memory is logically tied to the current course-building process (i.e., the conversation should reset if the user starts over).

## 4. Solution & Implementation Plan

### 4.1. Architectural Shift: From `generateContent` to `ai.chats`

We will move away from using the stateless `generateContent` API for the assistant. The core of the solution is to adopt the Gemini Chat API.

- **`ai.chats.create(config)`:** This method will be used to initialize a new, stateful `Chat` session.
- **`chat.sendMessage(request)`:** This method will be used to send subsequent messages. The Gemini SDK automatically manages and sends the conversation history with each request.

### 4.2. State Management (`BuilderContext`)

- A new state variable, `chatSession: Chat | null`, will be introduced in `BuilderContext`.
- **Initialization:** The `chatSession` will be initialized (`ai.chats.create`) on the user's *first* message within a session.
- **System Instruction:** Upon initialization, we will pass a detailed `systemInstruction` to the chat model. This instruction will contain the full context of the user's current course plan (Analysis, Objectives, Outline, etc.) and define the AI's persona as an instructional design expert.
- **Sending Messages:** The `sendChatMessage` function will now call `chatSession.sendMessage()` with only the user's new message.
- **Resetting:** The `resetBuilder` function will be updated to set `chatSession` back to `null`, effectively ending the conversation and clearing its memory. Furthermore, to ensure the AI always has the most up-to-date context, the `chatSession` will also be reset whenever the user makes a new selection in any of the builder steps.

## 5. Technical Requirements

- **`contexts/BuilderContext.tsx`:**
    - Import `Chat` from `@google/genai`.
    - Add `const [chatSession, setChatSession] = useState<Chat | null>(null);`.
    - Heavily refactor `sendChatMessage` to manage the lifecycle of the `chatSession` object.
    - Update `resetBuilder` and `selectOption` to clear the `chatSession`.
- **`services/geminiService.ts`:**
    - No changes required. The new logic will be self-contained within the `BuilderContext`, which is appropriate as it's managing the application's state.

## 6. Success Metrics

- **Behavioral:** Users can now successfully ask follow-up questions, and the AI provides contextually aware responses.
- **Qualitative:** The AI Assistant feels significantly "smarter" and more useful, leading to increased user satisfaction and engagement.
- **Technical:** The implementation is cleaner, more maintainable, and aligns with the official Gemini SDK guidelines.
