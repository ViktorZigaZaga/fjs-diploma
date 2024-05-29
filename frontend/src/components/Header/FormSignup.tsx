import { useState } from "react";  
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from 'react-bootstrap';
import { Error } from '../Error/Error'
import { RequestRegData, useRegisterMutation } from "../../store/services/auth";
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FormSignup() {

    const [user, setUser] = useState<RequestRegData>({
        name: '',
        email: '',
        password: '',
        contactPhone: '',
    })
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const [register, {isLoading, isError}] = useRegisterMutation();
 
    const registerUser = async (data: RequestRegData, e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resultReg = await register(data).unwrap();
            toast.success(`${resultReg.name} Вы успешно зарегистрировались`);
            setUser({
                name: '',
                email: '',
                password: '',
                contactPhone: '',
            })
            navigate('/hotels')
        } catch (err) {
            const maybeError = isErrorWithMessage(err);
            if(maybeError) {
                setErrorMsg(err.data.message)
            } else {
                setErrorMsg("Неизвестная ошибка");
            }
        }
    }

    return(
        <Form onSubmit={ (e) => registerUser(user, e) } style={{width:'300px'}} className='was-validated'>
            <Form.Group className="mb-2 mx-3" controlId="formBasicEmail">
                <Form.Control onChange={(e) => {setUser({...user, email: e.target.value})}} value={user.email} type="email" placeholder="Введите логин" required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш email</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicPassword">
                <Form.Control onChange={(e) => {setUser({...user, password: e.target.value})}} value={user.password} type="password" placeholder="Введите пароль" minLength={6} required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш пароль(минимум 6 символов)</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicName">
                <Form.Control onChange={(e) => {setUser({...user, name: e.target.value})}} value={user.name} type="text" placeholder="Введите имя" minLength={1} required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваше имя</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicNumberPhone">
                <Form.Control onChange={(e) => {setUser({...user, contactPhone: e.target.value})}} value={user.contactPhone} type="text" placeholder="Введите номер телефона" />
                <Form.Control.Feedback>Необязательно* укажите Ваш номер телефона (в формате 89998887766) </Form.Control.Feedback>
            </Form.Group>
            <Button className='m-3 btn btn-success' type="submit">
                Зарегистрироваться 
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
        </Form>
    );
}