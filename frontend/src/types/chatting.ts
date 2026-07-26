export type ChattingMessage = {
    id: number;
    kind: 'TEXT' | 'IMAGE' | 'FILE';
    content: string;
    sender: string;
    sent_at: string;
};