import React, { useContext } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
    const {device} = useContext(Context)

    return (
        <div className="d-flex flex-wrap">
            {device.devices.map(device => 
                <div key={device.id}>
                    <DeviceItem device={device}/>
                </div>
            )}
        </div>
    )
});

export default DeviceList;