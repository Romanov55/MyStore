import React from "react";
import { Col, Card } from "react-bootstrap";
import Image from "react-bootstrap/Image"
import star from "./assets/star.png"

const DeviceItem = ({device}) => {

    return (
        <Col md={2} className="m-3">
            <Card style={{width: 150, cursor: 'pointer'}} border={'light'}>
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + device.img}/>
                <div className="text-black-50 d-flex justify-content-between align-items-center mt-1">
                    <div>{device.brand}</div>
                    <div className="d-flex align-items-center">
                        <div></div>
                        <Image width={18} height={18} src={star}/>
                    </div>
                </div>
                <div>{device.name}</div>
            </Card>
        </Col>
    )
};

export default DeviceItem;