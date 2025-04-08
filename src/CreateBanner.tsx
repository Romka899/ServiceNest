import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateBanner.css";

const CreateBanner: React.FC = () => {
    const navigate = useNavigate();
    
    const [placement, setPlacement] = useState<string>('');
    const [app, setApp] = useState<string>('');
    const [hideable, setHideable] = useState<boolean>(false);
    
    const [images, setImages] = useState<File[]>([]);
    const [link, setLink] = useState<string>('');
 
    const [period, setPeriod] = useState<string>('');
    const [impressions, setImpressions] = useState<string>('');
    const [userImpressions, setUserImpressions] = useState<string>('');
    const [showTime, setShowTime] = useState<string>('');
    const [geoTargeting, setGeoTargeting] = useState<string>('');

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && images.length < 5) {
            const newImages = Array.from(e.target.files).slice(0, 5 - images.length);
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleLoginRedirect = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        navigate('/'); 
    };

    const Header = () => {
        return (
            <header className="app-header">
                <div className="header-content">
                    <h1 >Рекламная платформа</h1>
                    <div className="user-info">
                        <span>{localStorage.getItem('username') || 'Пользователь'}</span>
                    </div>
                </div>
            </header>
        );
    };

    return (
        <div className="app-container">
            <Header />
            
            <div className="content-container">
                <h1 className="page-title">Добавление рекламных объектов</h1>
                <div className="settings-block">
                    <h2>Детали размещения</h2>
                    
                    <div className="form-group">
                        <label>Место показа:</label>
                        <select 
                            value={placement} 
                            onChange={(e) => setPlacement(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Выберите место</option>
                            <option value="top">Верх страницы</option>
                            <option value="middle">Середина страницы</option>
                            <option value="bottom">Низ страницы</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Приложение для показа:</label>
                        <select 
                            value={app} 
                            onChange={(e) => setApp(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Выберите приложение</option>
                            <option value="app1">Приложение 1</option>
                            <option value="app2">Приложение 2</option>
                        </select>
                    </div>
                    
                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="hideable"
                            checked={hideable}
                            onChange={(e) => setHideable(e.target.checked)}
                        />
                        <label htmlFor="hideable">Скрывать баннер</label>
                    </div>
                </div>
                <div className="settings-block">
                    <h2>Загрузка изображений</h2>
                    
                    <div className="image-upload-container">
                        {images.length < 5 && (
                            <label className="upload-btn">
                                Добавить изображение
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    multiple
                                />
                            </label>
                        )}
                        
                        <div className="image-preview-container">
                            {images.map((image, index) => (
                                <div key={index} className="image-preview">
                                    <img 
                                        src={URL.createObjectURL(image)} 
                                        alt={`Превью ${index + 1}`} 
                                    />
                                    <button 
                                        onClick={() => removeImage(index)}
                                        className="remove-image-btn"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Ссылка:</label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Введите ссылку"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="settings-block">
                    <h2>Дополнительные настройки</h2>
                    
                    <div className="form-group">
                        <label>Период публикации:</label>
                        <select 
                            value={period} 
                            onChange={(e) => setPeriod(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Выберите период</option>
                            <option value="1week">1 неделя</option>
                            <option value="2weeks">2 недели</option>
                            <option value="1month">1 месяц</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Количество показов:</label>
                        <select 
                            value={impressions} 
                            onChange={(e) => setImpressions(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Выберите количество</option>
                            <option value="1000">1,000</option>
                            <option value="5000">5,000</option>
                            <option value="10000">10,000</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Количество показов пользователю:</label>
                        <select 
                            value={userImpressions} 
                            onChange={(e) => setUserImpressions(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Выберите количество</option>
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Время показа:</label>
                        <select 
                            value={showTime} 
                            onChange={(e) => setShowTime(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Выберите время</option>
                            <option value="day">Только днем</option>
                            <option value="night">Только ночью</option>
                            <option value="all">Круглосуточно</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Геотаргетинг:</label>
                        <select 
                            value={geoTargeting} 
                            onChange={(e) => setGeoTargeting(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Выберите регион</option>
                            <option value="all">Все регионы</option>
                            <option value="europe">Европа</option>
                            <option value="asia">Азия</option>
                            <option value="america">Америка</option>
                        </select>
                    </div>
                </div>
                
                <div className="action-buttons">
                    <button className="submit-btn">Сохранить</button>
                    <button 
                        onClick={handleLoginRedirect} 
                        className="logout-btn"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateBanner;