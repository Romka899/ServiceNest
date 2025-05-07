import React, { useState, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./CreateBanner.css";
import logo from "./img/logocomp.png"
import axios from 'axios';
import addpic from "./img/icon-park-solid_add-pic.png";
import Ex from "./img/ExitIcon.png";





const CreateBanner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {company} = location.state || {};
    const {bannerData} = location.state || {};

    const [selectedCompany] = useState(company?.companyName || '');
    const [selectedCompanyId] = useState(company?.id?.toString() || '');
    const [placement, setPlacement] = useState(bannerData?.placement || '');
    const [app, setApp] = useState(bannerData?.app || '');
    const [hideable, setHideable] = useState(bannerData?.hedeable || false);
    
    const [images, setImages] = useState<File[]>([]);
    //const [existingImages, setExistingImages] = useState<string[]>(bannerData?.imageNames || []);
    const [link, setLink] = useState(bannerData?.link || '');
 
    const [period, setPeriod] = useState(bannerData?.period || '');
    const [impressions, setImpressions] = useState(bannerData?.impressions || '');
    const [userImpressions, setUserImpressions] = useState(bannerData?.userImpressions || '');
    const [showTime, setShowTime] = useState(bannerData?.showTime || '');
    const [geoTargeting, setGeoTargeting] = useState(bannerData?.geoTargeting || '');

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


const handleLogout = async () => {
  try {
    await axios.post('http://localhost:3000/api/logout', {}, {
      withCredentials: true
    });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/autorization');
    window.location.reload();
  } catch (error) {
    console.error('Ошибка при выходе:', error);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/autorization');
    //window.location.reload();
  }
};

    const handleBack = () => {
        navigate('/ad-objects');
    }



    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            
            formData.append('companyId', String(selectedCompanyId) || '');
            formData.append('companyName', selectedCompany || '');
            formData.append('placement', placement);
            formData.append('app', app);
            formData.append('hideable', String(hideable));
            formData.append('link', link);
            formData.append('period', period);
            formData.append('impressions', impressions);
            formData.append('userImpressions', userImpressions);
            formData.append('showTime', showTime);
            formData.append('geoTargeting', geoTargeting);
            formData.append('username', localStorage.getItem('username') || 'unknown');

            

            images.forEach((image) => {
                formData.append('images', image);
            });
    
            const response = await axios.post('http://localhost:3000/api/save-banner', formData, {
                withCredentials: true
            });
    
            if (response.data.status === 'success') {
                alert('Баннер успешно сохранен');
            } 
        } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 401) {
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/autorization';
              } else {
                alert(error.response?.data?.message || 'Ошибка сохранения');
              }
            } else {
              alert('Неизвестная ошибка');
            }
          }
        };



    const Header = () => {
        const handleLogout = async () => {
          try {
            await axios.post('http://localhost:3000/api/logout', {}, {
              withCredentials: true
            });
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            navigate('/autorization');
            window.location.reload();
          } catch (error) {
            console.error('Ошибка при выходе:', error);
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            navigate('/autorization');
            //window.location.reload();
          }
        };
      
        return (
          <header className="app-header">
            <div className="header-content">
                <div className='head-logo'>
                    <img src = {logo} alt=""/>
                </div>
                <div className='compblock'>
                    <img className='logocomp' src = {company.companyLogo} alt = {company.companyName}/>
                    <h1 className='namecomp'>{selectedCompany}</h1>
                </div>
              <div className="user-info">
                <span>{localStorage.getItem('username') || 'Пользователь'}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <img src={Ex} alt="Выход" title="Выйти из системы"/>
                </button>
              </div>
            </div>
        </header>
        );
      };

    return (
        <div className='app-all'>
            <div className="app-container">
                <Header />
                
                <div className="content-container">
                    <h1 className="page-title">Добавление рекламных объектов</h1>
                    <div className="settings-block">
                        <h2>Детали размещения</h2>
                        <div className="form-group">
                            <label className='Naming'>Место показа:</label>
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
                            <label>Приложение для показа:
                            <select 
                                value={app} 
                                onChange={(e) => setApp(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Выберите приложение</option>
                                <option value="app1">Приложение 1</option>
                                <option value="app2">Приложение 2</option>
                            </select>
                            </label>
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
                                    <img src={addpic} alt=''></img>
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
                        <button
                            onClick={handleLogout} 
                            className="logout-btn2"
                        >
                            Выйти
                        </button>
                        <button
                            onClick={handleBack}
                            className="back-btn2"
                        >
                            Назад к рекламным объектам
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            className="submit-btn2"
                        >
                            Сохранить

                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBanner;