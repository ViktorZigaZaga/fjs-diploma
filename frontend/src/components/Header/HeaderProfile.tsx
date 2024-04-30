import { Button, Container, NavDropdown, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";

export default function HeaderProfile() {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const onClickLogout = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    navigate('/')
  }

  return (
    <>
      <NavDropdown  align="end" title="Профиль" id="navbarScrollingDropdown">
        <Container className="flex justify-content-start m-2"> 
          <h2 className="m-3">Профиль:</h2>
          <Container className="m-2"><strong>Имя пользователя:</strong> Почтаполь</Container>
          <Container className="m-2"><strong>Почта пользователя:</strong> Почтапользователя</Container>
          <Container className="m-2"><strong>ID пользователя:</strong> Почтапользователя</Container>
          <Container className="m-2"><strong>Роль пользователя:</strong> Почтапользователя</Container>
          <Button onClick={onClickLogout} className='m-3 btn btn-danger' type="submit">
            Выйти
          </Button>
        </Container>
      </NavDropdown>
      <Image
        src="/user.png"
        alt="Profile"
        width="40"
        height="40"
        roundedCircle 
      />
    </>
  )
}
