import { FC } from "react";
import { Container } from "react-bootstrap";
import { HotelsItem } from "./HotelsItem";
import { ResponseHotelsData } from "../../store/services/hotels";


interface UsersListProps {
    hotels: ResponseHotelsData[], 
}

export const HotelsList: FC<UsersListProps> = ({ hotels }) => {

    return (
        <>
            {hotels.length === 0 
                ?   (<Container className="bg-white rounded shadow-sm mb-3">
                        <h2 className="p-3">Список пуст</h2>
                    </Container>) 
                :   (hotels.map(elem =>
                        <HotelsItem 
                            key={elem._id} 
                            hotel={elem} 
                        />
                    ))
            }
        </>
    );
}