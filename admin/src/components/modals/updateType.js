import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateType, fetchTypes } from "../../http/deviceAPI";
import { Context } from "../..";

const UpdateType = ({ show, onHide, typeToUpdate }) => {
    const { device } = useContext(Context);
    const [value, setValue] = useState(typeToUpdate.name); // Используем текущее имя бренда
    const [error, setError] = useState('');

    const upType = async () => {
        if (!value.trim()) {
            setError('Поле не должно быть пустым');
            return;
        }

        try {
            await updateType(typeToUpdate.id, { name: value }); // Передаем ID бренда для обновления
            const updatedTypes = await fetchTypes(); // Загружаем обновленный список брендов
            
            // Обновляем бренды в хранилище MobX
            device.setTypes(updatedTypes);
            
            setValue("");
            onHide();
        } catch (error) {
            setError("Ошибка при изменении категории: " + error.message);
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
                    Изменить Категорию
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
                <Button variant="outline-success" onClick={upType}>Изменить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateType;
