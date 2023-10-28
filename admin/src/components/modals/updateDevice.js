import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Dropdown, Col } from "react-bootstrap";
import { Context } from "../..";
import { fetchBrands, fetchTypes } from "../../http/deviceAPI";
import { observer } from "mobx-react";

const UpdateDevice = observer(({ show, onHide, deviceToUpdate }) => {
    const { device } = useContext(Context);
    const [name, setName] = useState(deviceToUpdate.name);
    const [price, setPrice] = useState(deviceToUpdate.price);
    const [file, setFile] = useState(deviceToUpdate.img);
    const [info, setInfo] = useState(deviceToUpdate.info || []);
    const [selectedType, setSelectedType] = useState(deviceToUpdate.typeId); // Выбранный тип
    const [selectedBrand, setSelectedBrand] = useState(deviceToUpdate.brandId); // Выбранный бренд

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data));
        fetchBrands().then(data => device.setBrands(data));
    }, [device]);

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
    };

    const updateDevice = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", `${price}`);
            formData.append("img", file);
            formData.append("brandId", device.selectedBrand.id);
            formData.append("typeId", selectedType); // Используем выбранный тип
            formData.append("info", JSON.stringify(info));

            // Обновление устройства
            await updateDevice(deviceToUpdate.id, formData);

            onHide(); // Закрыть модальное окно после успешного обновления
        } catch (error) {
            console.error("Ошибка при обновлении устройства:", error);
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
                    <br />
                    {info.map((i) => (
                        <div className="d-flex mt-1" key={i.number}>
                            <Col md={4} className="m-1">
                                <Form.Control
                                    value={i.title}
                                    onChange={(e) => changeInfo("title", e.target.value, i.number)}
                                    placeholder="Введите название свойства"
                                />
                            </Col>
                            <Col md={4} className="m-1">
                                <Form.Control
                                    value={i.description}
                                    onChange={(e) => changeInfo("description", e.target.value, i.number)}
                                    placeholder="Введите описание свойства"
                                />
                            </Col>
                        </div>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={updateDevice}>
                    Изменить
                </Button>
            </Modal.Footer>
        </Modal>
    );
});
export default UpdateDevice;
