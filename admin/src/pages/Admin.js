import React, { useContext, useEffect } from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import CreateBrand from "../components/modals/CreateBrand";
import CreateType from "../components/modals/CreateType";
import CreateDevice from "../components/modals/CreateDevice";
import { useState } from "react";
import BrandBar from "../components/BrandBar";
import { Context } from "..";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import TypeBar from "../components/TypeBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import Dashboard from "../components/Dashboard";

const Admin = observer(()  => {
    const {device} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
        fetchDevices(1, 2).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [device])
    
    useEffect(() => {
        fetchDevices(device.page, device.limit).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [device.limit, device])

    const [brandVisable, setBrandVisable] = useState(false)
    const [typeVisable, setTypeVisable] = useState(false)
    const [deviceVisable, setDeviceVisable] = useState(false)

    return (
        <Container className="d-flex flex-column">
            <Row className="mt-2">
                <Col md={3}>
                    <Dashboard/>
                </Col>
                <Col md={9}>
                    <Button 
                        variant="outline-dark" 
                        className="m-2"
                        onClick={() => setTypeVisable(true)}
                    >
                        Добавить категорию
                    </Button>
                    <Button 
                        variant="outline-dark" 
                        className="m-2"
                        onClick={() => setBrandVisable(true)}
                    >
                        Добавить бренд
                    </Button>
                    <Button 
                        variant="outline-dark" 
                        className="m-2"
                        onClick={() => setDeviceVisable(true)}
                    >
                        Добавить устройство
                    </Button>
                    <CreateDevice show={deviceVisable} onHide={() => setDeviceVisable(false)}/>
                    <CreateType show={typeVisable} onHide={() => setTypeVisable(false)}/>
                    <CreateBrand show={brandVisable} onHide={() => setBrandVisable(false)}/>
                    <BrandBar />
                    <TypeBar/>
                    <DeviceList/>
                </Col>
            </Row>
        </Container>
    );
});

export default Admin;
