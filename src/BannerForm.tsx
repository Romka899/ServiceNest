import React, { useEffect, useState, ChangeEvent } from 'react';
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

registerLocale('ru', ru);

interface BannerFormProps {
    mode: 'create' | 'edit';

}

const BannerForm: React.FC<BannerFormProps> = ({mode}) => {
    const navigate = useNavigate();
    const location = useLocation();
    

    const {company} = location.state || {};
    const {bannerData} = location.state || {};

    const [isActive, setIsActive] = useState(false);
    const [bannerName, setBannerName] = useState(bannerData?.bannerName || '');

    const [selectedCompany] = useState(company?.companyName ?? '');
    const [selectedCompanyId] = useState(company?.id ? company.id.toString() : '');
    const [placement, setPlacement] = useState(bannerData?.placement || '');
    const [app, setApp] = useState(bannerData?.app || '');
    const [hideable, setHideable] = useState(bannerData?.hedeable || false);
    
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(bannerData?.imageNames || []);
    const [link, setLink] = useState(bannerData?.link || '');
 
    //const [period, setPeriod] = useState(bannerData?.period || '');


    const parseDate = (dateString: string | undefined): Date | null => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    const [startDate, setStartDate] = useState<Date | null>(() => {
        if (bannerData?.startDate) return parseDate(bannerData.startDate);
        return new Date();
    });
    const [endDate, setEndDate] = useState<Date | null>(() => {
        if (bannerData?.endDate) return parseDate(bannerData.endDate);

        return null;
    });


    const [impressions, setImpressions] = useState(bannerData?.impressions || '');
    const [userImpressions, setUserImpressions] = useState(bannerData?.userImpressions || '');
    const [showTime, setShowTime] = useState(bannerData?.showTime || '');
    const [startTime, setStartTime] = useState(bannerData?.startTime || '00:00');
    const [endTime, setEndTime] = useState(bannerData?.endTime || '00:00');
    
    const [startDateTime, setStartDateTime] = useState<Date | null>(() => {
      if (bannerData?.startDate) {
        const date = parseDate(bannerData.startDate);
        if (date && bannerData.startTime) {
          const [hours, minutes] = bannerData.startTime.split(':').map(Number);
          date.setHours(hours, minutes);
        }
        return date;
      }
      return null;
    });
    
    const [endDateTime, setEndDateTime] = useState<Date | null>(() => {
      if (bannerData?.endDate) {
        const date = parseDate(bannerData.endDate);
        if (date && bannerData.endTime) {
          const [hours, minutes] = bannerData.endTime.split(':').map(Number);
          date.setHours(hours, minutes);
        }
        return date;
      }
      return null;
    });
    
    const [geoTargeting, setGeoTargeting] = useState(bannerData?.geoTargeting || '');

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && images.length < 5) {
            const newImages = Array.from(e.target.files).slice(0, 5 - images.length);
            setImages([...images, ...newImages]);
        }
    };


    useEffect(() => {
      const now = new Date();
      if (startDate && endDate) {
        const isCurrentlyActive = now >= startDate && now <= endDate;
        setIsActive(isCurrentlyActive);
      }
    }, [startDateTime, endDateTime]);


    

    const formatDateForServer = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString();
    };


    const handleStartDateTimeChange = (date: Date | null) => {
      if (!date) return;
      setStartDateTime(date);
      setStartTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
      
      if (endDateTime && date > endDateTime) {
        setEndDateTime(date);
        setEndTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
      }
    };
    

    const handleEndDateTimeChange = (date: Date | null) => {
      if (!date) return;
      if (startDateTime && date < startDateTime) {
        alert('Дата окончания не может быть раньше даты начала');
        return;
      }
      setEndDateTime(date);
      setEndTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
    };

    const formatDateTime = (date: Date | null, time: string = ''): string => {
      if (!date) return '';
      
    
      let dateWithTime = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        dateWithTime.setHours(hours, minutes);
      }
      
      return dateWithTime.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };
    

    const formatDateTimeDisplay = (date: Date | null): string => {
      if (!date) return 'Выберите дату и время';
      return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    const handleSaveStartTime = () => {
      if (startDateTime) {
        setStartTime(`${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}`);
      }
    };
    
    const handleSaveEndTime = () => {
      if (endDateTime) {
        setEndTime(`${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`);
      }
    };
    

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

/*
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
    //window.location.reload();
  }
};
*/
    const handleBack = () => {
        navigate('/ad-objects');
    }



    const handleSubmit = async () => {
        try {
          const formData = new FormData();

          if (!startDateTime || !endDateTime) {
            alert('Пожалуйста, выберите даты начала и окончания');
            return;
        }
    
    
        const period = startDateTime && endDateTime 
          ? `${formatDateTimeDisplay(startDateTime)} — ${formatDateTimeDisplay(endDateTime)}`
          : '';

          const formFields = {
            bannerName,
            companyId: selectedCompanyId,
            companyName: selectedCompany,
            placement,
            app,
            hideable: String(hideable),
            link,
            impressions,
            userImpressions,
            startTime: startDateTime 
            ? `${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}`
            : '00:00',
            endTime: endDateTime 
            ? `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`
            : '00:00',
            geoTargeting,
            username: localStorage.getItem('username') || 'unknown',
            startDate:formatDateForServer(startDateTime),
            endDate:formatDateForServer(endDateTime),
            period: period,
            isActive: String(isActive)
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
          if (axios.isAxiosError(error)) {
            console.error('Детали ошибки:', {
              status: error.response?.status,
              data: error.response?.data,
              config: error.config
            });
          }
        }
/*
        if(!startDate || !endDate){
            alert('Выберите даты начала поблукации и ее окончания');
            return;
        }
        const period = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        const formDate = {
            period,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        };*/
      };
/*
        const getFormattedDate = (daysToAdd: number): string => {
            const today = new Date();
            const endDate = new Date();
            endDate.setDate(today.getDate() + daysToAdd);
            
            return `${formatDate(today)} - ${formatDate(endDate)}`;
          };
          
          const getDateRangeString = (daysToAdd: number): string => {
            const today = new Date();
            const endDate = new Date();
            endDate.setDate(today.getDate() + daysToAdd);
            
            return `${formatDate(today, true)} — ${formatDate(endDate, true)}`;
          };
          
          const formatDate = (date: Date, short = false): string => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            if (short) {
              return `${day}.${month}.${year}`;
            }
            
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${day}.${month}.${year} ${hours}:${minutes}`;
          };*/

          const removeExistingImage = (index: number) => {
            const updatedImages = [...existingImages];
            updatedImages.splice(index, 1);
            setExistingImages(updatedImages);
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
            }),
            singleValue: (base: any) => ({
              ...base,
              color: '#495057'
            }),
            placeholder: (base: any) => ({
              ...base,
              color: '#6c757d'
            }),
            dropdownIndicator: (base: any) => ({
              ...base,
              padding: '4px'
            }),
            clearIndicator: (base: any) => ({
              ...base,
              padding: '4px'
            }),
            valueContainer: (base: any) => ({
              ...base,
              padding: '0 6px'
            }),
            input: (base: any) => ({
              ...base,
              margin: 0,
              padding: 0
            })
          };

          const CustomHeader = ({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
            onChange,
            onSave
          } : {
            date: Date,
            changeYear: (year: number) => void,
            changeMonth: ( month: number) => void,
            decreaseMonth: () => void,
            increaseMonth: () => void,
            prevMonthButtonDisabled: Boolean,
            nextMonthButtonDisabled: Boolean,
            onChange: (date: Date) => void,
            onSave: () => void
          }) =>{
            const months = [
              "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
              "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
            ];
          
            const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
            const hours = Array.from({ length: 24 }, (_, i) => i);
            const minutes = Array.from({ length: 12 }, (_, i) => i * 5); 

            const [currentHours, setCurrentHours] = useState(date.getHours());
            const [currentMinutes, setCurrentMinutes] = useState(date.getMinutes());          
          
            useEffect(() =>{
              setCurrentHours(date.getHours());
              setCurrentMinutes(date.getMinutes());
            }, [date]);
  
            const handleTimeChange = (newHours: number, newMinutes: number) => {
              const newDate = new Date(date);
              newDate.setHours(newHours, newMinutes);
              onChange(newDate);

              setCurrentHours(newHours);
              setCurrentMinutes(newMinutes);
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
          
                <div className="custom-calendar-footer">
                  <button className="save-time-btn" onClick={onSave}>
                    Сохранить
                  </button>
                </div>

                <div className="time-controls">
                  <select
                    value={currentHours}
                    onChange={({ target: { value } }) => 
                      handleTimeChange(Number(value), currentMinutes)
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
                    value={currentMinutes}
                    onChange={({ target: { value } }) => 
                      handleTimeChange(currentHours, Number(value))
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
                        <DatePicker
                          selected={startDateTime}
                          onChange={handleStartDateTimeChange}
                          selectsStart
                          startDate={startDateTime}
                          endDate={endDateTime}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd.MM.yyyy HH:mm"
                          locale="ru"
                          minTime={new Date(0, 0, 0, 0, 0, 0)}
                          maxTime={new Date(0, 0, 0, 23, 59, 0)}
                          dayClassName={(date) =>{
                              const day = date.getDay();
                              return day === 0 || day === 6 ? 'react-datepicker__day--weekend' : '';
                          }}
                          customInput={
                            <button className="datepicker-input-button">
                              {formatDateTimeDisplay(startDateTime)}
                            </button>
                          }
                          renderCustomHeader={(props) => (
                            <CustomHeader 
                              {...props} 
                              onChange={handleStartDateTimeChange}
                              onSave={() => {}}
                            />

                          )}
                          calendarClassName="custom-calendar-popup"
                        />

                          <span className="date-range-separator"> — </span>
                          <DatePicker
                            selected={endDateTime}
                            onChange={handleEndDateTimeChange}
                            selectsEnd
                            endDate={endDateTime}
                            startDate={startDateTime}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd.MM.yyyy HH:mm"
                            locale="ru"
                            minTime={new Date(0, 0, 0, 0, 0, 0)}
                            maxTime={new Date(0, 0, 0, 23, 59, 0)}
                            dayClassName={(date) =>{
                              const day = date.getDay();
                              return day === 0 || day === 6 ? 'react-datepicker__day--weekend' : '';
                          }}
                            customInput={
                              <button className="datepicker-input-button">
                                {formatDateTimeDisplay(endDateTime)}
                              </button>
                            }
                            renderCustomHeader={(props) => (
                              <CustomHeader 
                                {...props} 
                                onChange={handleEndDateTimeChange}
                                onSave={() => {}}
                              />
                            )}
                            calendarClassName="custom-calendar-popup"
                          />
                        </div>
                        {startDate && endDate && (
                          <div className="period-info">
                            <div className="period-display">
                              Период: {formatDateTime(startDateTime, startTime)} — {formatDateTime(endDateTime, endTime)}
                            </div>
                          </div>
                        )}

                        </div>
                        <div className="form-group">
                            <label>Количество показов:</label>
                            <Select
                              options={[
                                { value: '', label: 'Выберите количество показов в день' },
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
                                { value: '', label: 'Выберите количество показов на одного пользователя' },
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
                                { value: '', label: 'Выберите время показа рекламы' },
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
                                { value: '', label: 'Выберите регион' },
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