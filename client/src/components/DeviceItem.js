import React from "react";
import { Col, Card } from "react-bootstrap";
import Image from "react-bootstrap/Image"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { DEVICE_ROUTE } from "../utils/consts";
import { Button } from "react-bootstrap";

const DeviceItem = ({device}) => {
    const history = useHistory()

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
        <Col md={2} className="m-3" onClick={() => history.push(DEVICE_ROUTE + '/' + device.id)}>
            <Card style={{width: 150, cursor: 'pointer'}} border={'light'}>
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + device.device_images[0].url}/>
                <div style={{ textAlign: 'center' }} className="mt-2">
                    <div>{device.name}</div>
                    <div>{device.price} Т</div>
                </div>
                <Button variant="outline-dark" className="m-3" onClick={(event) => {
                    event.stopPropagation();
                    addProductBasket(device.id, device.name, device.price, device.device_images[0].url);
                }}>
                    Добавить в корзину
                </Button>
            </Card>
        </Col>
    )
};

export default DeviceItem;