import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image } from "react-bootstrap";
import bagStar from '../components/assets/bigStar.png'
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";

function DevicePage() {
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
            <div className="d-flex">
                <Col md={4}>
                    {/* Отображение изображения устройства */}
                    <Image width={300} height={300} src={process.env.REACT_APP_API_URL + device.img}></Image>
                </Col>
                <Col md={4}>
                    <div className="d-flex flex-column align-items-center">
                        {/* Отображение имени устройства */}
                        <h2>{device.name}</h2>
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{ background: `url(${bagStar}) no-repeat center center`, width: 240, height: 240, backgroundSize: 'cover', fontSize: 64 }}
                        >
                            {/* Отображение рейтинга устройства */}
                            {device.rating}
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-content-center justify-content-around"
                        style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgray' }}
                    >
                        <h3 className="d-flex justify-content-center">{device.price} Т</h3>
                        {/* Кнопка для добавления в корзину */}
                        <Button variant="outline-dark" className="m-3" onClick={() => addProductBasket(device.id, device.name, device.price, device.img)}>Добавить в корзину</Button>
                    </Card>
                </Col>
            </div>
            <div className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {device.device_infos && device.device_infos.map((info, index) =>
                    <div key={info.id} style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}>
                        {/* Отображение характеристик устройства */}
                        {info.title}: {info.description}
                    </div>
                )}
            </div>
        </Container>
    );
}

export default DevicePage;
