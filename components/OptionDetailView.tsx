import React from 'react';

// A simple parser for structured markdown to identify headings, key-value pairs, and lists.
const parseStructuredMarkdown = (markdown: string) => {
    const lines = markdown.split('\n').filter(line => line.trim() !== '');
    const sections: { title: string; items: any[] }[] = [];
    let currentSection: { title: string; items: any[] } | null = null;

    lines.forEach(line => {
        const headingMatch = line.match(/^###\s+(.*)/);
        if (headingMatch) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = { title: headingMatch[1].trim(), items: [] };
            return;
        }

        if (currentSection) {
            const keyValueMatch = line.match(/^\*\*(.*?):\*\*\s*(.*)/);
            if (keyValueMatch) {
                currentSection.items.push({ type: 'kv', key: keyValueMatch[1].trim(), value: keyValueMatch[2].trim() });
                return;
            }
            
            const listItemMatch = line.match(/^\*\s(.*)/); // Handles bullet points starting with *
            if(listItemMatch) {
                 let lastItem = currentSection.items[currentSection.items.length - 1];
                if (!lastItem || lastItem.type !== 'list') {
                    lastItem = { type: 'list', points: [] };
                    currentSection.items.push(lastItem);
                }
                lastItem.points.push(listItemMatch[1].trim());
                return;
            }

            const numberedListItemMatch = line.match(/^\d+\.\s*(.*)/); // Handles numbered list items
            if (numberedListItemMatch) {
                let lastItem = currentSection.items[currentSection.items.length - 1];
                if (!lastItem || lastItem.type !== 'list') {
                    lastItem = { type: 'list', points: [] };
                    currentSection.items.push(lastItem);
                }
                lastItem.points.push(numberedListItemMatch[1].trim());
                return;
            }

            // Fallback for plain paragraph text within a section
            // Check if the previous item was a paragraph, if so, append to it.
             let lastItem = currentSection.items[currentSection.items.length - 1];
             if (lastItem && lastItem.type === 'p') {
                lastItem.text += `\n${line.trim()}`;
             } else {
                currentSection.items.push({ type: 'p', text: line.trim() });
             }
        }
    });

    if (currentSection) {
        sections.push(currentSection);
    }
    
    // If no sections were parsed, treat the whole thing as one paragraph.
    if(sections.length === 0 && markdown.trim().length > 0) {
        return [{ title: 'Details', items: [{ type: 'p', text: markdown }] }];
    }

    return sections;
};

// SVG Icons (Heroicons style) for visual representation
const UserCircleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AcademicCapIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" />
  </svg>
);

const ClipboardListIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const iconMap: { [key: string]: React.FC } = {
    'Learner Persona': UserCircleIcon,
    'Goals': CheckCircleIcon,
    'Learning Needs': AcademicCapIcon,
};


// FIX: Corrected component syntax to properly destructure props.
const OptionDetailView: React.FC<{ details: string }> = ({ details }) => {
    // Make TypeScript aware of the globally available `marked` library
    const marked = (window as any).marked;
    const parsedData = parseStructuredMarkdown(details);
    
    // Fallback to plain markdown rendering if parsing fails or result is empty
    if (!parsedData || parsedData.length === 0) {
        if (marked) {
            return <div className="prose prose-sm text-gray-600 mt-1 max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(details) }} />;
        }
        return <div className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{details}</div>
    }
    
    return (
        <div className="mt-3 space-y-4">
            {parsedData.map((section, idx) => {
                // Use a default icon if a specific one isn't found
                const Icon = iconMap[section.title] || ClipboardListIcon;
                return (
                    <div key={idx}>
                        <div className="flex items-center">
                            <Icon />
                            <h4 className="font-semibold text-gray-800">{section.title}</h4>
                        </div>
                        <div className="mt-2 ml-3 pl-4 border-l-2 border-gray-200 space-y-2">
                            {section.items.map((item, itemIdx) => {
                                if (item.type === 'kv') {
                                    return (
                                        <p key={itemIdx} className="text-sm text-gray-700 leading-relaxed">
                                            <strong className="text-gray-900" dangerouslySetInnerHTML={{ __html: marked ? marked.parseInline(item.key + ':') : item.key + ':' }} /> <span dangerouslySetInnerHTML={{ __html: marked ? marked.parseInline(item.value) : item.value }} />
                                        </p>
                                    );
                                }
                                if (item.type === 'list') {
                                    return (
                                        <ul key={itemIdx} className="list-disc list-outside space-y-1 pl-5 text-sm text-gray-700">
                                            {item.points.map((point:string, pIdx:number) => <li key={pIdx} dangerouslySetInnerHTML={{ __html: marked ? marked.parseInline(point) : point }}/>)}
                                        </ul>
                                    );
                                }
                                if (item.type === 'p') {
                                     return <div key={itemIdx} className="prose prose-sm text-gray-700 max-w-none" dangerouslySetInnerHTML={{ __html: marked ? marked.parse(item.text) : item.text }}/>
                                }
                                return null;
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OptionDetailView;