import { useState } from "react";
import { Container, Form} from "react-bootstrap";
import { RoomsList } from "./RoomsList/RoomsList";
import { MyLoader } from "../MyLoader";
import { Error}  from "../Error/Error";
import { useGetListRoomsQuery } from "../../store/services/hotelRooms";

export default function SearchRoomsPage() {

    const [limit] = useState(1000);
    const [offset] = useState(0);

    const {data: rooms, isLoading, isError, error} = useGetListRoomsQuery({ limit, offset, hotel: '' })
    
    return(
    <>
        <Container className="shadow-sm rounded p-2 bg-white mb-3">
            <Form className="pb-4">
                <h2 className="p-3">Выберите и забронируйте комнату</h2>
            </Form>
        </Container>
        {(isLoading) ? <MyLoader /> : (isError) 
            ? <Error message={String(error)} />
            : (rooms && rooms.length) && <RoomsList rooms={rooms} />
        }
    </>
    )
}