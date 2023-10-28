import React, { useContext, useState } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Button, ListGroup } from "react-bootstrap";
import { deleteType, fetchTypes } from "../http/deviceAPI";
import UpdateType from "./modals/updateType";

const TypeBar = observer(() => {
    const {device} = useContext(Context)

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
        <ListGroup>
            {device.typesVisable && device.types
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(type => 
                <ListGroup.Item
                    style={{cursor:'pointer'}}
                    onClick={() => device.setSelectedType(type)}
                    key={type.id}
                    className="p-3 d-flex justify-content-between"
                >
                    {type.name}
                    <Button 
                            variant="outline-dark" 
                            className="m-2"
                            onClick={() => toggleTypeVisibility(type.id)} // Изменить видимость бренда
                        >
                            Изменить бренд
                    </Button>
                    <UpdateType show={visibleTypes[type.id]} onHide={() => toggleTypeVisibility(type.id)} typeToUpdate={type} />
                    <Button
                        variant="danger"
                        className="mt-2"
                        onClick={() => handleDeleteType(type.id)}
                    >
                        Удалить
                    </Button>
                </ListGroup.Item>
            )}
        </ListGroup>
    )
})

export default TypeBar;