import React from "react";
import { Col, Card } from "react-bootstrap";
import Image from "react-bootstrap/Image"

const DeviceItem = ({device}) => {

    return (
        <Col md={2} className="m-3">
            <Card style={{width: 150, cursor: 'pointer'}} border={'light'}>
            <div className="d-flex justify-content-start align-items-center mt-1">{device.name}</div>
                <Image
                    width={150}
                    height={150}
                    src={
                        device.device_images.length > 0
                            ? import.meta.env.VITE_APP_API_BASE + device.device_images[device.device_images.length - 1].url
                            : ''
                    }
                />
                <div className="text-black-50 d-flex justify-content-between align-items-center mt-1">
                    <div>{device.brand}</div>
                </div>
            </Card>
        </Col>
    )
};

export default DeviceItem;