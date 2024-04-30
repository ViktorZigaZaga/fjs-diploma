import { Navbar, Container, Nav, Image, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/authSlice';
import HeaderAuth from './HeaderAuth';
import HeaderProfile from './HeaderProfile'
import { useEffect } from 'react';

export default function HeaderNavBar() {

  const navigate = useNavigate()
  const user = useSelector(selectUser);
  console.log(user);
  useEffect(() => {
    if(!user) navigate('/')
  }, [user])

  
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
            { user 
              ? <><Link to="/reservations" className="mb-1 text-decoration-none">
                  <Button className="d-flex justify-content-start mx-3" variant="primary">
                    Мои брони
                  </Button>
                </Link>
                <HeaderProfile /></>
              : <HeaderAuth />} 
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
