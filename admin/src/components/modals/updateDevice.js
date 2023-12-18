import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Dropdown, Col, Card } from "react-bootstrap";
import { Context } from "../..";
import { deleteDevice, fetchBrands, fetchDevices, fetchTypes, updateDevice } from "../../http/deviceAPI";
import { observer } from "mobx-react";

const UpdateDevice = observer(({ show, onHide, deviceToUpdate }) => {
    const { device } = useContext(Context);
    const [name, setName] = useState(deviceToUpdate.name);
    const [price, setPrice] = useState(deviceToUpdate.price);
    const [files, setFiles] = useState(deviceToUpdate.device_images);
    const [info, setInfo] = useState(deviceToUpdate.device_infos || []);
    const [selectedType, setSelectedType] = useState(deviceToUpdate.typeId); // Выбранный тип
    const [selectedBrand, setSelectedBrand] = useState(deviceToUpdate.brandId); // Выбранный бренд
    
    const [confirmVisible, setConfirmVisible] = useState(false);

    const [error, setError] = useState('');

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data));
        fetchBrands().then(data => device.setBrands(data));
    }, [device]);

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
        setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
    };

    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }

    // Отправляем изменённый товар
    const updateDeviceOnServer = async () => {
        try {
            if (!device.selectedType || !device.selectedBrand || !name || !price) {
                // Проверка на обязательные поля
                setError('Заполните все обязательные поля.')
                return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("brandId", selectedBrand);
            formData.append("typeId", selectedType); // Используем выбранный тип
            formData.append("info", JSON.stringify(info));
    
            // Создание массива для изображений
            const imagesArray = [];
            
            if (files.length === 0) {
                setError('Загрузите изображение')
                return;
            }
            for (let i = 0; i < files.length; i++) {
                // Проверяем, является ли элемент файла (File) или объектом с URL
                if (files[i] instanceof File) {
                    // Если это файл, добавляем его в FormData
                    formData.append("images_new", files[i]);
                } else if (files[i].url) {
                    // Если это объект с URL, добавляем его URL в массив
                    imagesArray.push(files[i].id);
                }
            }
    
            // Добавляем массив изображений в FormData
            formData.append("images_old", imagesArray)
    
            // Обновление устройства
            await updateDevice(deviceToUpdate.id, formData);

            setError('')
            onHide(); // Закрыть модальное окно после успешного обновления
            const updatedDevices = await fetchDevices(device.page, device.limit); // Здесь вы можете указать нужные параметры запроса
            device.setDevices(updatedDevices.rows);
            device.setTotalCount(updatedDevices.count);
        } catch (error) {
            console.error("Ошибка при обновлении устройства:", error);
        }
    };

    // Удаление девайса
    const handleDeleteDevice = async (deviceId) => {
        try {
            await deleteDevice(deviceId);
            // После успешного удаления, очистите текущий список устройств
            device.setDevices([]);
            // Загрузите новый список устройств
            const data = await fetchDevices(device.page, device.limit);
            // Обновите список устройств с новыми данными
            device.setDevices(data.rows);
            device.setTotalCount(data.count);
        } catch (error) {
            console.error("Ошибка при удалении устройства:", error);
        }
    };

    return (
        <Modal onClick={(e) => e.stopPropagation()} show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Изменить Устройство</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2">
                        <Dropdown.Toggle>
                            {
                                device.types.find(type => type.id === selectedType)?.name
                            }
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {device.types.map((type) => (
                                <Dropdown.Item
                                    onClick={() => setSelectedType(type.id)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2">
                        <Dropdown.Toggle>
                            {
                                device.brands.find(brand => brand.id === selectedBrand)?.name
                            }
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {device.brands.map((brand) => (
                                <Dropdown.Item
                                    onClick={() => setSelectedBrand(brand.id)}
                                    key={brand.id}
                                >
                                    {brand.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название устройства"
                    />
                    <Form.Control
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость устройства"
                        type="number"
                    />
                    <Form.Control className="mt-3" type="file" onChange={selectFile} />
                    <div className="d-flex">
                    {files.length > 0 && (
                        <div className="d-flex">
                            {files.map((file, index) => (
                                <Card key={index} className="mt-2 me-2 p-1 d-flex flex-column flex-wrap">
                                    <img
                                        className="mb-2"
                                        src={file.url ? process.env.REACT_APP_API_URL + file.url : URL.createObjectURL(file)}
                                        alt={`Выбранное изображение`}
                                        style={{ maxWidth: "100px" }}
                                    />
                                    <Button variant="outline-danger" onClick={() => removeFile(index)}>Удалить</Button>
                                </Card>
                            ))}
                        </div>
                    )}
                    </div>
                    <br />
                    <div style={{color:'red'}}>{error}</div>
                    <Button
                        variant={"outline-dark"}
                        onClick={addInfo}
                    >
                        Добавить новое свойство
                    </Button>
                    {info.map(i => 
                        <div className="d-flex mt-1" key={i.id}>
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
                <Button
                    width={150}
                    className={`me-auto ${confirmVisible ? 'd-none' : ''}`}
                    variant="danger"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        setConfirmVisible(true);
                    }}
                >
                    Удалить
                </Button>
                {confirmVisible && (
                    <Button
                        className={`me-auto`}
                        width={150}
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            handleDeleteDevice(deviceToUpdate.id);
                        }}
                    >
                        Подтверждение
                    </Button>
                )}
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={updateDeviceOnServer}>
                    Изменить
                </Button>
            </Modal.Footer>
        </Modal>
    );
});
export default UpdateDevice;
