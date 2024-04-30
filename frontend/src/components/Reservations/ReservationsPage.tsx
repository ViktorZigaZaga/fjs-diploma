import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import dayjs from 'dayjs';
import { ReservationsList } from "./ReservationsList";
import { MyLoader } from "../MyLoader";
import { Error } from "../Error/Error";
import { FormDatePicker } from "./FormDatePicker";
import { useGetListReservationsClientQuery } from "../../store/services/reservations";

export default function ReservationsPage() {

    const [filter, setFilter] = useState({
        dateStart: dayjs(),
        dateEnd: dayjs(),
    });

    const {data: data, isLoading, isError, error} = useGetListReservationsClientQuery(
        {
            userId: '',
            dateStart: new Date(filter.dateStart.format('YYYY-MM-DD')), 
            dateEnd: new Date(filter.dateEnd.format('YYYY-MM-DD'))
        }
    );

    return(

        <Container className="shadow-sm rounded p-2 bg-white mb-3">
            <Container className="pb-4">
                <h2 className="p-3"><strong>'user.name'</strong></h2>
                <FormDatePicker filter={filter} setFilter={setFilter} />
                <Button 
                    className="d-flex justify-content-start mx-3"
                    variant="primary" 
                    type="submit"
                >
                    Искать
                    {/* // {
                    //     isLoading
                    //     &&  <Spinner
                    //             as="span"
                    //             animation="border"
                    //             size="sm"
                    //             role="status"
                    //             aria-hidden="true"
                    //         />
                    // } */}
                </Button>
            </Container>
            {(isLoading) ? <MyLoader /> : (isError) 
                ? <Error message={String(error)} />
                : data?.reservations && data?.reservations.length
                    ? <ReservationsList reservations={data.reservations} />
                    : <h2 className="p-3">Список Ваших броней</h2>
            }
        </Container>
    );
}
