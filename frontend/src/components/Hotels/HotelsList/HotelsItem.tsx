import { FC } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ResponseHotelsData } from "../../../store/services/hotels";
import { Link } from "react-router-dom";

interface HotelsItemProps {
    hotel: ResponseHotelsData
}

export const HotelsItem: FC<HotelsItemProps> = ({ hotel }) => {

    return (
        <Container className="bg-white rounded shadow-sm mb-3">
            <Container className="py-4">
                <Row>
                    {/* <Col>
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
                    </Col> */}
                    <Col className="pt-2">
                        <h3>Название отеля: {hotel.title}</h3> <br/>
                        <span className="text-muted"><strong>Описание отеля:</strong> {hotel.description}</span> <br/> <br/>
                        <Link to={`/hotel/${hotel._id}`} className="text-decoration-none">
                            <Button className="d-flex justify-content-start m-3">Подробнее</Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
      </Container>
    );
}
