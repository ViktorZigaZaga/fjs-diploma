import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { Error } from '../Error/Error';
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { useCreateHotelAdminMutation } from "../../store/services/hotels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateHotelPage() {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] =useState('');
  const navigate = useNavigate();

  const [createHotelAdmin, {isLoading, isError}] = useCreateHotelAdminMutation();

  const createHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultHotel = await createHotelAdmin({title: title.toString(), description: description.toString()}).unwrap();
      toast.success(`Гостиница ${resultHotel._id} успешно добавлена`);
      navigate('/hotels')
    } catch (err) {
      const maybeError = isErrorWithMessage(err);
      if(maybeError) {
        setErrorMsg(err.data.message)
        toast.error(`Ошибка: ${err.status}`)
      } else {
        setErrorMsg("Неизвестная ошибка");
      }
    }
  }
  
  return (
    <Container className="shadow-sm rounded bg-white p-4">
      <Form onSubmit={createHotel}>
        <Form.Group className="mb-3">
          <Form.Label className="d-flex align-items-start">Название отеля:</Form.Label>
          <Form.Control type="text" className="mb-3" onChange={(e) => setTitle(e.target.value)} minLength={5} required />
          <Form.Control.Feedback type="invalid">Необходимо указать название отеля</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="d-flex align-items-start">Описание отеля: (необязательно)</Form.Label>
          <Form.Control as="textarea" rows={5} className="mb-3" maxLength={5000} minLength={100} onChange={(e) => setDescription(e.target.value) } />
          <Form.Control.Feedback type="invalid">Необходимо указать описание отеля</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="d-flex">
          <Button 
            className="d-flex justify-content-start mx-3"
            type="submit" 
            variant={(!title) ? "secondary" : "success"}
            disabled={(!title) ? true : false}
          >
            Сохранить
            {isLoading &&  
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            }
          </Button>{' '}
          <Button 
            className="d-flex justify-content-start mx-3"
            variant="danger" 
            type="reset"
          >
            Отменить
          </Button>
          <ToastContainer theme="dark" position="top-center" />
          {isError && <Error message={errorMsg} /> }
        </Form.Group>
      </Form>
    </Container>
  )
}