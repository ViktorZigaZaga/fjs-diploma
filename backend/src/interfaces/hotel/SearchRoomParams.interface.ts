import { ID } from '../ID.types';

export interface SearchRoomParams {
    limit: number;
    offset: number;
    hotel: ID;
    isEnabled?: boolean;
}