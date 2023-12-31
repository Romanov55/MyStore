import React, { useContext } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { ListGroup } from "react-bootstrap";

const TypeBar = observer(() => {
    const {device} = useContext(Context)

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
                </ListGroup.Item>
            )}
        </ListGroup>
    )
})

export default TypeBar;