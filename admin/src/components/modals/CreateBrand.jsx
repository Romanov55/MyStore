import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createBrand, fetchBrands } from "../../http/deviceAPI";
import { Context } from "../..";

const CreateBrand = ({show, onHide}) => {
    const { device } = useContext(Context);
    const [value, setValue] = useState('')
    const [error, setError] = useState('');

    const addBrand = async () => {
        if (!value.trim()) {
            setError('Поле не должно быть пустым')
            return;
        }

        try {
            await createBrand({ name: value });
            await fetchBrands(); // Загрузить обновленный список брендов
            
            // Обновить бренды в хранилище MobX
            device.setBrands(await fetchBrands());
            
            setValue("");
            onHide();
        } catch (error) {
            setError("Ошибка при добавлении бренда: " + error.message);
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
                    Добавить Бренд
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название бренда"}
                    />
                    {error && <div className="text-danger mt-2">{error}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addBrand}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBrand;