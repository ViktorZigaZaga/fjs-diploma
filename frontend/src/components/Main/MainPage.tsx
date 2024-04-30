import { Container, Image } from "react-bootstrap";

export default function MainPage() {

    return(
        <Container className="shadow-sm rounded p-2 bg-white">
            <Container className="pb-4">
                <h2 className="p-3">Cайт-агрегатор просмотра и бронирования гостиниц</h2>
                <Image
                    width={400}
                    src='https://burobiz-a.akamaihd.net/uploads/images/84267/large_%D0%B1%D1%83%D0%BA%D0%B8%D0%BD%D0%B32.jpg'               
                ></Image>
            </Container>
        </Container>
    );
}