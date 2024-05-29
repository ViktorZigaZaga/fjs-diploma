import { FC } from "react";
import { HotelsItem } from "./HotelsItem";
import { ResponseHotelsData } from "../../../store/services/hotels";


interface HotelsListProps {
    hotels: ResponseHotelsData[], 
}

export const HotelsList: FC<HotelsListProps> = ({ hotels }) => {

    return (
        <>
            {(hotels && hotels.length > 0) && 
                hotels.map(elem =>
                    <HotelsItem key={elem._id} hotel={elem} />
                )
            }
        </>
    );
}