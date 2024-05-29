import { ListGroup, Image } from "react-bootstrap"
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectIsAuthenticated, selectUserRoleId } from "../../features/authSlice";

export default function sidebarMenu() {

    const userRoleId = useSelector(selectUserRoleId);
    const isAuth = useSelector(selectIsAuthenticated);
    
    return(
        <ListGroup variant="flush" className="shadow-sm rounded text-start">
            {isAuth && userRoleId.role === "admin" &&
                <ListGroup.Item action>
                    <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/hotels">
                        <Image src="/keyboard-right-arrow-button.svg" />
                        <span> Все  гостиницы</span>
                    </NavLink>
                </ListGroup.Item>
            }
            <ListGroup.Item action>
                <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/seachRooms">
                    <Image src="/keyboard-right-arrow-button.svg" />
                    <span> Поиск номера</span>
                </NavLink>
            </ListGroup.Item>
            {isAuth && userRoleId.role === "admin" &&
                <ListGroup.Item action>
                    <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/hotel-add">
                        <Image src="/keyboard-right-arrow-button.svg" />
                        <span> Добавить гостиницу</span>
                    </NavLink>
                </ListGroup.Item>
            }
            {isAuth && (userRoleId.role === "admin" || userRoleId.role === "manager") &&
                <ListGroup.Item action>
                    <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/users">
                        <Image src="/keyboard-right-arrow-button.svg" />
                        <span> Пользователи</span>
                    </NavLink>
                </ListGroup.Item>
            }
            {isAuth && (userRoleId.role === "client" || userRoleId.role === "manager") &&
                <ListGroup.Item action>
                    <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/support-request">
                        <Image src="/keyboard-right-arrow-button.svg" />
                        <span> Обращения</span>
                    </NavLink>
                </ListGroup.Item>
            }
        </ListGroup>
    );
}