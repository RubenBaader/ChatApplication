import { MessageProps } from "../components";

export interface ConversationI {
    messages? : MessageProps[],
    id : string,
    latestMessage: MessageProps,
    users? : JSON,
}