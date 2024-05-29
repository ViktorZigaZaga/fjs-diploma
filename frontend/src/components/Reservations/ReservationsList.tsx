import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import { ReservationsListData, useDeleteReservationClientMutation, useDeleteReservationManagerMutation } from "../../store/services/reservations";
import { Error } from '../Error/Error'
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectUserRoleId } from "../../features/authSlice";

interface ReservationsListProps {
    reservations: ReservationsListData[], 
}

export const ReservationsList: FC<ReservationsListProps> = ({ reservations }) => {

    const navigate = useNavigate();
    const userRoleId = useSelector(selectUserRoleId);
    const [errorMsg, setErrorMsg] = useState('');
    const [deleteReservationClient, {isLoading, isError}] = useDeleteReservationClientMutation()
    const [deleteReservationManager, {isLoading: isLoadingM, isError: isErrorM}] = useDeleteReservationManagerMutation()
 
    

    const deleteReservation = async (id: string) => {
        try{
            if (userRoleId.role === "client") {
                await deleteReservationClient(id).unwrap();
            } else if (userRoleId.role === "manager") {
                await deleteReservationManager(id).unwrap()
            }
            toast.success(`Бронь удалена`);
            navigate('/reservations');
        } catch (err) {
            const maybeError = isErrorWithMessage(err);
            if(maybeError) {
                setErrorMsg(err.data.message)
            } else {
                setErrorMsg("Неизвестная ошибка");
            }
        }
    }

    return(
        <Container>
            <Table striped hover className="table table-sm table-light">
                <thead className="fs-5 fw-semibold">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Отель</th>
                        <th scope="col">Дата заезда</th>
                        <th scope="col">Дата выезда</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {(reservations && reservations.length > 0) && 
                    reservations.map((reservation, index) => (
                        <tr key={index + 1}>
                            <th scope="row">{index + 1}</th>
                            <td>{reservation.hotelId.title}</td>
                            <td>{new Date(reservation.dateStart).toLocaleDateString()}</td>
                            <td>{new Date(reservation.dateEnd).toLocaleDateString()}</td>
                            <td>
                                <Button onClick={() => deleteReservation(reservation._id)}
                                    className="d-flex justify-content-start mx-3"
                                    variant="warning" 
                                    type="submit"
                                >
                                    Удалить
                                    {(isLoading || isLoadingM)
                                        &&  <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    }
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer theme="dark" position="top-center" />
            {(isError || isErrorM) && <Error message={errorMsg} />} 
        </Container>
    );
}
