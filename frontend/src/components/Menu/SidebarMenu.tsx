import { ListGroup, Image } from "react-bootstrap"
import { NavLink } from "react-router-dom";

export default function sidebarMenu() {
    
    return(
        <ListGroup variant="flush" className="shadow-sm rounded text-start">
            {/* Только admin */}
            <ListGroup.Item action>
                <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/hotels">
                    <Image src="/keyboard-right-arrow-button.svg" />
                    <span> Все  гостиницы</span>
                </NavLink>
            </ListGroup.Item>
            {/* Все даже неавториз... */}
            <ListGroup.Item action>
                <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/seachHotel">
                    <Image src="/keyboard-right-arrow-button.svg" />
                    <span> Поиск номера</span>
                </NavLink>
            </ListGroup.Item>
            {/* Только admin */}
            <ListGroup.Item action>
                <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/hotel-add">
                    <Image src="/keyboard-right-arrow-button.svg" />
                    <span> Добавить гостиницу</span>
                </NavLink>
            </ListGroup.Item>
            {/* Только роли admin и manager */}
            <ListGroup.Item action>
                <NavLink id="RouterNavLink" className="text-decoration-none text-secondary fw-semibold" to="/users">
                    <Image src="/keyboard-right-arrow-button.svg" />
                    <span> Пользователи</span>
                </NavLink>
            </ListGroup.Item>
        </ListGroup>
    );
}