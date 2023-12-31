export interface ChatHistoryResponse {
    message: string,
    channels: Channel[],
    receiverChannels: Channel[]
}

export type Message = {
    channel_id: number,
    content: string,
    sent_at: Date,
    message_id: number,
    sender_id: number,
    receiver_id: number
}

export type Channel = {
    channel_id: number,
    sender_id: number,
    receiver_id: number
}
