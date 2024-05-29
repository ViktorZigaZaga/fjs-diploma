import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { ReservationsList } from "./ReservationsList";
import { MyLoader } from "../MyLoader";
import { Error } from "../Error/Error";
import { useGetListReservationsClientQuery, useGetListReservationsManagerQuery } from "../../store/services/reservations";
import { selectUser, selectUserRoleId } from "../../features/authSlice";

export default function ReservationsPage() {

    const { id } = useParams();
    const user = useSelector(selectUser);
    const userRoleId = useSelector(selectUserRoleId);
    const {data: data, isLoading, isError, error} = !id ? useGetListReservationsClientQuery({ userId: userRoleId._id }) : useGetListReservationsManagerQuery(id);

    return(

        <Container className="shadow-sm rounded p-2 bg-white mb-3">
            <Container className="pb-4">
                <h2 className="p-3"><strong>{!id ? user?.name : id}</strong></h2>
            </Container>
            {(isLoading) ? <MyLoader /> : (isError) 
                ? <Error message={String(error)} />
                : data
                    ? <ReservationsList reservations={data} />
                    : <h2 className="p-3">Список броней пользователя пуст</h2>
            }
        </Container>
    );
}
