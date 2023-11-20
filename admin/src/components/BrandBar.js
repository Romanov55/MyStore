import React, { useContext, useState } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Button, ListGroup } from "react-bootstrap";
import { deleteBrand, fetchBrands } from "../http/deviceAPI";
import UpdateBrand from "./modals/updateBrand";
import CreateBrand from "./modals/CreateBrand";

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    // Удаление бренда
    const handleDeleteBrand = async (brandId) => {
        try {
            const associatedDevices = device.devices.filter(device => device.brandId === brandId);
            if (associatedDevices.length > 0) {
                // Есть связанные товары, выведите сообщение об ошибке
                alert('Нельзя удалить бренд, у которого есть связанные товары.');
            } else {
                // Нет связанных товаров, можно удалить бренд
                await deleteBrand(brandId);
                device.setBrands(await fetchBrands());
            }
        } catch (error) {
            console.error("Ошибка при удалении бренда:", error);
        }
    }
    
    const [visibleBrands, setVisibleBrands] = useState({}); // Хранить видимость для каждого бренда
    const [brandVisable, setBrandVisable] = useState(false)

    const toggleBrandVisibility = (brandId) => {
        // Обновить видимость для конкретного бренда
        setVisibleBrands({
            ...visibleBrands,
            [brandId]: !visibleBrands[brandId]
        });
    }

    return (
        device.brandsVisable ? (
            <ListGroup>
                <h3>Бренды</h3>
                <Button 
                    variant="outline-dark" 
                    className="m-2 ms-auto"
                    onClick={() => setBrandVisable(true)}
                    style={{width : 100}}
                >
                    Добавить
                </Button>
                <CreateBrand show={brandVisable} onHide={() => setBrandVisable(false)}/>
                <div className="d-flex">
                    {device.brands
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(brand => 
                            <ListGroup.Item
                                style={{cursor:'pointer'}}
                                border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
                                key={brand.id}
                                className="p-3 m-3 d-flex flex-column justify-content-center "
                                onClick={() => device.setSelectedBrand(brand)}
                            >
                                <div style={{textAlign:'center'}}>{brand.name}</div>
                                <Button 
                                    variant="outline-dark" 
                                    className="m-2"
                                    onClick={() => toggleBrandVisibility(brand.id)} // Изменить видимость бренда
                                >
                                    Изменить
                                </Button>
                                <UpdateBrand show={visibleBrands[brand.id]} onHide={() => toggleBrandVisibility(brand.id)} brandToUpdate={brand} />
                                <Button
                                    variant="danger"
                                    className="m-2"
                                    onClick={() => handleDeleteBrand(brand.id)}
                                >
                                    Удалить
                                </Button>
                            </ListGroup.Item>
                    )}
                </div>
            </ListGroup>
        ) : null
    );
});

export default BrandBar;
