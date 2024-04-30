import { useState } from "react";  
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { Error } from '../Error/Error'
import { RequestRegData, ResponseRegData } from "../../store/services/auth";
import { useRegisterMutation } from "../../store/services/auth";
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";

export default function FormSignupAdmin() {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        contactPhone: '',
        role: 'client'
    })
    const [resUser, setResUser] = useState<ResponseRegData>()

    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [registerUser, {isLoading, error}] = useRegisterMutation();

 
    const registerAdmin = async (data: RequestRegData) => {
        try {
            let resultUser = await registerUser(data).unwrap();
            setResUser(resultUser)
            navigate('/')
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
        <Form onSubmit={() => registerAdmin(user)} style={{ width: '300px' }} className='was-validated'>
            <Form.Group className="mb-2 mx-3" controlId="formBasicEmail">
                <Form.Control onChange={(e) => { setUser({ ...user, email: e.target.value }); } } type="email" placeholder="Введите логин" required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш email</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicPassword">
                <Form.Control onChange={(e) => { setUser({ ...user, password: e.target.value }); } } type="password" placeholder="Введите пароль" minLength={6} required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваш пароль(минимум 6 символов)</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicName">
                <Form.Control onChange={(e) => { setUser({ ...user, name: e.target.value }); } } type="text" placeholder="Введите имя" minLength={1} required />
                <Form.Control.Feedback type="invalid">Необходимо указать Ваше имя</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicNumberPhone">
                <Form.Control onChange={(e) => { setUser({ ...user, contactPhone: e.target.value }); } } type="text" placeholder="Введите номер телефона" />
                <Form.Control.Feedback>Необязательно* укажите Ваш номер телефона (в формате 89998887766) </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2 mx-3" controlId="formBasicNumberPhone">
                <Form.Select className="" onChange={(e) => { setUser({ ...user, role: e.target.value }); } } defaultValue={user.role}>
                    <option value="admin">Админ</option>
                    <option value="manager">Менеджер</option>
                    <option value="client">Клиент</option>
                </Form.Select>
            </Form.Group>
            <Button className='m-3 btn btn-success' type="submit">
                Зарегистрироваться
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
            {resUser && (
                <Container>
                    <h3>Пользователь {resUser.name} email:{resUser.email} успешно зарегистирован</h3>
                    <span>Перейти на{" "}
                        <Link to="/">
                            Главную страницу{" "}
                        </Link>
                    </span>
                </Container>
            )}
            {error && <Error message={errorMsg} />}
        </Form>
    );
}