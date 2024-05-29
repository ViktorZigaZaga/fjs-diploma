import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container} from "react-bootstrap";
import { MyLoader } from "../../MyLoader";
import { Error}  from "../../Error/Error";
import { MyCarouselImages } from "../../MyCarouselImages";
import { useGetListRoomsQuery } from "../../../store/services/hotelRooms";

export default function AboutHotelPage() {

    const [limit] = useState(1000);
    const [offset] = useState(0);
    let { id } = useParams();

    if(!id) return;
    const {data: rooms, isLoading, isError, error} = useGetListRoomsQuery({ limit, offset, hotel: id })

    return(   
        <>
            {rooms && rooms.length  
                ?   <Container className="bg-white rounded shadow-sm mb-3">
                        <Container className="py-4">
                            {/* <MyCarouselImages images={rooms[0].images} /> */}
                            <h3>Название отеля: {rooms[0].hotel.title}</h3> <br/>
                            <span className="text-muted"><strong>Описание отеля:</strong> {rooms[0].hotel.description}</span>
                            <Container className="d-flex justify-content-start">
                                <Link to={`/hotel/update/${id}`} className="text-decoration-none">
                                    <Button className="mt-4" variant="warning">Редактировать</Button>
                                </Link>
                                <Link to={`/room-add/${id}`} className="text-decoration-none">
                                    <Button className="m-4">Добавить номер</Button>
                                </Link>
                            </Container>
                        </Container>
                    </Container>
                :   <><h2 className="p-3">Добавьте отелю номера</h2>
                    <Link to={`/room-add/${id}`} className="text-decoration-none">
                        <Button className="m-4">Добавить номер</Button>
                    </Link></>
            }
            {(isLoading) ? <MyLoader /> : (isError) 
                ? <Error message={String(error)} />
                : (rooms?.map((room, i) => 
                    <Container key={i} className="bg-white rounded shadow-sm mb-3">
                        <Container className="py-4">
                            <MyCarouselImages images={room.images} />
                            <span className="text-muted"><strong>Описание номера:</strong> {room.description}</span> <br/> <br/>
                            <Link to={`/room/update/${room.id}`} className="text-decoration-none mt-3">
                                <Button className="d-flex justify-content-start m-3" variant="warning">Редактировать</Button>
                            </Link>
                        </Container>
                    </Container>
                ))          
            }
        </>
    );
}