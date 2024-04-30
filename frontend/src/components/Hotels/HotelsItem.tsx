import { FC } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { MyCarouselImages } from "../MyCarouselImages";
import { ResponseHotelsData } from "../../store/services/hotels";
import { Link } from "react-router-dom";

interface HotelsItemProps {
    hotel: ResponseHotelsData
}

export const HotelsItem: FC<HotelsItemProps> = ({hotel}) => {

    return (
        <Container className="bg-white rounded shadow-sm mb-3">
            <Container className="py-4">
                <Row>
                    {/* <Col>
                        <MyCarouselImages images={hotel.url} />
                    </Col> */}
                    <Col className="pt-2">
                        <h3>Название отеля: {hotel.title}</h3> <br/>
                        <span className="text-muted"><strong>Описание:</strong> {hotel.description}</span>
                    {/* {showBtn === true && */}
                        <Link to={`/hotel-room/${hotel._id}`} className="text-decoration-none">
                            <Button className="d-flex justify-content-start m-3">Подробнее</Button>
                        </Link>
                    {/* } */}
                    </Col>
                </Row>
            </Container>
      </Container>
    );
}
