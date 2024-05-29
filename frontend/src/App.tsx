import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Col, Container, Row } from 'react-bootstrap'
import './App.css'
import HeaderNavBar from './components/Header/HeaderNavBar'
import SidebarMenu from './components/Menu/SidebarMenu'
import HotelsPage from './components/Hotels/HotelsPage'
import AboutHotelPage from './components/Hotels/HotelsList/AboutHotelPage'
import UsersPage from './components/Users/UsersPage'
import Error from './components/Error/404'
import MainPage from './components/Main/MainPage'
import CreateHotelPage from './components/Hotels/CreateHotelPage'
import ReservationsPage from './components/Reservations/ReservationsPage'
import { selectIsAuthenticated, selectUserRoleId } from './features/authSlice'
import SearchRoomsPage from './components/Hotels/SearchRoomsPage'
import { AboutRoomPage } from './components/Hotels/RoomsList/AboutRoomPage'
import CreateRoomPage from './components/Hotels/CreateRoomPage'
import SupportRequestPage from './components/SupportRequest/SupportRequestPage'
import ChatPage from './components/SupportRequest/Chat/ChatPage'
import { SocketClient } from './socket/SocketClient'
import UpdateRoomPage from './components/Hotels/UpdateRoomPage'
import UpdateHotelPage from './components/Hotels/UpdateHotelPage'

function App() {

  SocketClient()
  const isAuth = useSelector(selectIsAuthenticated);
  const userRoleId = useSelector(selectUserRoleId);

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
              <Route path='/seachRooms' element={<SearchRoomsPage />} />
              <Route path='/room/:id' element={<AboutRoomPage />} />
              {isAuth 
                && userRoleId.role === 'admin' 
                && <Route path='/hotels' element={<HotelsPage />} />
              }
              {isAuth 
                && userRoleId.role === 'admin' 
                && <Route path='/hotel/:id' element={<AboutHotelPage />} />
              }
              {isAuth 
                && userRoleId.role === 'admin' 
                && <Route path='/hotel-add' element={<CreateHotelPage />} />
              }
              {isAuth 
                && userRoleId.role === 'admin' 
                && <Route path='/room-add/:id' element={<CreateRoomPage />} />
              }
              {isAuth 
                && userRoleId.role === 'admin' 
                && <Route path='/hotel/update/:id' element={<UpdateHotelPage />} />
              }
              {isAuth 
                && userRoleId.role === 'admin' 
                && <Route path='/room/update/:id' element={<UpdateRoomPage />} />
              }
              {isAuth 
                && (userRoleId.role === 'admin' || userRoleId.role === 'manager') 
                && <Route path='/users' element={<UsersPage />} />
              }
              {isAuth 
                && (userRoleId.role === 'client' || userRoleId.role === 'manager') 
                && <Route path='/reservations' element={<ReservationsPage />} />
              }
              {isAuth 
                && (userRoleId.role === 'client' || userRoleId.role === 'manager') 
                && <Route path='/reservations/:id' element={<ReservationsPage />} />
              }
              {isAuth 
                && (userRoleId.role === 'client' || userRoleId.role === 'manager') 
                && <Route path='/support-request' element={<SupportRequestPage />} />
              }
              {isAuth 
                && (userRoleId.role === 'client' || userRoleId.role === 'manager') 
                && <Route path="/chat/:id" element={<ChatPage />} />
              }
              <Route path="*" element={<Error />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  )
}

export default App
