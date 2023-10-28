import React, { useState, useEffect } from 'react';

const ImageController = ({ device }) => {
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    // Установите начальное изображение после загрузки данных
    useEffect(() => {
        if (device.device_images && device.device_images.length > 0) {
            handleImageClick(process.env.REACT_APP_API_URL + device.device_images[0].url);
        }
    }, [device]);

    return (
        <div>
            <div className="main-image">
                {selectedImage && (
                    <img
                        style={{ width: '100%' }}
                        src={selectedImage}
                        alt={selectedImage && device.device_images.find(image => image.url === selectedImage)?.name}
                    />
                )}
            </div>
            <div className="thumbnail-device">
                {device.device_images && device.device_images.map((image, index) => (
                    <img
                        style={{ width: 150 }}
                        key={index}
                        src={process.env.REACT_APP_API_URL + image.url}
                        alt={image.name}
                        onClick={() => handleImageClick(process.env.REACT_APP_API_URL + image.url)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageController;
