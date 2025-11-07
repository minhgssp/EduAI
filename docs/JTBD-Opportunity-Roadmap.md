# PRD: JTBD, Opportunity Tree, and Roadmap Strategy

- **Version:** 1.0
- **Status:** Inception
- **Author:** Senior Frontend Engineer & Product Strategist
- **Date:** 2024-07-29

## 1. The "Job to be Done" (JTBD)

**When I am** tasked with creating a new training program under a tight deadline,
**I want to** quickly structure a comprehensive and engaging lesson plan based on sound instructional design principles,
**so I can** confidently deliver effective training that meets both learner needs and business objectives, without needing to be a world-class expert in pedagogy myself.

### Forces at Play:
- **Push (Problem):** "I have to build a course but I'm short on time." "I'm not 100% confident in my instructional design skills."
- **Pull (Attraction to Solution):** "This tool promises a structured, step-by-step process." "AI can give me a high-quality first draft in minutes."
- **Anxiety (Hesitation):** "Will the AI's output be generic and useless?" "Will I lose control over the final content?"
- **Inertia (Sticking to old ways):** "I'll just use my old PowerPoint templates. It's faster than learning a new tool."

## 2. Desired Outcomes

Based on the JTBD, users are hiring our product to achieve these outcomes. These are the metrics we should measure.

- **[Core] Minimize time** from initial topic to a complete, ready-to-use course plan.
- **[Core] Increase confidence** in the quality and pedagogical soundness of the course structure.
- **[Secondary] Maximize learner engagement** by incorporating varied and effective activities.
- **[Secondary] Minimize the friction** of refining and personalizing the AI-generated content.

## 3. Opportunity Solution Tree

This tree helps us connect our desired outcomes to specific user problems (opportunities) and potential solutions (features).

- **Desired Outcome: Create a professional, effective training plan quickly and confidently.**
    - **[Opportunity] How can we make the initial draft generation as fast and high-quality as possible?**
        - *[Solution]* Refine prompts for each step (Analysis, Objectives, etc.) to be more specific.
        - *[Solution]* Allow users to provide more context upfront (e.g., course duration, learner seniority).
        - *[Solution]* Use a faster AI model (`gemini-2.5-flash`). **(Implemented)**
    - **[Opportunity] How can we make refining the draft feel intuitive and collaborative, not manual and tedious? (Improves Retention)**
        - *[Solution]* **Enable the AI Assistant to understand and execute modification commands.** (e.g., "Make this section shorter"). **(This is the P0 fix)**
        - *[Solution]* **Improve readability of AI responses with Markdown.** **(This is the P0 fix)**
        - *[Solution]* Allow direct editing in the text areas. **(Implemented)**
    - **[Opportunity] How can we reduce the user's anxiety about losing their work? (Improves Retention)**
        - *[Solution]* **Implement session persistence using `localStorage` to save progress automatically.** **(Next priority)**
        - *[Solution]* Add a manual "Save" button for explicit control.
    - **[Opportunity] How can we help the user easily share or use their completed plan? (Improves Referral/Activation)**
        - *[Solution]* **Add an "Export to Markdown/PDF" feature.** **(Next priority)**
        - *[Solution]* Add a "Copy to Clipboard" for each section.

## 4. Strategic Implications for the Roadmap

The Opportunity Solution Tree directly informs our `ROADMAP.md`.

1.  **"Now" Priorities (P0):** We must fix the opportunities that are currently broken promises. The AI Assistant *must* be able to modify content, and its output *must* be readable. These are foundational to the core "refinement" loop and directly impact user retention.
2.  **"Next" Priorities (P1):** We address the biggest anxieties and friction points. Losing work is a huge pain point that kills retention. Not being able to get the content *out* of the app makes it a dead end. Therefore, Session Persistence and Export are the next logical steps.
3.  **"Later" Priorities (P2):** After the core experience is solid, we can focus on improving the quality of the "first magic." This involves deeper prompt engineering and adding more customization options.

This strategic approach ensures we are always working on the most impactful features that solve real user problems defined by our Job-to-be-Done.
