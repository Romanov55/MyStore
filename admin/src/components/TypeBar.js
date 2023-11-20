import React, { useContext, useState } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Button, ListGroup } from "react-bootstrap";
import { deleteType, fetchTypes } from "../http/deviceAPI";
import UpdateType from "./modals/updateType";
import CreateType from "./modals/CreateType";

const TypeBar = observer(() => {
    const {device} = useContext(Context)

    const [typeVisable, setTypeVisable] = useState(false)

    // Удаление типа
    const handleDeleteType = async (typeId) => {
        try {
            const associatedDevices = device.devices.filter(device => device.typeId === typeId);
            if (associatedDevices.length > 0) {
                alert('Нельзя удалить категорию, у которой есть связанные товары.');
            } else {
                await deleteType(typeId);
                // обновление брендов на странице
                device.setTypes(await fetchTypes());
            }
        } catch (error) {
            console.error("Ошибка при удалении бренда:", error);
        }
        
    }

    const [visibleTypes, setVisibleTypes] = useState({}); // Хранить видимость для каждого бренда

    const toggleTypeVisibility = (typeId) => {
        // Обновить видимость для конкретного бренда
        setVisibleTypes({
            ...visibleTypes,
            [typeId]: !visibleTypes[typeId]
        });
    }

    return (
        device.typesVisable ? (
            <ListGroup>
                <h3>Категории</h3>
                <Button 
                    variant="outline-dark" 
                    className="m-2 ms-auto"
                    onClick={() => setTypeVisable(true)}
                    style={{width : 100}}
                >
                    Добавить
                </Button>
                <CreateType show={typeVisable} onHide={() => setTypeVisable(false)}/>
                <div className="d-flex">
                    {device.types
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(type => 
                        <ListGroup.Item
                            style={{cursor:'pointer'}}
                            onClick={() => device.setSelectedType(type)}
                            key={type.id}
                            className="p-3 m-3 d-flex flex-column justify-content-between"
                        >
                            <div style={{textAlign:'center'}}>{type.name}</div>
                            <Button 
                                    variant="outline-dark" 
                                    className="m-2"
                                    onClick={() => toggleTypeVisibility(type.id)} // Изменить видимость бренда
                                >
                                    Изменить
                            </Button>
                            <UpdateType show={visibleTypes[type.id]} onHide={() => toggleTypeVisibility(type.id)} typeToUpdate={type} />
                            <Button
                                variant="danger"
                                className="m-2"
                                onClick={() => handleDeleteType(type.id)}
                            >
                                Удалить
                            </Button>
                        </ListGroup.Item>
                    )}
                </div>
            </ListGroup>
        ) : null
    );
})

export default TypeBar;