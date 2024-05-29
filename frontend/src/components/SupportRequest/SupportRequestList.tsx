import { FC } from "react";
import { ResponseCreateSupportData } from "../../store/services/supportRequest";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

interface SupportRequestListProps {
    supportRequestList: ResponseCreateSupportData[], 
}

export const SupportRequestList: FC<SupportRequestListProps> = ({ supportRequestList }) => {

  return (
    <>
        <Container>
            <Table striped hover className="table table-sm table-light">
                <thead className="fs-5 fw-semibold">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Дата создания обращения</th>
                        <th scope="col">Есть не прочитанные</th>
                        <th scope="col">Обращение активно</th>
                        <th scope="col">Действиe</th>
                    </tr>
                </thead>
                <tbody>
                    {(supportRequestList && supportRequestList.length > 0) && 
                        supportRequestList.map((elem, index) =>
                            <tr key={elem._id}>
                                <th scope="row">{(index + 1)}</th>
                                <td>{new Date(elem.createdAt).toLocaleDateString()}</td>
                                <td>{elem.hasNewMessages.toString()}</td>
                                <td>{elem.isActive?.toString()}</td>
                                <td>
                                    <Link to={`/chat/${elem._id}`} className="text-decoration-none">
                                        <Button variant="warning" className="mb-2 mx-2">Перейти</Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            
        </Container>
    </>
  )
}