import { Button, Container, NavDropdown, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, selectUser, selectUserRoleId } from "../../features/authSlice";
import { useSocket } from "../../socket/hooks/useSocket";

export default function HeaderProfile() {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const onClickLogout = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    navigate('/')
  }

  const user = useSelector(selectUser);
  const userRoleId = useSelector(selectUserRoleId);
  useSocket();

  return (
    <>
      <NavDropdown  align="end" title="Профиль" id="navbarScrollingDropdown">
        <Container className="flex justify-content-start m-2"> 
          <h2 className="m-3">Профиль:</h2>
          <Container className="m-2"><strong>Имя пользователя: </strong>{user?.name}</Container>
          <Container className="m-2"><strong>Почта пользователя: </strong>{user?.email}</Container>
          <Container className="m-2"><strong>ID пользователя: </strong>{userRoleId._id}</Container>
          <Container className="m-2"><strong>Роль пользователя: </strong>{userRoleId.role}</Container>
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
