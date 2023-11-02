import React, { useContext, useEffect } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Pagination } from "react-bootstrap";
import { fetchDevices } from "../http/deviceAPI";

const Pages = observer(() => {
    const { device } = useContext(Context);

    const pageCount = Math.ceil(device.totalCount / device.limit);
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1);
    }

    const handlePageClick = (page) => {
        // Обновите состояние страницы в MobX
        device.setPage(page);
        // Затем обновите список устройств
        fetchDevices(page, device.limit)
            .then(data => device.setDevices(data.rows))
            .catch(error => console.error("Ошибка при загрузке устройств:", error));
    };

    return (
        <Pagination className="mt-5">
            {pages.map(page => 
                <Pagination.Item
                    key={page}
                    active={device.page === page}
                    onClick={() => handlePageClick(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default Pages;
