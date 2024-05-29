import { useState } from "react";  
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from 'react-bootstrap';
import { RequestLoginData, useLoginMutation } from "../../store/services/auth";
import { Error } from '../Error/Error'
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FormSignin() {

    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [login, {isLoading, isError}] = useLoginMutation();

    const loginUser = async (data: RequestLoginData, e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resultUser = await login(data).unwrap();
            toast.success(`${resultUser.name} Вы успешно авторизовались`);
            setUser({
                email: '',
                password: '',
            })
            navigate('/seachRooms')
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
        <Form onSubmit={ (e) => loginUser({email: user.email, password: user.password}, e) }  style={{width:'300px'}} className='was-validated'>
            <Form.Group className="mb-2 mx-3" controlId="formBasicEmail">
                <Form.Control onChange={(e) => {setUser({...user, email: e.target.value})}} value={user.email} type="email" placeholder="Введите логин" required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш email</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicPassword">
                <Form.Control onChange={(e) => {setUser({...user, password: e.target.value})}} value={user.password} type="password" placeholder="Введите пароль" minLength={6} required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш пароль(минимум 6 символов)</Form.Control.Feedback>
            </Form.Group>
            <Button 
            className='m-3 btn btn-success' type='submit'>
                Войти 
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