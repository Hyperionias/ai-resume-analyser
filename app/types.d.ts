// Global type declarations for Resume Analyser app

interface Tip {
    type: 'good' | 'improve';
    tip: string;
    explanation?: string;
}

interface Section {
    score: number;
    tips: Tip[];
}

interface Feedback {
    overallScore: number;
    ATS: Section;
    toneAndStyle: Section;
    content: Section;
    structure: Section;
    skills: Section;
}

interface Resume {
    id: string;
    companyName: string;
    jobTitle: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface PuterUser {
    username: string;
    uuid: string;
    email?: string;
}

interface FSItem {
    name: string;
    path: string;
    type: string;
    size?: number;
    modified?: number;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string | Array<{ type: string; text?: string; puter_path?: string }>;
}

interface AIResponse {
    content: string | Array<{ type: string; text: string }>;
    model?: string;
    usage?: { input_tokens: number; output_tokens: number };
}

interface PuterChatOptions {
    model?: string;
    stream?: boolean;
}

interface KVItem {
    key: string;
    value: string;
}
