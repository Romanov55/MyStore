import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateType, fetchTypes, deleteType } from "../../http/deviceAPI";
import { Context } from "../..";

const UpdateType = ({ show, onHide, typeToUpdate }) => {
    const { device } = useContext(Context);
    const [value, setValue] = useState(typeToUpdate.name); // Используем текущее имя бренда
    const [error, setError] = useState('');

    const [confirmVisible, setConfirmVisible] = useState(false);

    // Обновить категорию
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

    // Удаление категории
    const handleDeleteType = async () => {
        try {
            const associatedDevices = device.devices.filter(device => device.typeId === typeToUpdate.id);
            if (associatedDevices.length > 0) {
                alert('Нельзя удалить категорию, у которой есть связанные товары.');
            } else {
                await deleteType(typeToUpdate.id);
                // обновление брендов на странице
                device.setTypes(await fetchTypes());
            }
        } catch (error) {
            console.error("Ошибка при удалении бренда:", error);
        }
        
    }

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
                <Button
                    variant="danger"
                    className={`me-auto ${confirmVisible ? 'd-none' : ''}`}
                    onClick={() => setConfirmVisible(true)}
                >
                    Удалить
                </Button>
                {confirmVisible && (
                    <Button
                        className="me-auto"
                        width={150}
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            handleDeleteType();
                        }}
                    >
                        Подтверждение
                    </Button>
                )}
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={upType}>Изменить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateType;
