import React from "react";
import { Container, Button } from "react-bootstrap";
import CreateBrand from "../components/modals/CreateBrand";
import CreateType from "../components/modals/CreateType";
import CreateDevice from "../components/modals/CreateDevice";
import { useState } from "react";

function Admin() {
    const [brandVisable, setBrandVisable] = useState(false)
    const [typeVisable, setTypeVisable] = useState(false)
    const [deviceVisable, setDeviceVisable] = useState(false)
    return (
        <Container className="d-flex flex-column">
            <Button 
                variant="outline-dark" 
                className="mt-2"
                onClick={() => setTypeVisable(true)}
            >
                Добавить тип
            </Button>
            <Button 
                variant="outline-dark" 
                className="mt-2"
                onClick={() => setBrandVisable(true)}
            >
                Добавить бренд
            </Button>
            <Button 
                variant="outline-dark" 
                className="mt-2"
                onClick={() => setDeviceVisable(true)}
            >
                Добавить устройство
            </Button>
            <CreateBrand show={brandVisable} onHide={() => setBrandVisable(false)}/>
            <CreateDevice show={deviceVisable} onHide={() => setDeviceVisable(false)}/>
            <CreateType show={typeVisable} onHide={() => setTypeVisable(false)}/>
        </Container>
    );
};

export default Admin;
