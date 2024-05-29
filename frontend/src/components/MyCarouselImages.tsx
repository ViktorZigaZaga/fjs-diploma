import { FC } from "react";
import { Carousel, Figure } from "react-bootstrap";

interface MyCarouselProps {
    images: string[];
}

export const MyCarouselImages: FC<MyCarouselProps> = ({images}) => {

    return (
        <Carousel data-bs-theme="dark">
            {images.length === 0 
            ?  (<Carousel.Item>
                    <Figure>
                        <Figure.Image
                            className="rounded"
                            width={800}
                            height={600}
                            alt="Images carousel"
                            src={'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                        />
                    </Figure>
                </Carousel.Item>)
            :  (images.map((elem, i) =>
                    <Carousel.Item key={i}>
                        <Figure>
                            <Figure.Image
                               className="rounded"
                               width={800}
                               height={600}
                               alt="Images carousel"
                                src={elem}
                            />
                        </Figure>
                    </Carousel.Item>
                ))
            } 
        </Carousel>
    );
}