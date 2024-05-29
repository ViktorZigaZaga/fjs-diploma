import { FC } from "react";
import { Container } from "react-bootstrap";
import { ResponseGetMessage } from "../../../store/services/supportRequest";
import { ChatMessageItem } from "./ChatMessageItem";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MessagesProps {
  messages: ResponseGetMessage[],
}

export const ChatMessages: FC<MessagesProps> = ({ messages }) => {

    return (
        <Container className="rounded p-2 bg-white mb-3">
            <Container
                style={{ maxHeight: "800px", overflowY: "scroll" }}
                className="d-flex flex-column"
                
            >
                {messages.length > 0 ? (
                    messages.map(elem => 
                        <ChatMessageItem key={elem._id} message={elem} />
                    )
                    ) : (
                    <p className="text-muted text-center">Сообщения в этом чате отсутствуют!</p>
                )}
                <ToastContainer theme="dark" position="top-center" />
            </Container>
        </Container>
    )
}