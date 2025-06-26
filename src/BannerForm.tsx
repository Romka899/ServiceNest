import React, {useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import "./BannerForm.css";
import logo from "./img/logocomp.png"
import axios from 'axios';
import addpic from "./img/icon-park-solid_add-pic.png";
import Ex from "./img/ExitIcon.png";
import {ru} from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import Select from 'react-select';
import moment from 'moment-timezone';


registerLocale('ru', ru);

interface BannerFormProps {
    mode: 'create' | 'edit';
}

const BannerForm: React.FC<BannerFormProps> = ({mode}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {company} = location.state || {};
    const {bannerData} = location.state || {};

    const [bannerName, setBannerName] = useState(bannerData?.bannerName || '');
    const [selectedCompanyId] = useState(company?.id ? company.id.toString() : '');
    const [placement, setPlacement] = useState(bannerData?.placement || '');
    const [app, setApp] = useState(bannerData?.app || '');
    const [hideable, setHideable] = useState(bannerData?.hedeable || false);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(bannerData?.imageNames || []);
    const [link, setLink] = useState(bannerData?.link || '');
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(new Date());
    const [impressions, setImpressions] = useState(bannerData?.impressions || '');
    const [userImpressions, setUserImpressions] = useState(bannerData?.userImpressions || '');
    const [showTime, setShowTime] = useState(bannerData?.showTime || '');
    const [geoTargeting, setGeoTargeting] = useState(bannerData?.geoTargeting || '');
    
    const [startDate, setStartDate] = useState<Date | null>(
      bannerData?.startDate ? new Date(bannerData.startDate) : new Date()
    );
    const [endDate, setEndDate] = useState<Date | null>(
      bannerData?.endDate ? new Date(bannerData.endDate) : null
    );

    
    const [endDateTime, setEndDateTime] = useState<Date | null>(() => {
      if (bannerData?.endDate) {
        const date = new Date(bannerData.endDate);
        if (bannerData.endTime) {
          const [hours, minutes] = bannerData.endTime.split(':').map(Number);
          date.setHours(hours, minutes);
        }
        return date;
      }
      return null;
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && images.length < 5) {
            const newImages = Array.from(e.target.files).slice(0, 5 - images.length);
            setImages([...images, ...newImages]);
        }
    };

    const handleStartDateChange = (date: Date | null) => {
      setStartDate(date);
      if (date && endDate && date > endDate) {
        setEndDate(date);
      }
    };

    const handleEndDateChange = (date: Date | null) => {
      if (date && startDate && date < startDate) {
        alert('Дата окончания не может быть раньше даты начала');
        return;
      }
      setEndDate(date);
    };


    /*
    const formatDateDisplay = (date: Date | null): string => {
      if (!date) return 'Выберите дату';
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };
*/
    /*
    const formatTimeDisplay = (date: Date | null): string => {
      if (!date) return '00:00';
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/^24:/, '00:');
    };

    */

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const removeExistingImage = (index: number) => {
        const updatedImages = [...existingImages];
        updatedImages.splice(index, 1);
        setExistingImages(updatedImages);
    };

    const handleBack = () => {
        navigate('/ad-objects');
    }

    const handleSubmit = async () => {
        try {
          const formData = new FormData();

          if (!startDate || !endDate) {
            alert('Пожалуйста, выберите даты начала и окончания');
            return;
          }
    
          const timezone = 'Asia/Yekaterinburg'


          const startDateMoment = moment(startDate).tz(timezone);
          const endDateMoment = moment(endDate).tz(timezone);

          const period = startDate && endDate 
            ? `${startDateMoment.format('DD MMMM YYYY HH:mm')} — ${endDateMoment.format('DD MMMM YYYY HH:mm')}`
            : '';


          const formFields = {
            bannerName,
            companyId: selectedCompanyId,
            companyName: company?.companyName ?? '',
            placement,
            app,
            hideable: String(hideable),
            link,
            impressions,
            userImpressions,
            startTime: startDateMoment.format('HH:mm'),
            endTime: endDateMoment.format('HH:mm'),
            geoTargeting,
            username: localStorage.getItem('username') || 'unknown',
            startDate: startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm:ss') : null,
            endDate: endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm:ss') : null,
            period: period,
            timezone: timezone,
            isActive: startDate && endDate
              ? moment()
              .tz(timezone) 
              .isBetween(
                moment(startDate).tz(timezone), 
                moment(endDate).tz(timezone)    
              ) 
          : false
          };

          Object.entries(formFields).forEach(([key, value]) => {
            formData.append(key, value);
          });
      
          images.forEach(image => {
            formData.append('images', image);
          });
      
          const isEditMode = mode === 'edit' && bannerData?.id;
          const url = isEditMode 
            ? `http://localhost:3000/api/banners/${bannerData.id}`
            : 'http://localhost:3000/api/save-banner';
          
          const method = isEditMode ? 'put' : 'post';
      
          const response = await axios[method](url, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          if (response.data.status === 'success') {
            navigate(`/ad-objects/${company?.id}`, { state: { company } });
          }
        } catch (error) {
          console.error('Ошибка сохранения:', error);
        }
      };

    const selectStyles = {
        control: (base: any) => ({
          ...base,
          padding: '0.3rem 0.5rem',
          borderColor: '#ced4da',
          '&:hover': {
            borderColor: '#ced4da'
          },
          minHeight: 'auto'
        }),
        menu: (base: any) => ({
          ...base,
          marginTop: 0,
          borderRadius: '0 0 4px 4px',
          border: '1px solid #ced4da',
          borderTop: 'none',
          boxShadow: 'none'
        }),
        option: (base: any, { isSelected }: { isSelected: boolean }) => ({
          ...base,
          backgroundColor: isSelected ? '#084F85' : 'white',
          color: isSelected ? 'white' : '#333',
          '&:hover': {
            backgroundColor: isSelected ? '#084F85' : '#f8f9fa'
          }
        })
    };
/*
    const CustomHeader = ({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        onChange
    } : {
        date: Date,
        changeYear: (year: number) => void,
        changeMonth: ( month: number) => void,
        decreaseMonth: () => void,
        increaseMonth: () => void,
        onChange: (date: Date) => void
    }) => {
        const months = [
          "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
          "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
      
        const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const minutes = Array.from({ length: 12 }, (_, i) => i * 5); 

        //const [currentHours, setCurrentHours] = useState(date.getHours());
        //const [currentMinutes, setCurrentMinutes] = useState(date.getMinutes());          
        const [currentDate, setCurrentDate] = useState(new Date(date));

        useEffect(() =>{
          setCurrentDate(new Date(date));
        }, [date]);

        const handleTimeChange = (hours: number, minutes: number) => {
          const newDate = new Date(currentDate);
          newDate.setHours(hours, minutes);
          onChange(newDate);
          setCurrentDate(newDate);
        };
      
        return (
          <div className="custom-header">
            <div className="date-controls">
              <select
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
                className="month-select"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
      
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(Number(value))}
                className="year-select"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="time-controls">
              <select
                value={currentDate.getHours()}
                onChange={({ target: { value } }) => 
                  handleTimeChange(Number(value), currentDate.getMinutes())
                }
                className="hour-select"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
      
              <span>:</span>
      
              <select
                value={currentDate.getMinutes()}
                onChange={({ target: { value } }) => 
                  handleTimeChange(currentDate.getHours(), Number(value))
                }
                className="minute-select"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
    };
*/
    const Header = () => {
        const handleLogout = async () => {
          try {
            await axios.post('http://localhost:3000/api/logout', {}, {
              withCredentials: true
            });
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            navigate('/autorisation');
            window.location.reload();
          } catch (error) {
            console.error('Ошибка при выходе:', error);
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            navigate('/autorisation');
          }
        };

        return (
          <header className="app-header">
            <div className="header-content">
                <div className='head-logo'>
                    <img src={logo} alt=""/>
                </div>
                <div className='compblock'>
                    <img className='logocomp' src={company.companyLogo} alt={company.companyName}/>
                    <h1 className='namecomp'>{company?.companyName ?? ''}</h1>
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
                    <h1 className="page-title">{mode === 'create' ? 'Добавление ' : 'Редактирование '}рекламных объектов</h1>
                    <div className="settings-block">
                    <h2>Название рекламного объекта</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                value={bannerName}
                                onChange={(e) => setBannerName(e.target.value)}
                                placeholder="Введите название"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="settings-block">
                        <h2>Детали размещения</h2>
                        <div className="form-group">
                            <label className='Naming'>Место показа:</label>
                            <Select
                              options={[
                                { value: 'top', label: 'Верх страницы' },
                                { value: 'middle', label: 'Середина страницы' },
                                { value: 'bottom', label: 'Низ страницы' }
                              ]}
                              value={{ 
                                value: placement, 
                                label: placement === 'top' ? 'Верх страницы' : 
                                placement === 'middle' ? 'Середина страницы' : 
                                placement === 'bottom' ? 'Низ страницы' : 
                                'Выберите место' 
                              }}
                              onChange={(option) => setPlacement(option?.value || '')}
                              styles={selectStyles}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className='Naming'>Приложение для показа: </label>
                            <Select
                              options={[
                                { value: 'app1', label: 'Приложение 1' },
                                { value: 'app2', label: 'Приложение 2' }
                              ]}
                              value = {{
                                value: app,
                                label:
                                  app === 'app1' ? 'Приложение 1' : 
                                  app === 'app2' ? 'Приложение 2' : 
                                  'Выберите приложение'
                              }}
                              onChange={(option) => setApp(option?.value || '')}
                              styles={selectStyles}
                            />  
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
                            {images.length + existingImages.length < 5 && (
                            <label className="upload-btn">
                                <img src={addpic} alt='' />
                                <span className='Dob'>Добавить изображение</span>
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
                            {existingImages.map((imageName, index) => (
                                <div key={`existing-${index}`} className="image-preview">
                                <img 
                                    src={`http://localhost:3000/images/${imageName}`} 
                                    alt={`Превью ${index + 1}`} 
                                />
                                <button 
                                    onClick={() => removeExistingImage(index)}
                                    className="remove-image-btn"
                                >
                                    ×
                                </button>
                                </div>
                            ))}
                            
                            {images.map((image, index) => (
                                <div key={`new-${index}`} className="image-preview">
                                <img 
                                    src={URL.createObjectURL(image)} 
                                    alt={`Новое превью ${index + 1}`} 
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
                            <div className="form-group">
                            <label className='link'>Ссылка:</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Введите ссылку"
                                className="form-control"
                            />
                        </div>
                        </div>
                    </div>
                    
                    <div className="settings-block">
                      <h2>Дополнительные настройки</h2>
                      <div className='form-group'>
                        <label>Период публикации: </label>
                        <div className='custom-datepicker-container'>
                          <div className="date-time-picker">
                            <DatePicker
                              selected={startDate}
                              onChange={handleStartDateChange}
                              selectsStart
                              startDate={startDate}
                              endDate={endDate}
                              dateFormat="dd.MM.yyyy HH:mm"
                              locale="ru"
                              className="form-control"
                              calendarClassName="custom-calendar-popup"
                              popperClassName="custom-popper"
                              renderCustomHeader={({
                                date,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                              }) => (
                                <div className="custom-header">
                                  <div className="header-navigation">
                                    <button
                                      onClick={decreaseMonth}
                                      disabled={prevMonthButtonDisabled}
                                      className="nav-button"
                                    >
                                      &lt;
                                    </button>
                                    <span className="month-year">
                                      {date.toLocaleString('ru', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button
                                      onClick={increaseMonth}
                                      disabled={nextMonthButtonDisabled}
                                      className="nav-button"
                                    >
                                      &gt;
                                    </button>
                                  </div>
                                  
                                  <div className="time-input-group">
                                    <div className="time-input-hour">
                                      <label>Часы:</label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={startDate?.getHours() || 0}
                                        onChange={(e) => {
                                          const hours = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
                                          const newDate = new Date(startDate || new Date());
                                          newDate.setHours(hours);
                                          setStartDate(newDate);
                                        }}
                                      />
                                    </div>
                                    <div className="time-input-minutes">
                                      <label>Минуты:</label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="55"
                                        step="5"
                                        value={startDate?.getMinutes() || 0}
                                        onChange={(e) => {
                                          const minutes = Math.min(55, Math.max(0, parseInt(e.target.value) || 0));
                                          const newDate = new Date(startDate || new Date());
                                          newDate.setMinutes(minutes);
                                          setStartDate(newDate);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                          </div>

                          <span className='date-range-separator'>—</span>

                          <div className="date-time-picker">
                            <DatePicker
                              selected={endDate}
                              onChange={handleEndDateChange}
                              selectsEnd
                              startDate={startDate}
                              endDate={endDate}
                              dateFormat="dd.MM.yyyy HH:mm"
                              locale="ru"
                              className="form-control"
                              calendarClassName="custom-calendar-popup"
                              popperClassName="custom-popper"
                              renderCustomHeader={({
                                date,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                              }) => (
                                <div className="custom-header">
                                  <div className="header-navigation">
                                    <button
                                      onClick={decreaseMonth}
                                      disabled={prevMonthButtonDisabled}
                                      className="nav-button"
                                    >
                                      &lt;
                                    </button>
                                    <span className="month-year">
                                      {date.toLocaleString('ru', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button
                                      onClick={increaseMonth}
                                      disabled={nextMonthButtonDisabled}
                                      className="nav-button"
                                    >
                                      &gt;
                                    </button>
                                  </div>
                                  
                                  <div className="time-input-group">
                                    <div className="time-input-hour">
                                      <label>Часы:</label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={endDate?.getHours() || 0}
                                        onChange={(e) => {
                                          const hours = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
                                          const newDate = new Date(endDate || new Date());
                                          newDate.setHours(hours);
                                          setEndDate(newDate);
                                        }}
                                      />
                                    </div>
                                    <div className="time-input-minutes">
                                      <label>Минуты:</label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="55"
                                        step="5"
                                        value={endDate?.getMinutes() || 0}
                                        onChange={(e) => {
                                          const minutes = Math.min(55, Math.max(0, parseInt(e.target.value) || 0));
                                          const newDate = new Date(endDate || new Date());
                                          newDate.setMinutes(minutes);
                                          setEndDate(newDate);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        {/*
                        {startDate && endDate && (
                          <div className="period-info">
                            <div className="period-display">
                              Период: {formatDateDisplay(startDate)} {formatTimeDisplay(startDate)} — {formatDateDisplay(endDate)} {formatTimeDisplay(endDate)}
                            </div>
                          </div>
                        )}
                        */}
                      </div>
                        <div className="form-group">
                            <label>Количество показов:</label>
                            <Select
                              options={[
                                { value: '1000', label: '1000' },
                                { value: '5000', label: '5000' },
                                { value: '10000', label: '10000' }
                              ]}
                              value={{ 
                                value: impressions, 
                                label: impressions === '1000' ? '1000' : 
                                impressions === '5000' ? '5000' : 
                                impressions === '10000' ? '10000' : 
                                'Выберите количество показов в день' 
                              }}
                              onChange={(option) => setImpressions(option?.value || '')}
                              styles={selectStyles}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Количество показов пользователю:</label>
                            <Select
                              options={[
                                { value: '1', label: '1 раз в день' },
                                { value: '3', label: '3 раз в день' },
                                { value: '5', label: '5 раз в день' }
                              ]}
                              value={{ 
                                value: userImpressions, 
                                label: userImpressions === '1' ? '1 раз в день' : 
                                userImpressions === '3' ? '3 раз в день' : 
                                userImpressions === '5' ? '5 раз в день' : 
                                'Выберите количество показов на одного пользователя' 
                              }}
                              onChange={(option) => setUserImpressions(option?.value || '')}
                              styles={selectStyles}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Время показа:</label>
                            <Select
                              options={[
                                { value: '12:00 - 23:59', label: 'Только днем' },
                                { value: '00:00 - 11:59', label: 'Только ночью' },
                                { value: '00:00 - 23:59', label: 'Полные сутки' }
                              ]}
                              value={{ 
                                value: showTime, 
                                label: showTime === '12:00 - 23:59' ? 'Только днем' : 
                                showTime === '00:00 - 11:59' ? 'Только ночью' : 
                                showTime === '00:00 - 23:59' ? 'Полные сутки' : 
                                'Выберите время показа рекламы' 
                              }}
                              onChange={(option) => setShowTime(option?.value || '')}
                              styles={selectStyles}
                              />
                        </div>

                        <div className="form-group">
                            <label>Геотаргетинг:</label>
                            <Select
                              options={[
                                { value: 'all', label: 'Все регионы' },
                                { value: 'europe', label: 'Европа' },
                                { value: 'asia', label: 'Азия' },
                                { value: 'america', label: 'Америка'}
                              ]}
                              value={{ 
                                value: geoTargeting, 
                                label: geoTargeting === 'america' ? 'Америка' : 
                                geoTargeting === 'asia' ? 'Азия' : 
                                geoTargeting === 'europ' ? 'Европа' : 
                                geoTargeting === 'all' ? 'Все регионы' : 
                                'Выберите регион' 
                              }}
                              onChange={(option) => setGeoTargeting(option?.value || '')}
                              styles={selectStyles}
                            />
                        </div>
                    </div>
                    
                    <div className="action-buttons">
                        <button
                            onClick={handleBack}
                            className="back-btn2"
                        >
                            Назад
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

export default BannerForm;

