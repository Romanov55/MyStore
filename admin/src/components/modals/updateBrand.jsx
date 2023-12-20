import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateBrand, fetchBrands, deleteBrand } from "../../http/deviceAPI";
import { Context } from "../..";

const UpdateBrand = ({ show, onHide, brandToUpdate }) => {
    const { device } = useContext(Context);
    const [value, setValue] = useState(brandToUpdate.name); // Используем текущее имя бренда
    const [error, setError] = useState('');

    const [confirmVisible, setConfirmVisible] = useState(false);

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

    const handleDeleteBrand = async () => {
        try {
            const associatedDevices = device.devices.filter(device => device.brandId === brandToUpdate.id);
            if (associatedDevices.length > 0) {
                alert('Нельзя удалить бренд, у которого есть связанные товары.');
            } else {
                await deleteBrand(brandToUpdate.id);
                device.setBrands(await fetchBrands());
                onHide();
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
                            handleDeleteBrand();
                        }}
                    >
                        Подтверждение
                    </Button>
                )}
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={upBrand}>Изменить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateBrand;
