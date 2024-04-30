import { ID } from "../ID.types";

export interface CreateSupportRequestDto {
    user: ID;
    text: string;
}