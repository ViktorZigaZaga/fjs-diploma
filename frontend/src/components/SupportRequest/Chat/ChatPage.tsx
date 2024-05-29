import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectUserRoleId } from "../../../features/authSlice";
import { 
    useCloseRequestMutation, 
    useGetAllMessageByIdSupportQuery, 
    useSendMessagesMutation 
} from "../../../store/services/supportRequest";
import { ChatMessages } from "./ChatMessages";
import { FormChat } from "./FormChat";
import { MyLoader } from "../../MyLoader";
import { Error }  from "../../Error/Error";
import { isErrorWithMessage } from "../../../utils/isErrorWithMessage";
import { useSocketEvent } from "../../../socket/hooks/useSocketEvent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChatPage() {

    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const userRoleId = useSelector(selectUserRoleId);
    const {id} =useParams()
    if(!id) return;
    const [closeRequest, {error}] = useCloseRequestMutation();
    const {data: messages, isLoading, isError} = useGetAllMessageByIdSupportQuery(id);
    
    const handleCloseRequest = async () => {
        try {
            await closeRequest(id).unwrap();
            toast.success('Вы успешно закрыли обращение');
            navigate(-1);
        } catch (err) {
            const maybeError = isErrorWithMessage(err);
            if(maybeError) {
                setErrorMsg(err.data.message)
            } else {
                setErrorMsg("Неизвестная ошибка");
            }
        }
    }

    const [sendMessages] = useSendMessagesMutation();

  const handleSendMessage = (async (text: string) => {
    try {
        if (text.toString().length === 0) {
            toast.success('Сообщение для отправки не должно быть пустым!');
            return; 
        }


        const message = await sendMessages({supportRequest: id, text: text, author: userRoleId._id}).unwrap();
        const listener = () => {
            if (userRoleId._id !== message.author._id) {
                toast.success(`Новое сообщение от пользователя ${message.author.name}`);
            }
        }
    
        useSocketEvent('subscribeToChat', listener);
        useSocketEvent('newMessage', listener);
    } catch (err) {
        const maybeError = isErrorWithMessage(err);
        if(maybeError) {
            setErrorMsg(err.data.message);
        } else {
            setErrorMsg("Неизвестная ошибка");
        }
    }
  })

    return (
        <>
            <Container className="shadow-sm rounded p-2 bg-white mb-3">
                <Container className="py-4">
                    <h2 className="p-3">Техподдержка</h2>
                    <h3 className="p-3">Чат с пользователем ID: {(messages && messages.length) ? messages[0].author._id : ''}</h3>
                    {(userRoleId.role === 'manager' || userRoleId.role === 'admin') &&
                        <Button variant="danger" onClick={handleCloseRequest}>Отметить обращение как закрытое</Button>
                    }
                    <ToastContainer theme="dark" position="top-center" />
                    {error && <Error message={errorMsg} />} 
                </Container>
            </Container>
            {(isLoading) ? <MyLoader /> : (isError) 
                ? <Error message={String(isError)} />
                : messages && messages.length 
                    ?   <>
                            <ChatMessages messages={messages} />
                            <FormChat handleSendMessage={handleSendMessage}/>
                        </>
                    :   <h2 className="p-3">Список сообщений пуст</h2>
            }
        </>
    )
}
