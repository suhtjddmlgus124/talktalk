import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProfileQuery } from "@/api/profile";
import api from "@/api/api";

import { Container } from "@/components/ui/container";
import { Message, MessageHeader, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Attachment, AttachmentMedia, AttachmentContent, AttachmentAction, AttachmentTitle } from "@/components/ui/attachment";

import { FileTextIcon, DownloadIcon } from "lucide-react";
import type { ChattingMessage } from "@/types/chatting";
import type { Profile } from "@/types/account";


type DatedChattingMessage = {
    id: number;
    kind: 'TEXT' | 'IMAGE' | 'FILE';
    content: string;
    sender: string;
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
};

type OneTimeGroupedDatedChattingMessage = {
    sender: string;
    messages: DatedChattingMessage[];
    hour: number;
    minute: number;
};

type MultipleTimeGroupedDatedChattingMessage = {
    year: number;
    month: number;
    date: number;
    messages: OneTimeGroupedDatedChattingMessage[];
};

function compareYearMonthDate(year1: number, month1: number, date1: number, year2: number, month2: number, date2: number): boolean {
    return year1 === year2 && month1 === month2 && date1 === date2;
}

function compareSenderHourMinute(sender1: string, hour1: number, minute1: number, sender2: string, hour2: number, minute2: number): boolean {
    return sender1 === sender2 && hour1 === hour2 && minute1 === minute2;
}

function getDatedChattingMessages(messages: ChattingMessage[]): DatedChattingMessage[] {
    return messages.map((message) => {
        const dateObject = new Date(message.sent_at);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth();
        const date = dateObject.getDate();
        const hour = dateObject.getHours();
        const minute = dateObject.getMinutes();
        return { ...message, sent_at: undefined, year, month, date, hour, minute };
    });
}

function getMultipleTimeGroupedDatedChattingMessages(datedMessages: DatedChattingMessage[]): MultipleTimeGroupedDatedChattingMessage[] {
    let multipleTimeGroupedDatedChattingMessages: MultipleTimeGroupedDatedChattingMessage[] = [];
    datedMessages.forEach((datedMessage) => {
        const lastMultipleTimeGroupedDatedChattingMessage = multipleTimeGroupedDatedChattingMessages.at(-1);
        if(
            lastMultipleTimeGroupedDatedChattingMessage !== undefined && 
            compareYearMonthDate(
                lastMultipleTimeGroupedDatedChattingMessage.year,
                lastMultipleTimeGroupedDatedChattingMessage.month,
                lastMultipleTimeGroupedDatedChattingMessage.date,
                datedMessage.year,
                datedMessage.month,
                datedMessage.date,
            )
        ) {
            const lastOneTimeGroupedDatedChattingMessage = lastMultipleTimeGroupedDatedChattingMessage.messages.at(-1);
            if(
                lastOneTimeGroupedDatedChattingMessage !== undefined &&
                compareSenderHourMinute(
                    lastOneTimeGroupedDatedChattingMessage.sender,
                    lastOneTimeGroupedDatedChattingMessage.hour,
                    lastOneTimeGroupedDatedChattingMessage.minute,
                    datedMessage.sender,
                    datedMessage.hour,
                    datedMessage.minute,
                )
            ) {
                lastOneTimeGroupedDatedChattingMessage.messages.push(datedMessage);
            }
            else {
                const oneTimeDatedMessage = {
                    sender: datedMessage.sender,
                    messages: [ datedMessage ],
                    hour: datedMessage.hour,
                    minute: datedMessage.minute,
                };
                lastMultipleTimeGroupedDatedChattingMessage.messages.push(oneTimeDatedMessage);
            }
        }
        else {
            const oneTimeDatedMessage = {
                sender: datedMessage.sender,
                messages: [ datedMessage ],
                hour: datedMessage.hour,
                minute: datedMessage.minute,
            };
            multipleTimeGroupedDatedChattingMessages.push({
                year: datedMessage.year,
                month: datedMessage.month,
                date: datedMessage.date,
                messages: [ oneTimeDatedMessage ]
            });
        }
    });
    return multipleTimeGroupedDatedChattingMessages;
}


