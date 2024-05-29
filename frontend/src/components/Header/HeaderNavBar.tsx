import { Navbar, Container, Nav, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectUser, selectUserRoleId } from '../../features/authSlice';
import HeaderAuth from './HeaderAuth';
import HeaderProfile from './HeaderProfile'
import HeaderAuthAdmin from './HeaderAuthAdmin';

export default function HeaderNavBar() {

  const user = useSelector(selectUser);
  const userRoleId = useSelector(selectUserRoleId);
  
  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand className='bg-secondary rounded' style={{minWidth: "23.7%"}}>
          <Link className="navbar-brand fw-bold" to="/">
            <Image src="/logo.png" alt="Logo" width={90} height={44} rounded />
            Hotel search
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='shadow-sm justify-content-end bg-white rounded p-2' id="navbarScroll">
          <Nav navbarScroll>
            { userRoleId.role === "admin" &&
              <HeaderAuthAdmin />
            }
            { userRoleId.role === "client" &&
              <Link to="/reservations" className="mb-1 text-decoration-none">
                  <Button className="d-flex justify-content-start mx-3" variant="primary">
                    Мои брони
                  </Button>
                </Link>
            }
            { user
              ? <HeaderProfile />
              : <HeaderAuth />
            } 
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
