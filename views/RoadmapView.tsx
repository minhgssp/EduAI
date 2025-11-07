import React from 'react';

interface Feature {
    title: string;
    description: string;
}

interface SectionProps {
    title: string;
    features: Feature[];
    color: 'green' | 'blue' | 'gray';
}

const Section: React.FC<SectionProps> = ({ title, features, color }) => {
    const colorClasses = {
        green: {
            text: 'text-green-700',
            bg: 'bg-green-50',
            border: 'border-green-200',
            title: 'text-green-800'
        },
        blue: {
            text: 'text-blue-700',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            title: 'text-blue-800'
        },
        gray: {
            text: 'text-gray-700',
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            title: 'text-gray-800'
        }
    };
    const classes = colorClasses[color];

    return (
        <div className="mt-10">
            <h3 className={`text-2xl font-bold ${classes.text} mb-4`}>{title}</h3>
            <div className="space-y-4">
                {features.map((feature, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${classes.bg} ${classes.border}`}>
                        <h4 className={`font-semibold text-lg ${classes.title}`}>{feature.title}</h4>
                        <p className={`mt-1 text-sm ${classes.text}`}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const RoadmapView: React.FC = () => {
    const recentlyShipped: Feature[] = [
        { title: '[UI/UX] Tabbed Interface & AI Focus Mode', description: 'Replaced the old scrolling view with clean tabs and added an "Expand" mode for the AI Assistant to improve focus.' },
        { title: '[UI/UX] Structured Option Display', description: 'Improved the readability of AI-generated content by displaying it in a structured format with icons and clear headings.' },
        { title: '[FEATURE] Dynamic Choices & Custom Input', description: 'Added support for both single and multiple-choice answers, plus a custom "Other..." option for more flexibility.' },
    ];

    const nextUp: Feature[] = [
        { title: '[CORE] Session Persistence', description: "Automatically save your work in the browser. You'll never lose progress if you accidentally close the tab." },
        { title: '[FEATURE] Export to Markdown / PDF', description: 'Allows you to export your completed course plan into a usable, shareable document format.' },
    ];
    
    const futureIdeas: Feature[] = [
        { title: '[FEATURE] Enhanced Context & Customization', description: 'Add initial setup fields for course duration, learner seniority, etc., to improve AI generation quality.' },
        { title: '[FEATURE] Template Library', description: 'Provide pre-configured templates for common course types like "New Manager Training" or "Sales Onboarding".' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Product Roadmap</h2>
            <p className="text-gray-600 mb-6 border-b pb-4">Here's a look at what we've recently launched and what's next for EduAI Builder, based on our core goal of helping you create effective training plans, faster.</p>
            
            <Section title="Vừa Mới Ra Mắt 🚀" features={recentlyShipped} color="green" />
            <Section title="Kế Hoạch Tiếp Theo 🏗️" features={nextUp} color="blue" />
            <Section title="Ý Tưởng Tương Lai 💡" features={futureIdeas} color="gray" />

        </div>
    );
};

export default RoadmapView;