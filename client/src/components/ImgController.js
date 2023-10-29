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
        <div className='d-flex'>
            <div className="thumbnail-device d-flex flex-column overflow-y-auto" style={{width : '30%', height : 300}}>
                {device.device_images && device.device_images.map((image, index) => (
                    <img
                        style={{ width: '100%' }}
                        key={index}
                        src={process.env.REACT_APP_API_URL + image.url}
                        alt={image.name}
                        onClick={() => handleImageClick(process.env.REACT_APP_API_URL + image.url)}
                    />
                ))}
            </div>
            <div className="main-image" style={{ width: '70%' }}>
                {selectedImage && (
                    <img
                        style={{ width: '100%' }}
                        src={selectedImage}
                        alt={selectedImage && device.device_images.find(image => image.url === selectedImage)?.name}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageController;
