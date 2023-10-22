import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Image } from "react-bootstrap";

const Basket = observer(() => {
    // Используйте useState для управления состоянием корзины
    const [products, setProducts] = useState([]);
    
    // Функция для удаления продукта из корзины
    const deleteFromBasket = (id) => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);

        // Обновляем данные в localStorage
        localStorage.setItem('basket', JSON.stringify(updatedProducts));
    }
    

    useEffect(() => {
        // Получаем данные из localStorage и устанавливаем их в состояние
        const basketData = JSON.parse(localStorage.getItem('basket')) || [];
        setProducts(basketData);
    }, []);

    const calculateTotalPrice = () => {
        let total = 0;
        products.forEach(product => {
            total += product.price * product.quantity;
        });
        return total;
    }

     // Форматированная итоговая цена
    const formattedTotalPrice = calculateTotalPrice().toLocaleString('kz-KZ', { style: 'currency', currency: 'KZT' });


    return (
        <Container>
            <Card className="mt-3 d-flex flex-row justify-content-around align-items-center">
                <h4>Название</h4>
                <h4>Цена</h4>
                <h4>Изображение</h4>
                <h4>Количество</h4>
                <div></div>
            </Card>
            {products.map(product => 
                <Card className="mt-3 d-flex flex-row justify-content-around align-items-center">
                    <div>{product.name}</div>
                    <div>{product.price}</div>
                    <Image style={{ width: 200, height: 200}} src={process.env.REACT_APP_API_URL + product.img} alt="img"/>
                    <div>{product.quantity}</div>
                    <Button variant="outline-dark" onClick={() => deleteFromBasket(product.id)}>Удалить</Button>
                </Card>
            )}
            <div>Итоговая цена: {formattedTotalPrice}</div>
        </Container>
    );
})

export default Basket;
