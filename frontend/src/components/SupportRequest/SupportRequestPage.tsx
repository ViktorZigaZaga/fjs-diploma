import { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectUserRoleId } from "../../features/authSlice";
import { selectSocketIO } from "../../features/socketSlice";
import FormSupportRequest from "./FormSupportRequest";
import { SupportRequestList } from "./SupportRequestList";
import { MyLoader } from "../MyLoader";
import { Error }  from "../Error/Error";
import { useGetSupportRequestClientQuery, useGetSupportRequestManagerQuery } from "../../store/services/supportRequest";
import { socket } from "../../socket/SocketClient";

export default function SupportRequestPage() {

  const [limit] = useState(1000);
  const [offset] = useState(0);
  const userRoleId = useSelector(selectUserRoleId);
  const isConnected = useSelector(selectSocketIO);

  const {data: list, isLoading, isError} = (userRoleId.role === 'client') 
  ? useGetSupportRequestClientQuery({user: userRoleId._id, limit, offset, isActive: true})
  : useGetSupportRequestManagerQuery({user: '', limit, offset, isActive: true})

  if (isConnected) {
    list && list.forEach((el: any) => { socket.emit('subscribeToChat', { chatId: el._id }) });
  }

  return (
    <Container className="shadow-sm rounded p-2 bg-white mb-3">
      <Container className="py-4">
        <h2 className="p-3">Список обращений</h2>
        {userRoleId.role === 'client' &&
          <FormSupportRequest />
        }
      </Container>
      {(isLoading) ? <MyLoader /> : (isError) 
        ? <Error message={String(isError)} />
        : list && list.length 
          ? <SupportRequestList supportRequestList={list} />
          : <h2 className="p-3">Список пуст</h2>
      }
    </Container>
  )
}
