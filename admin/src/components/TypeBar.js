import React, { useContext } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Button, ListGroup } from "react-bootstrap";
import { deleteType, fetchTypes } from "../http/deviceAPI";

const TypeBar = observer(() => {
    const {device} = useContext(Context)

    // Удаление бренда
    const handleDeleteType = async (typeId) => {
        try {
            await deleteType(typeId);
            await fetchTypes()
            // обновление брендов на странице
            device.setTypes(await fetchTypes());
        } catch (error) {
            console.error("Ошибка при удалении бренда:", error);
        }
        
    }

    return (
        <ListGroup>
            {device.types.map(type => 
                <ListGroup.Item
                    style={{cursor:'pointer'}}
                    active={type.id === device.selectedType.id}
                    onClick={() => device.setSelectedType(type)}
                    key={type.id}
                    className="p-3"
                >
                    {type.name}
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