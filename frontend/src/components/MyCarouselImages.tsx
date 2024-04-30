import { FC } from "react";
import { Carousel, Figure } from "react-bootstrap";

interface MyCarouselProps {
    images: string;
}

export const MyCarouselImages: FC<MyCarouselProps> = ({images}) => {

    return (
        <Carousel slide={false}>
            {/* {images.length === 0 
            ?   */}
            (<Carousel.Item>
                    <Figure>
                        <Figure.Image
                            className="rounded"
                            width={550}
                            height={350}
                            alt="550x350"
                            // src={'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                            src={images}
                        />
                    </Figure>
                </Carousel.Item>)
            {/* // :  (images.map((elem: any, i: number) =>
            //         (<Carousel.Item key={i}>
            //             <Figure>
            //                 <Figure.Image
            //                     className="rounded"
            //                     width={550}
            //                     height={350}
            //                     alt="550x350"
            //                     src={elem.src}
            //                 />
            //             </Figure>
            //         </Carousel.Item>)
            //     ))} */}
      </Carousel>
    );
}