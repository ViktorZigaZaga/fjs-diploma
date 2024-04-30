import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, NavDropdown, Image } from "react-bootstrap";
import FormSignin from "./FormSignin";
import FormSignup from "./FormSignup";

export default function HeaderAuth() {
    const [authForm, setAuthForm] = useState(true);

    return (
        <>
            <NavDropdown align="end" title="Войти" id="navbarScrollingDropdown">
                <Container>
                    <Container className="m-4"> 
                        <Link onClick={() => setAuthForm(true)} to={""} className="link-offset-2 link-underline link-underline-opacity-0">Войти</Link>
                            <span> или </span>
                        <Link onClick={() => setAuthForm(false)} to={""} className="link-offset-2 link-underline link-underline-opacity-0">Зарегистрироваться</Link>
                    </Container>
                    {authForm 
                        ? <FormSignin />
                        : <FormSignup />
                    }
                </Container>
            </NavDropdown>
            <Image
                src="/default_user.svg"
                alt="ProfileDefault"
                width="40"
                height="40"
                roundedCircle 
            />
        </>

    )
}