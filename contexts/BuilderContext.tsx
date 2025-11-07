import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { BuilderContextType, ChatMessage, CourseOption, GenerationStep, LoadingStates } from '../types';
import { callGeminiWithSchema } from '../services/geminiService';
import { GoogleGenAI, Type, Chat } from '@google/genai';

// Initialize the Google Gemini AI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Define a key for storing the session in localStorage.
const LOCAL_STORAGE_KEY = 'eduai-builder-session';

// Define the shape of the state object we'll be saving.
interface SavedState {
    courseTopic: string;
    analysisOptions: CourseOption[];
    selectedAnalysis: CourseOption | null;
    objectivesOptions: CourseOption[];
    selectedObjectives: CourseOption[];
    outlineOptions: CourseOption[];
    selectedOutline: CourseOption | null;
    activitiesOptions: CourseOption[];
    selectedActivities: CourseOption[];
    chatHistory: ChatMessage[];
}


// The required response schema for the choice-driven generation.
const choiceSchema = {
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


// Helper function to create tailored prompts for the Gemini API based on the current step.
const createGenerationPrompt = (step: GenerationStep, context: any): string => {
    switch (step) {
        case 'analysis':
            return `You are an expert in instructional design. Your task is to generate 2-4 distinct and high-quality options for the **Analysis** phase of creating a course on the topic: **"${context.courseTopic}"**. Each option must define a clear target audience (learner persona) and their specific learning needs. For each option, provide a short, descriptive title and detailed content in Markdown.

Example Title: "For Absolute Beginners"
Example Details: 
"**### Learner Persona**
- **Role:** University students or recent graduates...
**### Learning Needs**
- Lack foundational knowledge...
"`;
        case 'objectives':
            return `Based on the following selected Analysis, generate 2-4 distinct sets of clear, measurable learning objectives (using SMART or a similar framework). Each option should represent a slightly different focus or outcome for the course. For each option, provide a short, descriptive title and detailed content in Markdown.

**Selected Analysis:**
Title: ${context.selectedAnalysis.title}
Details: ${context.selectedAnalysis.details}
`;
        case 'outline':
            const objectivesText = context.selectedObjectives
                .map((obj: CourseOption) => `- ${obj.title}: ${obj.details.split('\n').join('\n  ')}`)
                .join('\n');

            return `Based on the selected Analysis and Objectives, generate 2-4 distinct course outlines. Each outline should propose a different structure or flow (e.g., thematic, chronological, simple-to-complex). For each option, provide a short, descriptive title and a detailed module/topic breakdown in Markdown.

**Selected Analysis:**
${context.selectedAnalysis.details}

**Selected Objectives:**
${objectivesText}
`;
        case 'activities':
             const objectivesContextForActivities = context.selectedObjectives
                .map((obj: CourseOption) => `- ${obj.title}: ${obj.details.split('\n').join('\n  ')}`)
                .join('\n');

            return `Based on the full course context so far (Analysis, Objectives, and Outline), generate 2-4 distinct sets of engaging learning activities and assessment methods. Each option could focus on a different learning style (e.g., collaborative, hands-on, reflective). For each option, provide a short, descriptive title and detailed activity descriptions in Markdown.

**Selected Outline:**
${context.selectedOutline.details}

**Context from Objectives:**
${objectivesContextForActivities}
`;
        default:
            return '';
    }
};

// Creates the system instruction for the AI assistant, providing it with the full course context.
const createSystemInstruction = (context: any): string => {
     const objectivesText = context.selectedObjectives.map((o: CourseOption) => o.details).join('\n---\n');
     const activitiesText = context.selectedActivities.map((o: CourseOption) => o.details).join('\n---\n');

     return `You are an expert AI assistant specialized in instructional design. You are helping a user build a training course. Your role is to provide helpful suggestions, answer questions, and modify the course content based on the user's requests. Always respond in well-structured markdown.

Here is the current state of the course plan the user has built so far:
     
**Analysis:**
${context.selectedAnalysis?.details || 'Not yet defined.'}

**Objectives (user selected one or more):**
${objectivesText || 'Not yet defined.'}

**Outline:**
${context.selectedOutline?.details || 'Not yet defined.'}

**Activities (user selected one or more):**
${activitiesText || 'Not yet defined.'}

Base your answers on this context and the conversation history.`;
}


export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
    // Function to load state from localStorage, with error handling.
    const loadState = (): Partial<SavedState> => {
        try {
            const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (serializedState === null) {
                return {}; // No state saved
            }
            return JSON.parse(serializedState);
        } catch (err) {
            console.warn("Could not load saved state from localStorage:", err);
            return {}; // Return empty object on error
        }
    };
    
    const initialSavedState = loadState();

    // Input state, initialized from saved state or default
    const [courseTopic, setCourseTopic] = useState(initialSavedState.courseTopic || '');
    
    // Options and Selections for each step, initialized from saved state or default
    const [analysisOptions, setAnalysisOptions] = useState<CourseOption[]>(initialSavedState.analysisOptions || []);
    const [selectedAnalysis, setSelectedAnalysis] = useState<CourseOption | null>(initialSavedState.selectedAnalysis || null);
    const [objectivesOptions, setObjectivesOptions] = useState<CourseOption[]>(initialSavedState.objectivesOptions || []);
    const [selectedObjectives, setSelectedObjectives] = useState<CourseOption[]>(initialSavedState.selectedObjectives || []);
    const [outlineOptions, setOutlineOptions] = useState<CourseOption[]>(initialSavedState.outlineOptions || []);
    const [selectedOutline, setSelectedOutline] = useState<CourseOption | null>(initialSavedState.selectedOutline || null);
    const [activitiesOptions, setActivitiesOptions] = useState<CourseOption[]>(initialSavedState.activitiesOptions || []);
    const [selectedActivities, setSelectedActivities] = useState<CourseOption[]>(initialSavedState.selectedActivities || []);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialSavedState.chatHistory || []);

    // State for the conversational chat session (transient, not saved)
    const [chatSession, setChatSession] = useState<Chat | null>(null);

    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        analysis: false, objectives: false, outline: false, activities: false, agent: false
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Effect to save state to localStorage whenever a piece of state changes.
    useEffect(() => {
        const stateToSave: SavedState = {
            courseTopic,
            analysisOptions,
            selectedAnalysis,
            objectivesOptions,
            selectedObjectives,
            outlineOptions,
            selectedOutline,
            activitiesOptions,
            selectedActivities,
            chatHistory,
        };
        try {
            const serializedState = JSON.stringify(stateToSave);
            localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
        } catch (err) {
            console.error("Could not save state to localStorage:", err);
        }
    }, [
        courseTopic,
        analysisOptions, selectedAnalysis,
        objectivesOptions, selectedObjectives,
        outlineOptions, selectedOutline,
        activitiesOptions, selectedActivities,
        chatHistory
    ]);


    const toggleSidebar = () => setIsSidebarOpen(prevState => !prevState);

    const resetBuilder = () => {
        setCourseTopic('');
        setAnalysisOptions([]);
        setSelectedAnalysis(null);
        setObjectivesOptions([]);
        setSelectedObjectives([]);
        setOutlineOptions([]);
        setSelectedOutline(null);
        setActivitiesOptions([]);
        setSelectedActivities([]);
        setChatHistory([]);
        setChatSession(null); // Reset the chat session
        // Also clear the saved state from localStorage
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch (err) {
            console.error("Could not remove item from localStorage:", err);
        }
    };

    const generateStepContent = useCallback(async (step: GenerationStep) => {
        setLoadingStates(prev => ({ ...prev, [step]: true }));
        
        // Clear previous results for the current and subsequent steps
        if(step === 'analysis') { 
            // Resetting from step 1 should clear everything EXCEPT course topic
            setAnalysisOptions([]);
            setSelectedAnalysis(null);
            setObjectivesOptions([]);
            setSelectedObjectives([]);
            setOutlineOptions([]);
            setSelectedOutline(null);
            setActivitiesOptions([]);
            setSelectedActivities([]);
            setChatHistory([]);
            setChatSession(null);
        }
        if(step === 'objectives') { setObjectivesOptions([]); setSelectedObjectives([]); setOutlineOptions([]); setSelectedOutline(null); setActivitiesOptions([]); setSelectedActivities([]); }
        if(step === 'outline') { setOutlineOptions([]); setSelectedOutline(null); setActivitiesOptions([]); setSelectedActivities([]); }
        if(step === 'activities') { setActivitiesOptions([]); setSelectedActivities([]); }

        const context = { courseTopic, selectedAnalysis, selectedObjectives, selectedOutline };
        const prompt = createGenerationPrompt(step, context);
        
        try {
            const result = await callGeminiWithSchema<{ options: CourseOption[] }>(prompt, choiceSchema);
            
            if (!result || !result.options || result.options.length === 0) {
                throw new Error("AI returned no options.");
            }

            switch(step) {
                case 'analysis': setAnalysisOptions(result.options); break;
                case 'objectives': setObjectivesOptions(result.options); break;
                case 'outline': setOutlineOptions(result.options); break;
                case 'activities': setActivitiesOptions(result.options); break;
            }

        } catch (error) {
            console.error(`Error in step ${step}:`, error);
            const err = error as Error;
            // Display error to the user in the options list
            const errorOption: CourseOption = { title: "An Error Occurred", details: err.message };
             switch(step) {
                case 'analysis': setAnalysisOptions([errorOption]); break;
                case 'objectives': setObjectivesOptions([errorOption]); break;
                case 'outline': setOutlineOptions([errorOption]); break;
                case 'activities': setActivitiesOptions([errorOption]); break;
            }
        } finally {
            setLoadingStates(prev => ({ ...prev, [step]: false }));
        }
    }, [courseTopic, selectedAnalysis, selectedObjectives, selectedOutline]);

    const selectOption = (step: GenerationStep, option: CourseOption) => {
        // When a selection changes, the context for the chat is now different, so we reset the session.
        // This ensures the AI gets the latest course data in its system prompt for the next conversation.
        setChatSession(null);

        switch(step) {
            case 'analysis':
            case 'outline':
                const setterSingle = step === 'analysis' ? setSelectedAnalysis : setSelectedOutline;
                setterSingle(option);
                break;
            
            case 'objectives':
            case 'activities':
                const setterMulti = step === 'objectives' ? setSelectedObjectives : setSelectedActivities;
                setterMulti(prev => {
                    // If the new option is custom, replace the old custom one or add it.
                    if (option.isCustom) {
                        const otherOptions = prev.filter(o => !o.isCustom);
                        return [...otherOptions, option];
                    }
                    
                    // If a standard option is clicked, remove any custom option.
                    const withoutCustom = prev.filter(o => !o.isCustom);
                    const isSelected = withoutCustom.some(o => o.title === option.title);

                    if (isSelected) {
                        return withoutCustom.filter(o => o.title !== option.title);
                    } else {
                        return [...withoutCustom, option];
                    }
                });
                break;
        }
    };

    const sendChatMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);
        setLoadingStates(prev => ({ ...prev, agent: true }));
        
        let currentChat = chatSession;

        try {
            // If there's no active chat session, create one with the latest context.
            if (!currentChat) {
                const context = { selectedAnalysis, selectedObjectives, selectedOutline, selectedActivities };
                const systemInstruction = createSystemInstruction(context);
                currentChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                      systemInstruction: systemInstruction,
                    },
                });
                setChatSession(currentChat);
            }
            
            const response = await currentChat.sendMessage({ message });
            const assistantMessage: ChatMessage = { role: 'assistant', text: response.text };
            setChatHistory(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setLoadingStates(prev => ({ ...prev, agent: false }));
        }
    }, [chatSession, selectedAnalysis, selectedObjectives, selectedOutline, selectedActivities]);

    const value: BuilderContextType = {
        courseTopic, setCourseTopic,
        analysisOptions, selectedAnalysis,
        objectivesOptions, selectedObjectives,
        outlineOptions, selectedOutline,
        activitiesOptions, selectedActivities,
        loadingStates,
        chatHistory, sendChatMessage,
        isSidebarOpen, toggleSidebar,
        generateStepContent, selectOption,
        resetBuilder
    };

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
};