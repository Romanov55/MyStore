import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createBanner, fetchBanners } from "../../http/deviceAPI";
import { Context } from "../..";

const CreateBanner = ({show, onHide}) => {
    const { banner } = useContext(Context);
    const [file, setFile] = useState([]);
    const [error, setError] = useState('');

    const selectFile = (e) => {
        const selectedFiles = e.target.files;
        setFile([...file, ...selectedFiles]); // Add selected files to the array
    };

    const addBanner = async () => {
        try {
            if (!file) {
                setError("Выберите файл перед добавлением баннера.");
                return;
            }
    
            const formData = new FormData();
            formData.append("banner", file);
    
            await createBanner(formData); // Отправить formData на сервер
            await fetchBanners(); // Загрузить обновленный список брендов
    
            // Обновить бренды в хранилище MobX
            banner.setBanners(await fetchBanners());
    
            setFile(null); // Сбросить выбранный файл
            onHide();
        } catch (error) {
            setError("Ошибка при добавлении баннера: " + error.message);
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
                    Добавить Баннер
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                        multiple // Allow multiple file selection
                    />
                    {error && <div className="text-danger mt-2">{error}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addBanner}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBanner;