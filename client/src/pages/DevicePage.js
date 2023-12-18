import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";
import ImgController from "../components/ImgController";
import { observer } from "mobx-react-lite";

const DevicePage = observer(() => {
    const [device, setDevice] = useState({ info: [] });
    const { id } = useParams();

    // Загрузка данных об устройстве при монтировании компонента
    useEffect(() => {
        fetchOneDevice(id).then(data => setDevice(data));
    }, [id]);

    // Функция для добавления продукта в корзину
    const addProductBasket = (id, name, price, img) => {
        // Получаем текущий список продуктов из локального хранилища
        const existingBasket = JSON.parse(localStorage.getItem('basket')) || [];
    
        // Поиск товара в корзине по id
        const existingProductIndex = existingBasket.findIndex(item => item.id === id);
    
        if (existingProductIndex !== -1) {
            // Если товар с таким id уже есть в корзине, увеличиваем его счетчик
            existingBasket[existingProductIndex].quantity += 1;
        } else {
            // Создаем объект для нового продукта
            const newProduct = {
                id,
                name,
                price,
                img,
                quantity: 1,  // начальное количество
            };
    
            // Добавляем новый продукт в корзину
            existingBasket.push(newProduct);
        }
    
        // Обновляем данные в локальном хранилище
        localStorage.setItem('basket', JSON.stringify(existingBasket));
    }

    return (
        <Container className="mt-3">
            <div className="d-flex m-1">
                <Col md={6}>
                    <h2 className="m-2">{device.name}</h2>
                    <ImgController device={device}/>
                </Col>
                <Col md={6}>
                    <h3 className="d-flex justify-content-start m-3">{device.price} Т</h3>
                    <Card
                        className="d-flex flex-column align-content-center justify-content-around m-2"
                        style={{ fontSize: 32, border: '5px solid lightgray' }}
                    >
                        <Button variant="outline-dark" className="m-3" onClick={() => addProductBasket(device.id, device.name, device.price, device.device_images[0].url)}>Добавить в корзину</Button>
                {device.device_infos && device.device_infos.map((info, index) =>
                    <div className="m-2" key={info.id} style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}>
                        {info.title}: {info.description}
                    </div>
                )}
                    </Card>
                </Col>
            </div>
            <div className="d-flex flex-column m-3">

            </div>
        </Container>
    );
})

export default DevicePage;
