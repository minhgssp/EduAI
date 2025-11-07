import React, { useState, useEffect } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { CourseOption, GenerationStep } from '../types';
import OptionDetailView from '../components/OptionDetailView';

// Make TypeScript aware of the globally available `marked` library from the CDN
declare const marked: any;

// A reusable card component for each step in the builder process.
const StepCard: React.FC<{
  step: GenerationStep;
  stepNumber: number;
  title: string;
  instructions: string;
  options: CourseOption[];
  selection: CourseOption | null | CourseOption[]; // Can be single or multiple
  selectionType: 'single' | 'multiple';
  onSelectOption: (option: CourseOption) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isActionable: boolean;
}> = ({ step, stepNumber, title, instructions, options, selection, selectionType, onSelectOption, onGenerate, isLoading, isActionable }) => {
    
    const isCompleted = Array.isArray(selection) ? selection.length > 0 : !!selection;

    const [customInput, setCustomInput] = useState('');
    const isCustomSelected = (Array.isArray(selection) ? selection.some(o => o.isCustom) : selection?.isCustom) ?? false;

    // When the selection changes, if a custom option was chosen, populate the textarea.
    useEffect(() => {
        if (isCustomSelected) {
            const customOption = Array.isArray(selection) 
                ? selection.find(o => o.isCustom) 
                : selection;
            if (customOption) {
                setCustomInput(customOption.details);
            }
        } else {
             setCustomInput('');
        }
    }, [selection, isCustomSelected]);


    const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomInput(e.target.value);
        // Debounce or onBlur could be better, but for simplicity, we update on change.
        const customOption: CourseOption = {
            title: 'Custom Input',
            details: e.target.value,
            isCustom: true,
        };
        onSelectOption(customOption);
    };
    
    const handleSelect = (option: CourseOption) => {
        onSelectOption(option);
    };
    
    const isChecked = (option: CourseOption) => {
        if (selectionType === 'single') {
            return (selection as CourseOption | null)?.title === option.title && !isCustomSelected;
        }
        return (selection as CourseOption[]).some(o => o.title === option.title && !o.isCustom);
    };

    return (
        <div className={`p-6 rounded-xl shadow-md transition-all duration-300 bg-white`}>
            <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Step {stepNumber}: {title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{instructions}</p>
                 </div>
                 {isCompleted && (
                    <button 
                        onClick={onGenerate}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        Regenerate
                    </button>
                 )}
            </div>
            
            {!isCompleted && (
                 <button 
                    onClick={onGenerate} 
                    disabled={isLoading || !isActionable}
                    className="mb-4 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                >
                    {isLoading ? 'Generating Options...' : 'Generate Options'}
                </button>
            )}

            {isLoading && <Loader />}
            
            {!isLoading && options.length > 0 && (
                <div className="space-y-3">
                    {options.map((option, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleSelect(option)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isChecked(option) ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                        >
                            <label className="flex items-start cursor-pointer">
                                <input 
                                    type={selectionType === 'single' ? 'radio' : 'checkbox'}
                                    name={`${step}-option`}
                                    checked={isChecked(option)}
                                    onChange={() => handleSelect(option)}
                                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="ml-3 text-sm w-full">
                                    <p className="font-bold text-gray-900">{option.title}</p>
                                    <OptionDetailView details={option.details} />
                                </div>
                            </label>
                        </div>
                    ))}
                    {/* Custom Input Option */}
                    <div 
                        onClick={() => handleSelect({ title: 'Custom Input', details: customInput, isCustom: true })}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isCustomSelected ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                    >
                         <label className="flex items-start cursor-pointer">
                                <input 
                                    type={selectionType === 'single' ? 'radio' : 'checkbox'}
                                    name={`${step}-option`}
                                    checked={isCustomSelected}
                                    onChange={() => handleSelect({ title: 'Custom Input', details: customInput, isCustom: true })}
                                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="ml-3 text-sm w-full">
                                    <p className="font-bold text-gray-900">Other...</p>
                                    {isCustomSelected && (
                                        <textarea
                                            value={customInput}
                                            onChange={handleCustomTextChange}
                                            placeholder="Describe your own option here..."
                                            className="mt-2 w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            rows={4}
                                        />
                                    )}
                                </div>
                            </label>
                    </div>
                </div>
            )}
        </div>
    );
};

