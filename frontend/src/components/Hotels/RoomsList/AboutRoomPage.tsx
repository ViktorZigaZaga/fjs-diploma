import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import { selectUserRoleId } from "../../../features/authSlice";
import { useGetRoomQuery } from "../../../store/services/hotelRooms";
import { MyCarouselImages } from "../../MyCarouselImages";
import { FormDatePicker } from "../../FormDatePicker";
import { useCreateReservationClientMutation } from "../../../store/services/reservations";
import { Error } from '../../Error/Error'
import { isErrorWithMessage } from "../../../utils/isErrorWithMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AboutRoomPage = () => {

    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        dateStart: dayjs(),
        dateEnd: dayjs(),
    });
    const [errorMsg, setErrorMsg] = useState('');
    const {id} = useParams()
    const userRoleId = useSelector(selectUserRoleId);

    if(!id) return;
    const { data: room } = useGetRoomQuery(id);
    const [createReservationClient, {isLoading, isError}] = useCreateReservationClientMutation();

    const addReservation = async () => {
        try{
            await createReservationClient({
                userId: userRoleId._id,
                hotelId: room?.hotel._id || '', 
                roomId: id, 
                dateStart: new Date(filter.dateStart.format('YYYY-MM-DD')), 
                dateEnd: new Date(filter.dateEnd.format('YYYY-MM-DD')), 
            }
            ).unwrap()
            toast.success(`Вы успешно забронировали комнату`);
            navigate('/reservations')  
        } catch(err) {
            const maybeError = isErrorWithMessage(err);
            if(maybeError) {
                setErrorMsg(err.data.message)
            } else {
                setErrorMsg("Неизвестная ошибка");
            }
        }
    } 

    return (
        <Container className="bg-white rounded shadow-sm mb-3">
            <Container className="py-4">
                {room && room?.images 
                    && <MyCarouselImages images={room.images} />
                }
                <span className="text-muted"><strong>Описание номера:</strong> {room?.description}</span> <br/> <br/>
                {(userRoleId.role === 'client') &&
                    <>
                        <span className="text-muted"><strong>Для бронирования комнаты укажите период:</strong></span> <br/>
                        <FormDatePicker filter={filter} setFilter={setFilter} />
                        <Button 
                            onClick={() => addReservation()}
                            className="d-flex justify-content-start mx-3"
                            variant="warning"
                            type="submit"
                        >
                            Забронировать
                            {isLoading
                                &&  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            }
                        </Button>
                        <ToastContainer theme="dark" position="top-center" />
                        {isError && <Error message={errorMsg} />} 
                    </>
                }
            </Container>
        </Container>
    );
}