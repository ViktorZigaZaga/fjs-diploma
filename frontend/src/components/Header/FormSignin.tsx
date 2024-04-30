import { useState } from "react";  
import { Button, Form, Spinner } from 'react-bootstrap';
import { Error } from '../Error/Error'
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/services/auth";
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

    const loginUser = async () => {
        try {
            const resultUser = await login(user).unwrap();
            toast.success(`${resultUser.name} Вы успешно авторизовались`);
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

    return(
        <Form style={{width:'300px'}} className='was-validated'>
            <Form.Group className="mb-2 mx-3" controlId="formBasicEmail">
                <Form.Control onChange={(e) => {setUser({...user, email: e.target.value})}} type="email" placeholder="Введите логин" required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш email</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicPassword">
                <Form.Control onChange={(e) => {setUser({...user, password: e.target.value})}} type="password" placeholder="Введите пароль" minLength={6} required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш пароль(минимум 6 символов)</Form.Control.Feedback>
            </Form.Group>
            <Button onClick={ loginUser } className='m-3 btn btn-success' type='submit'>
                Войти 
                {
                isLoading
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