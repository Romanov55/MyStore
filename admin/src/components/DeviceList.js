import React, { useContext, useState } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import DeviceItem from "./DeviceItem";
import { Button } from "react-bootstrap";
import { deleteDevice, fetchDevices } from "../http/deviceAPI";
import Pages from "./Pages";
import UpdateDevice from "./modals/updateDevice";
import CreateDevice from "./modals/CreateDevice";

const DeviceList = observer(() => {
    const { device } = useContext(Context);

    const [visibleDevices, setVisibleDevices] = useState({});
    const [search, setSearch] = useState('');
    const [deviceVisable, setDeviceVisable] = useState(false)


    const toggleDeviceVisibility = (deviceId) => {
        // Обновить видимость для конкретного устройства
        setVisibleDevices({
            ...visibleDevices,
            [deviceId]: !visibleDevices[deviceId]
        });
    };

    const filteredDevices = device.devices.filter(item => {
        if (search === '') {
          return true; // Если значение search пустое, отображать все товары
        } else {
            // Разделить введенную строку на отдельные слова
            const searchWords = search.toLowerCase().split(' ');
            // Разделить название устройства на отдельные слова
            const itemWords = item.name.toLowerCase().split(' ');
            
            // Фильтровать по тому, что хотя бы одно слово из названия устройства начинается с хотя бы одного слова из введенной строки
            return searchWords.some(searchWord =>
                itemWords.some(itemWord => itemWord.startsWith(searchWord))
            );
        }
    });


    return (
        device.devicesVisable ? (
            <div>
                <h3>Товары</h3>
                <div className="d-flex justify-content-between">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск товара"
                        style={{ height: 40 }}
                    />
                    <Button
                        variant="outline-dark"
                        className="m-2"
                        onClick={() => setDeviceVisable(true)}
                        style={{width : 100}}
                    >
                        Добавить
                    </Button>
                    <CreateDevice show={deviceVisable} onHide={() => setDeviceVisable(false)} />
                </div>
                <div className="d-flex flex-wrap">
                    {Array.isArray(filteredDevices) && filteredDevices.map(item => (
                        <div
                            key={item.id}
                            onClick={() => toggleDeviceVisibility(item.id)}
                        >
                            <DeviceItem device={item} />
                            <UpdateDevice show={visibleDevices[item.id]} onHide={() => toggleDeviceVisibility(item.id)} deviceToUpdate={item} />
                        </div>
                    ))}
                </div>
                <Pages />
            </div>
        ) : null
    );
    
});

export default DeviceList;
