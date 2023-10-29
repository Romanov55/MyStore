import React, { useContext } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import { login } from "../http/userApi";
import { useState } from "react";
import { observer } from 'mobx-react';
import { Context } from "..";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useHistory();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const click = async () => {
        try {
            if (isLogin) {
                const data = await login(email, password); // Предполагается, что login правильно возвращает данные пользователя
                if (data.role === 'ADMIN') {
                    user.setUser(data); // Установите пользователя из полученных данных
                    user.setIsAuth(true);
                    history.push(ADMIN_ROUTE);
                } else {
                    alert('Неверные данные');
                }
            }
        } catch (e) {
            alert(e.message || 'Произошла ошибка при входе.'); // Обработка ошибки с учетом возможного отсутствия message
        }
    }
    

    return (
        <Container 
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">Авторизация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш логин..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-3 ps-3">
                        <Button
                            variant="outline-success"
                            onClick={click}
                        >
                            Войти
                        </Button>
                    </div>
                </Form>
            </Card>

        </Container>
    );
});

export default Auth;
