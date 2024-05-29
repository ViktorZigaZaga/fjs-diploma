import { FC } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row, Figure } from "react-bootstrap";
import { ResponseGetRoomData } from "../../../store/services/hotelRooms";

interface RoomsItemProps {
    room: ResponseGetRoomData
}

export const RoomsItem: FC<RoomsItemProps> = ({ room }) => {

    return (
        <Container className="bg-white rounded shadow-sm mb-3">
            <Container className="py-4">
                <Row>
                    <Col>
                        <Figure>
                            <Figure.Image
                                className="rounded"
                                width={550}
                                height={350}
                                alt="550x350"
                                src={'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                                // src={room.images[0]}
                            />
                        </Figure>
                    </Col>
                    <Col className="pt-2">
                    <h3>Название отеля комнаты: {room.hotel.title}</h3> <br/>
                        <span className="text-muted"><strong>Описание номера:</strong> {room.description}</span> <br/> <br/>
                        <Link to={`/room/${room.id}`} className="text-decoration-none mt-3">
                            <Button className="d-flex justify-content-start m-3">Подробнее</Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}