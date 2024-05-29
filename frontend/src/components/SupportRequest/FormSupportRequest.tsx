import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Spinner } from "react-bootstrap";
import { selectUserRoleId } from "../../features/authSlice";
import { useCreateSupportRequestMutation } from "../../store/services/supportRequest";
import { Error } from '../Error/Error'
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FormSupportRequest() {
    const [text, setText] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState('');
    const userRoleId = useSelector(selectUserRoleId);
    const [createRequest, {isLoading, isError}] = useCreateSupportRequestMutation()

    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRequest({user: userRoleId._id, text: text}).unwrap();
            toast.success('Вы успешно создали обращение');
            window.location.reload();
        } catch (err) {
            const maybeError = isErrorWithMessage(err);
            if(maybeError) {
                setErrorMsg(err.data.message)
            } else {
                setErrorMsg("Неизвестная ошибка");
            }
        }
    }

    return (
        <Form onSubmit={(e) => handlerSubmit(e)} className="mb-3">
            <Form.Group className="mb-3">
                <Form.Control 
                    as="textarea" 
                    className="mb-3" 
                    rows={3} 
                    maxLength={1000} 
                    placeholder="Введите текст нового обращения" 
                    onChange={(e) => setText(e.target.value)} 
                    required 
                />
            </Form.Group>
            <Form.Group className="d-flex mb-3">
                <Button 
                    className="justify-content-start" 
                    variant="success" 
                    type="submit"
                >
                    Создать обращение
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
                    className="justify-content-start mx-3"
                    variant="danger" 
                    type="reset"
                >
                    Отменить
                </Button>
                <ToastContainer theme="dark" position="top-center" />
                {isError && <Error message={errorMsg} />} 
            </Form.Group>
        </Form>
    )
    }
