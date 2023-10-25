import React, { useContext } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Card } from "react-bootstrap";

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <div className="d-flex flex-row flex-wrap">
            {device.brands.map(brand => 
                <Card
                    style={{cursor:'pointer'}}
                    border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
                    key={brand.id}
                    className="p-3 m-1"
                    onClick={() => device.setSelectedBrand(brand)}
                >
                    {brand.name}
                </Card>
            )}
        </div>
    );
});

export default BrandBar;
