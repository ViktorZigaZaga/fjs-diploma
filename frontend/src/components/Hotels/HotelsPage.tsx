import { useCallback, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { MySearch } from "../MySeach";
import { HotelsList } from "./HotelsList";
import { MyLoader } from "../MyLoader";
import { Error}  from "../Error/Error";
import { MyPagination } from "../MyPagination";
import { useGetListHotelsAdminQuery } from "../../store/services/hotels";
import getPageCount from "../../utils/pages";

export default function HotelsPage() {

    const [limit] = useState(3);
    const [offset, setOffset] = useState(0);
    const [page, setPages] = useState(1); 
    const [title, setTitle] = useState('');

    
    const {data: data, isLoading, isError, error} = useGetListHotelsAdminQuery({limit, offset, title});

    console.log(data);
    
    const handleChangePage = useCallback(async (page: number) => {
        setPages(page)
    }, [page]);
    
    // window.scrollTo({ top: 0, behavior: 'smooth' });

    return(
    <>
        <Container className="shadow-sm rounded p-2 bg-white mb-3">
            <Container className="pb-4">
                <h2 className="p-3">Поиск гостиницы</h2>
                <MySearch filter={title} setFilter={setTitle} placeholder={'Введите название гостиницы (необязательно)'}/>
                <Button 
                    className="d-flex justify-content-start mx-3"
                    variant="primary" 
                    type="submit"
                    // {
                    //     isLoading
                    //     &&  <Spinner
                    //             as="span"
                    //             animation="border"
                    //             size="sm"
                    //             role="status"
                    //             aria-hidden="true"
                    //         />
                    // }
                >
                    Искать
                </Button>
            </Container>
        </Container>
        {(isLoading) ? <MyLoader /> : (isError) 
                ? <Error message={String(error)} />
                : data && <HotelsList hotels={data.hotels} />
        }
        {(data && data.totalCount > limit) && 
            <MyPagination 
                total={getPageCount(data.totalCount, limit)} 
                current={page} 
                onChangePage={handleChangePage} 
            />
        } 
    </>
    )
}