const Tab: React.FC<{
    title: string;
    stepNumber: number;
    isActive: boolean;
    isUnlocked: boolean;
    onClick: () => void;
}> = ({ title, stepNumber, isActive, isUnlocked, onClick }) => {
    const baseClasses = "px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors duration-200";
    const activeClasses = "bg-white text-blue-600 border-b-2 border-blue-600";
    const inactiveClasses = "bg-gray-100 text-gray-500 hover:bg-gray-200";
    const disabledClasses = "bg-gray-50 text-gray-400 cursor-not-allowed";

    const getClasses = () => {
        if (!isUnlocked) return `${baseClasses} ${disabledClasses}`;
        if (isActive) return `${baseClasses} ${activeClasses}`;
        return `${baseClasses} ${inactiveClasses}`;
    }

    return (
        <button onClick={isUnlocked ? onClick : undefined} className={getClasses()} role="tab" aria-selected={isActive}>
            Step {stepNumber}: {title}
        </button>
    );
};

const BuilderView: React.FC = () => {
    const {
        courseTopic, setCourseTopic,
        analysisOptions, selectedAnalysis,
        objectivesOptions, selectedObjectives,
        outlineOptions, selectedOutline,
        activitiesOptions, selectedActivities,
        loadingStates,
        isSidebarOpen, toggleSidebar,
        generateStepContent,
        selectOption,
        resetBuilder
    } = useBuilder();

    const [activeStep, setActiveStep] = useState<GenerationStep>('analysis');
    const [isChatExpanded, setIsChatExpanded] = useState(false);

    const isCourseStarted = !!selectedAnalysis || analysisOptions.length > 0;
    
    const objectivesUnlocked = !!selectedAnalysis;
    const outlineUnlocked = selectedObjectives.length > 0;
    const activitiesUnlocked = !!selectedOutline;

    const aggregateContent = () => {
        let markdown = `# Course Plan: ${courseTopic}\n\n`;

        if (selectedAnalysis) {
            markdown += `## Step 1: Analysis\n`;
            markdown += `### ${selectedAnalysis.title}\n${selectedAnalysis.details}\n\n`;
        }
        if (selectedObjectives.length > 0) {
            markdown += `## Step 2: Objectives\n`;
            selectedObjectives.forEach(obj => {
                markdown += `### ${obj.title}\n${obj.details}\n\n`;
            });
        }
        if (selectedOutline) {
            markdown += `## Step 3: Outline\n`;
            markdown += `### ${selectedOutline.title}\n${selectedOutline.details}\n\n`;
        }
        if (selectedActivities.length > 0) {
            markdown += `## Step 4: Activities\n`;
            selectedActivities.forEach(act => {
                markdown += `### ${act.title}\n${act.details}\n\n`;
            });
        }
        return markdown;
    };

    const handleExportMarkdown = () => {
        const markdownContent = aggregateContent();
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `Course-Plan-${courseTopic.replace(/\s+/g, '-') || 'Untitled'}.md`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportPdf = () => {
        const markdownContent = aggregateContent();
        const htmlContent = marked.parse(markdownContent);
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Course Plan: ${courseTopic}</title>
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; }
                            h1, h2, h3 { color: #111; }
                            h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
                            h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; }
                            blockquote { border-left: 4px solid #ddd; padding-left: 1rem; color: #666; }
                            code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
                        </style>
                    </head>
                    <body>
                        ${htmlContent}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };
    
    const renderActiveStep = () => {
        switch (activeStep) {
            case 'analysis':
                return <StepCard
                    step="analysis" stepNumber={1} title="Analysis"
                    instructions="Choose the best approach to define the target audience and learning needs (Single Choice)."
                    options={analysisOptions} selection={selectedAnalysis} selectionType="single"
                    onSelectOption={(option) => selectOption('analysis', option)}
                    onGenerate={() => generateStepContent('analysis')}
                    isLoading={loadingStates.analysis} isActionable={!!courseTopic.trim()}
                />;
            case 'objectives':
                return <StepCard
                    step="objectives" stepNumber={2} title="Objectives"
                    instructions="Select the clearest and most measurable learning goals for the course (Multiple Choice)."
                    options={objectivesOptions} selection={selectedObjectives} selectionType="multiple"
                    onSelectOption={(option) => selectOption('objectives', option)}
                    onGenerate={() => generateStepContent('objectives')}
                    isLoading={loadingStates.objectives} isActionable={objectivesUnlocked}
                />;
            case 'outline':
                 return <StepCard
                    step="outline" stepNumber={3} title="Outline"
                    instructions="Choose the most logical structure for the course content (Single Choice)."
                    options={outlineOptions} selection={selectedOutline} selectionType="single"
                    onSelectOption={(option) => selectOption('outline', option)}
                    onGenerate={() => generateStepContent('outline')}
                    isLoading={loadingStates.outline} isActionable={outlineUnlocked}
                />;
            case 'activities':
                return <StepCard
                    step="activities" stepNumber={4} title="Activities"
                    instructions="Select engaging activities and exercises to reinforce learning (Multiple Choice)."
                    options={activitiesOptions} selection={selectedActivities} selectionType="multiple"
                    onSelectOption={(option) => selectOption('activities', option)}
                    onGenerate={() => generateStepContent('activities')}
                    isLoading={loadingStates.activities} isActionable={activitiesUnlocked}
                />;
            default:
                return null;
        }
    }
    
    const mainContentClasses = `transition-all duration-500 ease-in-out ${isChatExpanded ? 'w-24' : (isSidebarOpen ? 'w-2/3' : 'w-full')}`;
    const sidebarClasses = `transition-all duration-500 ease-in-out ${isChatExpanded ? 'flex-1' : (isSidebarOpen ? 'w-1/3' : 'w-0 overflow-hidden')}`;


    return (
        <div className="flex gap-6 items-start">
            {/* Main Content Area */}
            <div className={mainContentClasses}>
                <div className="space-y-6">
                    {/* Floating button to open the AI assistant sidebar */}
                    {!isSidebarOpen && !isChatExpanded && (
                        <button 
                            onClick={toggleSidebar}
                            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 z-20"
                            title="Open AI Assistant"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </button>
                    )}

                    {isChatExpanded ? (
                        <div className="p-2 rounded-xl shadow-md bg-white flex flex-col items-center space-y-4">
                             <button onClick={resetBuilder} title="Start Over" className="p-3 rounded-lg hover:bg-red-100 text-red-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                             <div className="w-full h-px bg-gray-200"></div>
                             <button onClick={() => setActiveStep('analysis')} title="Analysis" className={`p-3 rounded-lg ${activeStep === 'analysis' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></button>
                             <button disabled={!objectivesUnlocked} onClick={() => setActiveStep('objectives')} title="Objectives" className={`p-3 rounded-lg ${activeStep === 'objectives' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'} disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                             <button disabled={!outlineUnlocked} onClick={() => setActiveStep('outline')} title="Outline" className={`p-3 rounded-lg ${activeStep === 'outline' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'} disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg></button>
                             <button disabled={!activitiesUnlocked} onClick={() => setActiveStep('activities')} title="Activities" className={`p-3 rounded-lg ${activeStep === 'activities' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'} disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                        </div>
                    ) : (
                    <>
                        {/* Step 0: User inputs the main topic */}
                        <div className="p-6 rounded-xl shadow-md bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Start Here: Define Your Topic</h3>
                                    <p className="text-sm text-gray-500 mb-4">What is the main subject of the training course you want to build?</p>
                                </div>
                                {isCourseStarted && (
                                    <button 
                                        onClick={resetBuilder}
                                        className="text-sm text-red-600 hover:text-red-800 font-semibold"
                                    >
                                        Start Over
                                    </button>
                                )}
                            </div>
                            <input 
                                type="text"
                                value={courseTopic}
                                onChange={(e) => setCourseTopic(e.target.value)}
                                placeholder="e.g., 'Advanced Public Speaking for Sales Professionals'"
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loadingStates.analysis || isCourseStarted}
                            />
                        </div>

                        {/* Tab Navigation */}
                         <div className="bg-gray-100 p-1 rounded-t-lg flex space-x-1" role="tablist">
                            <Tab title="Analysis" stepNumber={1} isActive={activeStep === 'analysis'} isUnlocked={true} onClick={() => setActiveStep('analysis')} />
                            <Tab title="Objectives" stepNumber={2} isActive={activeStep === 'objectives'} isUnlocked={objectivesUnlocked} onClick={() => setActiveStep('objectives')} />
                            <Tab title="Outline" stepNumber={3} isActive={activeStep === 'outline'} isUnlocked={outlineUnlocked} onClick={() => setActiveStep('outline')} />
                            <Tab title="Activities" stepNumber={4} isActive={activeStep === 'activities'} isUnlocked={activitiesUnlocked} onClick={() => setActiveStep('activities')} />
                        </div>
                        
                        {/* Active Tab Content */}
                        <div>
                            {renderActiveStep()}
                        </div>


                        {selectedActivities.length > 0 && (
                            <div className="p-6 rounded-xl shadow-md bg-green-50 border border-green-200">
                                <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Course Plan Complete!</h3>
                                <p className="text-green-700">You have successfully generated all components of your course. You can now export your plan or use the AI Assistant to refine it further.</p>
                                <div className="mt-4 flex gap-4">
                                    <button onClick={handleExportMarkdown} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                        Export as Markdown
                                    </button>
                                    <button onClick={handleExportPdf} className="px-4 py-2 font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                        Export as PDF
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                    )}
                </div>
            </div>
            
            {/* Sidebar container */}
            <div className={sidebarClasses}>
                {(isSidebarOpen || isChatExpanded) && (
                    <div className="sticky top-6 h-[calc(100vh-3rem)] w-full">
                        <Sidebar isChatExpanded={isChatExpanded} setIsChatExpanded={setIsChatExpanded} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuilderView;