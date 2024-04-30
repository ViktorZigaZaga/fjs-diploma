import { FC } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { ReservationsListData, useGetListReservationsClientQuery } from "../../store/services/reservations";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/authSlice";


interface ReservationsListProps {
    reservations: ReservationsListData[], 
}

export const ReservationsList: FC<ReservationsListProps> = ({ reservations }) => {

    const user = useSelector(selectUser);



    const deleteReservation = (dateStart: string, dateEnd: string) => {
        // const {data: data, isLoading, isError, error} = useGetListReservationsClientQuery(
        //     {
        //         userId: user,
        //         dateStart: dateStart, 
        //         dateEnd: dateEnd,
        //     }
        // );




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
                            <td>{reservation.hotel.title}</td>
                            <td>{reservation.dateStart}</td>
                            <td>{reservation.dateEnd}</td>
                            <td>
                                <Button onClick={() => deleteReservation(reservation.dateEnd, reservation.dateEnd) }
                                    className="d-flex justify-content-start mx-3"
                                    variant="warning" 
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
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
