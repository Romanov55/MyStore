import React, { useContext, useEffect } from "react";
import { Modal, Button, Form, Dropdown, Col, Card } from "react-bootstrap";
import { Context } from "../..";
import { useState } from "react";
import { createDevice, fetchBrands, fetchDevices, fetchTypes } from "../../http/deviceAPI";
import { observer } from "mobx-react";

const CreateDevice = observer(({show, onHide}) => {
    const {device} = useContext(Context)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState([]);

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
    }, [device])
    
    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }

    const selectFile = (e) => {
        const selectedFiles = e.target.files;
        setFiles([...files, ...selectedFiles]); // Add selected files to the array
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i))
    }

    const addDevice = async () => {
        try {
            if (!device.selectedType || !device.selectedBrand || !name || !price) {
                // Проверка на обязательные поля
                console.error("Заполните все обязательные поля.");
                return;
            }
    
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("brandId", device.selectedBrand.id);
            formData.append("typeId", device.selectedType.id);
            formData.append("info", JSON.stringify(info));
    
            // Добавление изображений
            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }
    
            // Создание устройства
            await createDevice(formData);
    
            // После успешного создания, обновите список устройств
            const data = await fetchDevices(device.page, device.limit);
            device.setDevices(data.rows);
    
            // Сбросить значения полей формы
            setName('');
            setPrice(0);
            setFiles([]);
            setInfo([]);
    
            onHide(); // Закрыть модальное окно после успешного создания
        } catch (error) {
            console.error("Ошибка при создании устройства:", error);
            // Добавьте обработку ошибок для информирования пользователя
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
                    Добавить Устройство
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2">
                        <Dropdown.Toggle>{device.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {device.types.map(type =>
                                <Dropdown.Item 
                                    onClick={() => device.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2">
                        <Dropdown.Toggle>{device.selectedBrand.name || "Выберите бренд"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {device.brands.map(brand =>
                                <Dropdown.Item 
                                    onClick={() => device.setSelectedBrand(brand)}
                                    key={brand.id}
                                >
                                    {brand.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название устройства"
                    />
                    <Form.Control
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость устройства"
                        type="number"
                    />
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                        multiple // Allow multiple file selection
                    />
                    {files.length > 0 && (
                        <div className="d-flex">
                            {files.map((file, index) => (
                                <Card key={index} className="mt-2 me-2 p-1 d-flex flex-column flex-wrap">
                                    <img className="mb-2" src={URL.createObjectURL(file)} alt={`Выбранное изображение`} style={{ maxWidth: "100px" }} />
                                    <Button variant="outline-danger" onClick={() => removeFile(index)}>Удалить</Button>
                                </Card>
                            ))}
                        </div>
                    )}
                    <br/>
                    <Button
                        variant={"outline-dark"}
                        onClick={addInfo}
                    >
                        Добавить новое свойство
                    </Button>
                    {info.map(i => 
                        <div className="d-flex mt-1" key={i.number}>
                            <Col md={4} className="m-1">
                                <Form.Control
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                    placeholder="Введите название свойства"
                                />
                            </Col>
                            <Col md={4} className="m-1">
                                <Form.Control
                                    value={i.description}
                                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                    placeholder="Введите описание свойства"
                                />
                            </Col>
                            <Col md={4} className="m-1">
                                <Button 
                                    variant={'outline-danger'}
                                    onClick={() => removeInfo(i.number)}
                                >
                                    Удалить
                                </Button>
                            </Col>
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addDevice}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});
export default CreateDevice;