import { FC } from "react";
import { ResponseGetRoomData } from "../../../store/services/hotelRooms";
import { RoomsItem } from "./RoomsItem";



interface RoomsListProps {
    rooms: ResponseGetRoomData[], 
}

export const RoomsList: FC<RoomsListProps> = ({ rooms }) => {

    return (
        <>
            {(rooms && rooms.length > 0) && 
                rooms.map(elem =>
                    <RoomsItem key={elem.id} room={elem} />
                )
            }
        </>
    );
}