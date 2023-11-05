import React, { useContext, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
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

    return (
        <Container className="d-flex flex-column">
            <Row className="mt-2">
                <Col md={3}>
                    <Dashboard/>
                </Col>
                <Col md={9}>
                    <BrandBar/>
                    <TypeBar/>
                    <DeviceList/>
                </Col>
            </Row>
        </Container>
    );
});

export default Admin;
