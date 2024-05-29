import { FC } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ResponseGetMessage } from "../../../store/services/supportRequest";
import { selectUserRoleId } from "../../../features/authSlice";
import dayjs from "dayjs";

interface MessageItemProps {
    message: ResponseGetMessage;
}

export const ChatMessageItem: FC<MessageItemProps> = ({ message }) => {
    
    const userRoleId = useSelector(selectUserRoleId);
    let background = (message.author._id.toString() !== userRoleId._id.toString()) ? '#F2F2F7' : '#F2994A'; 

    return (
        <Card 
            style={{ background }} 
            className={message.author._id.toString() !== userRoleId._id.toString() 
                ? 'd-flex align-self-start m-2' : 'd-flex align-self-end m-2'}
        >
        <Card.Subtitle 
            className={message.author._id.toString() !== userRoleId._id.toString() 
                ? 'd-flex justify-content-start mb-3 text-muted' : 'd-flex justify-content-end mb-3 text-muted'}
        >
            {dayjs(message.createdAt).format('DD.MM.YYYY')}
        </Card.Subtitle>
        <Card.Body className="d-flex justify-content-end">
            <Card.Text>
                {message.text}
            </Card.Text>
        </Card.Body>
        </Card>
    )
}
