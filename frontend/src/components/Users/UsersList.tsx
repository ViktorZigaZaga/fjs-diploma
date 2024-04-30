import { FC } from "react";
import { UsersListData } from "../../store/services/users";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/authSlice";

interface UsersListProps {
    users: UsersListData[], 
    page: number,
}

export const UsersList: FC<UsersListProps> = ({ users, page }) => {

    // const user = useSelector(selectUser);
    // useEffect(() => {
    //     if(!user) navigate('/')
    //   }, [user])    

    return(
        <Container>
            <Table striped hover className="table table-sm table-light">
                <thead className="fs-5 fw-semibold">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ФИО</th>
                        <th scope="col">Почта</th>
                        <th scope="col">Телефон</th>
                        {/* Если менеджер то показать */}
                        <th scope="col">Список броней</th>
                    </tr>
                </thead>
                <tbody>
                    {(users && users.length > 0) && 
                    users.map((user, index) => (
                        <tr key={user._id}>
                            <th scope="row">{(page-1)*10 + (index + 1)}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.contactPhone}</td>
                            {/* Если менеджер то показать */}
                            <td>
                                <Link to={`/reservations?id=${user._id}`} className="text-decoration-none">
                                    <Button variant="warning">Посмотреть</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
