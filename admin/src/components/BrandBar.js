import React, { useContext } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Button, ListGroup } from "react-bootstrap";
import { deleteBrand, fetchBrands } from "../http/deviceAPI";

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    // Удаление бренда
    const handleDeleteBrand = async (brandId) => {
        try {
            await deleteBrand(brandId);
            await fetchBrands()
            // обновление брендов на странице
            device.setBrands(await fetchBrands());
        } catch (error) {
            console.error("Ошибка при удалении бренда:", error);
        }
        
    }

    return (
        <ListGroup>
            {device.brandsVisable && device.brands.map(brand => 
                <ListGroup.Item
                    style={{cursor:'pointer'}}
                    border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
                    key={brand.id}
                    className="p-3 d-flex justify-content-between "
                    onClick={() => device.setSelectedBrand(brand)}
                >
                    {brand.name}
                    <Button
                        variant="danger"
                        className="mt-2"
                        onClick={() => handleDeleteBrand(brand.id)}
                    >
                        Удалить
                    </Button>
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default BrandBar;
