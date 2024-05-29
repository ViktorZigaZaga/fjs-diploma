import { FC } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Container, Table } from "react-bootstrap";
import { UsersListData } from "../../store/services/users";
import { selectUserRoleId } from "../../features/authSlice";

interface UsersListProps {
    users: UsersListData[], 
    page: number,
}

export const UsersList: FC<UsersListProps> = ({ users, page }) => {

    const userRoleId = useSelector(selectUserRoleId); 

    return(
        <Container>
            <Table striped hover className="table table-sm table-light">
                <thead className="fs-5 fw-semibold">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ФИО</th>
                        <th scope="col">Почта</th>
                        <th scope="col">Телефон</th>
                        {userRoleId.role === 'manager' 
                            && <th scope="col">Список броней</th>
                        }   
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
                            {userRoleId.role === 'manager' 
                                && <td>
                                    <Link to={`/reservations/${user._id}`} className="text-decoration-none">
                                        <Button variant="warning">Посмотреть</Button>
                                    </Link>
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
