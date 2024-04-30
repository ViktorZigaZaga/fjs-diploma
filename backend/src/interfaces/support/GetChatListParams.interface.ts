import { ID } from "../ID.types";

export interface GetChatListParams {
    user: ID | null;
    isActive: boolean;
    offset: number;
    limit: number;
}