function ModifiedBubble({ message, me }: { message: DatedChattingMessage, me?: boolean }) {
    if(message.kind === 'TEXT') return (
        <Bubble variant={me ? 'default' : 'outline'}>
            <BubbleContent>{ message.content }</BubbleContent>
        </Bubble>
    );
    if(message.kind === 'FILE') return (
        <Bubble>
            <a href={ JSON.parse(message.content).url } download>
                <Attachment>
                    <AttachmentMedia>
                        <FileTextIcon />
                    </AttachmentMedia>
                    <AttachmentContent>
                        <AttachmentTitle>{ JSON.parse(message.content).filename }</AttachmentTitle>
                    </AttachmentContent>
                    <AttachmentAction>
                        <DownloadIcon />
                    </AttachmentAction>
                </Attachment>
            </a>
        </Bubble>
    );
    if(message.kind === 'IMAGE') return (
        <Bubble>
            <Attachment orientation="vertical" className="min-w-50 h-auto p-2">
                <img src={ JSON.parse(message.content).url } alt="이미지" className="rounded-lg" />
            </Attachment>
        </Bubble>
    );
}

function OneTimeBubbleGroup({ oneTimeGroupedMessage, profile }: { oneTimeGroupedMessage: OneTimeGroupedDatedChattingMessage, profile: Profile }) {
    const me = (oneTimeGroupedMessage.sender === profile.nickname);
    
    return (
        <Message align={me ? 'end' : 'start'}>
            <MessageContent>
                <MessageHeader>{ oneTimeGroupedMessage.sender }</MessageHeader>
                {oneTimeGroupedMessage.messages.map((message) => (
                    <ModifiedBubble message={message} key={message.id} me={me} />
                ))}
                <MessageFooter>{oneTimeGroupedMessage.hour}:{oneTimeGroupedMessage.minute.toString().padStart(2, "0")}</MessageFooter>
            </MessageContent>
        </Message>
    );
}

function MultipleTimeMessageGroup({ multipleGroupedMessage, profile }: { multipleGroupedMessage: MultipleTimeGroupedDatedChattingMessage, profile: Profile }) {
    return (
        <MessageGroup className="space-y-4">
            <div className="mx-auto bg-neutral-200 px-3 py-1 text-neutral-600 text-xs rounded-full">
                {multipleGroupedMessage.year}년 {multipleGroupedMessage.month}월 {multipleGroupedMessage.date}일
            </div>
            {multipleGroupedMessage.messages.map((message, idx) => (
                <OneTimeBubbleGroup oneTimeGroupedMessage={message} key={idx} profile={profile} />
            ))}
        </MessageGroup>
    );
}



export default function Index() {
    const messages = useQuery<ChattingMessage[]>({
        queryKey: ['chatting', 'message'],
        queryFn: async () => {
            const response = await api.get('/api/chatting/message/');
            return response.data;
        }
    });
    const profile = useProfileQuery();

    const multipleGroupedMessages = useMemo<MultipleTimeGroupedDatedChattingMessage[] | undefined>(() => {
        if(messages.isSuccess) {
            return getMultipleTimeGroupedDatedChattingMessages(getDatedChattingMessages(messages.data));
        }

    }, [ messages.isSuccess, messages.data ]);

    if(messages.isPending || profile.isPending) return (
        <Container>
            로딩
        </Container>
    );
    if(messages.isError || profile.isError) return (
        <Container>
            에러
        </Container>
    );
    return (
        <Container>
            {multipleGroupedMessages?.map((multipleGroupedMessage, idx) => (
                <MultipleTimeMessageGroup multipleGroupedMessage={multipleGroupedMessage} key={idx} profile={profile.data as Profile} />
            ))}
        </Container>
    );
}