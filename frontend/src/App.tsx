import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import './App.css'
import HeaderNavBar from './components/Header/HeaderNavBar'
import SidebarMenu from './components/Menu/SidebarMenu'
import HotelsPage from './components/Hotels/HotelsPage'
import UsersPage from './components/Users/UsersPage'
import Error from './components/Error/404'
import MainPage from './components/Main/MainPage'
import CreateHotelPage from './components/Hotels/CreateHotelPage'
import ReservationsPage from './components/Reservations/ReservationsPage'

function App() {

  return (
    <BrowserRouter>
      <HeaderNavBar />
      <Container>
        <Row>
          <Col sm={3}>
            <SidebarMenu />
          </Col>
          <Col sm={9}>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/hotels' element={<HotelsPage />} />
              <Route path='/hotel-add' element={<CreateHotelPage />} />
              <Route path='/users' element={<UsersPage />} />
              <Route path='/reservations' element={<ReservationsPage />} />
              {/* <Route path='/hotels' element={<HotelsPage />} />
              <Route path='/hotel-add' element={<CreateHotelPage />} />
              <Route path='/users' element={<UsersPage />} />
              <Route path='/reservations' element={<ReservationsPage />} /> */}
              <Route path="*" element={<Error />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  )
}

export default App
