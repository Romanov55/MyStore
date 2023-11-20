import React, { useContext, useState } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import { Button, ListGroup } from "react-bootstrap";
import { deleteBanner, fetchBanners } from "../http/deviceAPI";
import CreateBanner from "./modals/CreateBanner";
import Image from "react-bootstrap/Image"

const BannersBar = observer(() => {
    const {banner} = useContext(Context)

    const handleDeleteBanner = async (typeId) => {
        try {
            await deleteBanner(typeId);
            // обновление ,баннеров на странице
            banner.setBanners(await fetchBanners());

        } catch (error) {
            console.error("Ошибка при удалении баннера:", error);
        }
        
    }

    const [bannerVisable, setBannerVisable] = useState(false)

    return (
        banner.bannersVisable ? (
            <ListGroup>
                <h3>Баннеры</h3>
                <Button 
                    variant="outline-dark" 
                    className="m-2 ms-auto"
                    onClick={() => setBannerVisable(true)}
                    style={{width : 100}}
                >
                    Добавить
                </Button>
                <CreateBanner show={bannerVisable} onHide={() => setBannerVisable(false)}/>
                <div className="d-flex">
                    {banner.banners
                        .map(banner => 
                            <ListGroup.Item
                                style={{cursor:'pointer'}}
                                key={banner.id}
                                className="p-3 m-3 d-flex flex-column justify-content-between "
                            >
                                <Image
                                    width={150}
                                    height={150}
                                    src={process.env.REACT_APP_API_URL + banner.url}
                                />
                                <Button
                                    variant="danger"
                                    className="mt-2"
                                    onClick={() => handleDeleteBanner(banner.id)}
                                >
                                    Удалить
                                </Button>
                            </ListGroup.Item>
                    )}
                </div>
            </ListGroup>
        ) : null
    );
})

export default BannersBar;