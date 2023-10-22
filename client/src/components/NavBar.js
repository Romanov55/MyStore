import React, { useContext } from 'react'
import { Context } from '../index';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { Button, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const NavBar = observer(() => {
    const { user } = useContext(Context)
    const history = useHistory()

    const logOut = () => {
        try {
            user.setUser({})
            user.setIsAuth(false)
            localStorage.removeItem('token');
            history.push(LOGIN_ROUTE); // Перенаправьте пользователя после успешного выхода
        } catch (error) {
            // Обработайте ошибку, если выход завершился неудачно
            console.error("Ошибка при выходе:", error);
        }
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={NavLink} to={SHOP_ROUTE}>
                    КупиДевайс
                </Navbar.Brand>
                {user.isAuth ?
                    <Nav>
                        <Button 
                            variant={'outline-light'}
                            onClick={() => history.push(BASKET_ROUTE)}
                            className="ms-2"
                        >
                            Корзина
                        </Button>
                        <Button 
                            variant={'outline-light'}
                            onClick={() => logOut()}
                            className="ms-2"
                        >
                            Выйти
                        </Button>
                    </Nav>
                :
                    <Nav className="">
                        <Button variant={'outline-light'} onClick={() => history.push(LOGIN_ROUTE)}>Авторизация</Button>
                    </Nav>
                }
            </Container>
        </Navbar>
    )
})

export default NavBar;
