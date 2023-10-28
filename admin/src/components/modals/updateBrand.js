import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateBrand, fetchBrands } from "../../http/deviceAPI";
import { Context } from "../..";

const UpdateBrand = ({ show, onHide, brandToUpdate }) => {
    const { device } = useContext(Context);
    const [value, setValue] = useState(brandToUpdate.name); // Используем текущее имя бренда
    const [error, setError] = useState('');

    const upBrand = async () => {
        if (!value.trim()) {
            setError('Поле не должно быть пустым');
            return;
        }

        try {
            await updateBrand(brandToUpdate.id, { name: value }); // Передаем ID бренда для обновления
            const updatedBrands = await fetchBrands(); // Загружаем обновленный список брендов
            
            // Обновляем бренды в хранилище MobX
            device.setBrands(updatedBrands);
            
            setValue("");
            onHide();
        } catch (error) {
            setError("Ошибка при изменении бренда: " + error.message);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Изменить Бренд
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={"Введите название бренда"}
                    />
                    {error && <div className="text-danger mt-2">{error}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={upBrand}>Изменить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateBrand;
