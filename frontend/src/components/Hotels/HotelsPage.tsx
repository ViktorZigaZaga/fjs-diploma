import { useCallback, useState } from "react";
// import { useSelector } from "react-redux";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { HotelsList } from "./HotelsList/HotelsList";
import { MySearch } from "../MySeach";
import { MyPagination } from "../MyPagination";
import { MyLoader } from "../MyLoader";
import { Error}  from "../Error/Error";
import getPageCount from "../../utils/pages";
import { useGetListHotelsAdminQuery } from "../../store/services/hotels";

export default function HotelsPage() {

    const [limit] = useState(3);
    const [offset, setOffset] = useState(0);
    const [page, setPages] = useState(1); 
    const [title, setTitle] = useState('');

    const {data: data, isLoading, isError, error, refetch} = useGetListHotelsAdminQuery({limit, offset, title});
    
    const handleChangePage = useCallback(async (page: number) => {
        setPages(page)
        setOffset(limit*(page-1))
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        refetch();
    }
    
    return(
    <>
        <Container className="shadow-sm rounded p-2 bg-white mb-3">
            <Form onSubmit={(e) => handlerSubmit(e)} className="pb-4">
                <h2 className="p-3">Поиск гостиницы</h2>
                <MySearch filter={title} setFilter={setTitle} placeholder={'Введите название гостиницы (необязательно)'}/>
                <Button 
                    className="d-flex justify-content-start mx-3"
                    variant="primary" 
                    type="submit"
                >
                    Искать
                    {
                        isLoading
                        &&  <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                    }
                </Button>
            </Form>
        </Container>
        {(isLoading) ? <MyLoader /> : (isError) 
                ? <Error message={String(error)} />
                : data?.hotels && data.hotels.length 
                    ? <HotelsList hotels={data.hotels} />
                    : <h2 className="p-3">Список пуст</h2>
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