export interface VoiceTranscription {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface DataChannelMessage {
    type: string;
    content?: string;
    role?: string;
    [key: string]: any;
}

export type ProjectData = {
    context: string
    completed?: boolean;
};