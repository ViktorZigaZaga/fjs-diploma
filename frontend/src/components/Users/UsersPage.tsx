import { useState, useCallback, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { MySearch } from "../MySeach";
import { UsersList } from "./UsersList";
import { MyPagination } from "../MyPagination";
import { MyLoader } from "../MyLoader";
import { Error } from "../Error/Error";
import getPageCount from "../../utils/pages";
import { useGetListUsersAdminQuery, useGetListUsersManagerQuery } from "../../store/services/users";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/authSlice";
import { selectUsers } from "../../features/usersSlice";

export default function UsersPage() {

    const [limit] = useState(10);
    const [offset, setOffset] = useState(0)
    const [page, setPage] = useState(1); 
    const [filter, setFilter] = useState('')

    // const user = useSelector(selectUser);

    // Если роль пользователя админ то:

    const {data: data, isLoading, isError, error} = useGetListUsersAdminQuery({limit, offset, name: filter, email: filter, contactPhone: filter});
    const usersList = useSelector(selectUsers)

    // Если роль пользователя manager то:
    // const {data: data, isLoading, isError, error} = useGetListUsersManagerQuery({limit, offset, name: filter.name, email: filter.email, contactPhone: filter.contactPhone});
    console.log(data)
    console.log(usersList)

    const handleChangePage = useCallback(async (page: number) => {
        setPage(page);
        setOffset(limit*(page-1))
    }, [page]);

    return(
        <Container className="shadow-sm rounded p-2 bg-white">
            <Container className="pb-4">
                <h2 className="p-3">Пользователи</h2>
                <MySearch filter={filter} setFilter={setFilter} placeholder={'Введите имя пользователя, id, телефон или почту'}/>
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