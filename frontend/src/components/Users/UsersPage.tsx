import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { UsersList } from "./UsersList";
import { MySearch } from "../MySeach";
import { MyPagination } from "../MyPagination";
import { MyLoader } from "../MyLoader";
import { Error } from "../Error/Error";
import getPageCount from "../../utils/pages";
import { useGetListUsersAdminQuery, useGetListUsersManagerQuery } from "../../store/services/users";
import { selectUserRoleId } from "../../features/authSlice";

export default function UsersPage() {

    const [limit] = useState(10);
    const [offset, setOffset] = useState(0)
    const [page, setPage] = useState(1); 
    const [filter, setFilter] = useState('')
    
    const userRoleId = useSelector(selectUserRoleId);
    const {data: data, isLoading, isError, error, refetch} = (userRoleId.role === 'admin') 
        ? useGetListUsersAdminQuery({limit, offset, name: filter, email: filter, contactPhone: filter})
        : useGetListUsersManagerQuery({limit, offset, name: filter, email: filter, contactPhone: filter})
    
    const handleChangePage = useCallback(async (page: number) => {
        setPage(page);
        setOffset(limit*(page-1))
    }, [page]);

    const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        refetch();
    }

    return(
        <Container className="shadow-sm rounded p-2 bg-white">
            <Form onSubmit={(e) => handlerSubmit(e)} className="pb-4">
                <h2 className="p-3">Пользователи</h2>
                <MySearch filter={filter} setFilter={setFilter} placeholder={'Введите имя пользователя, id, телефон или почту'}/>
                <Button  
                    className="d-flex justify-content-start mx-3"
                    variant="primary" 
                    type="submit"
                >
                    Искать
                    {isLoading
                        && <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    }
                </Button>
            </Form>
            {(isLoading) ? <MyLoader /> : (isError) 
                ? <Error message={String(error)} />
                : data?.users && data.users.length
                    ? <UsersList users={data.users} page={page} />
                    : <h2 className="p-3">Список пуст</h2>
            }
            {(data && data.totalCount > limit) && 
                <MyPagination 
                    total={getPageCount(data.totalCount, limit)} 
                    current={page} 
                    onChangePage={handleChangePage} 
                />
            }
        </Container>
    );
}