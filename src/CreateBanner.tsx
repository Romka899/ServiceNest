import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import "./CreateBanner.css"

interface BannerResponse {
    rulesUrl?: string;
    [key: string]: any;
}

const CreateBanner: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [width, setWidth] = useState<number>(600);
    const [height, setHeight] = useState<number>(400);
    const [image, setImage] = useState<File | null>(null);
    const [bannerUrl, setBannerUrl] = useState<string | null>(null); 
    const [rulesUrl, setRulesUrl] = useState<string | null>(null);
    const [textX, setTextX] = useState<number>(width/2); 
    const [textY, setTextY] = useState<number>(height/2); 
    const navigate = useNavigate();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!image) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        const formData = new FormData();
        formData.append('text', text);
        formData.append('width', width.toString());
        formData.append('height', height.toString());
        formData.append('image', image);
        formData.append('textX', textX.toString()); 
        formData.append('textY', textY.toString()); 

        try {
            const response = await axios.post('http://localhost:3000/api/create-banner', formData, {
                responseType: 'blob',
            });
            const bannerUrl = URL.createObjectURL(response.data);
            setBannerUrl(bannerUrl);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Ошибка при создании баннера:', axiosError);
            alert('Ошибка при создании баннера');
        }
    };

    const handleLoginRedirect = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        navigate('/'); 
    };

    const handleSaveBanner = async () => {
        if (!image) {
            alert('Пожалуйста, создайте баннер перед сохранением');
            return;
        }

        const formData = new FormData();
        formData.append('text', text);
        formData.append('width', width.toString());
        formData.append('height', height.toString());
        formData.append('image', image);
        formData.append('textX', textX.toString());
        formData.append('textY', textY.toString());

        try {
            const response = await axios.post<BannerResponse>('http://localhost:3000/api/save-banner', formData);
            alert('Баннер успешно сохранен!');
            if (response.data.rulesUrl) {
                setRulesUrl(response.data.rulesUrl);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Ошибка при сохранении баннера:', axiosError);
            alert('Ошибка при сохранении баннера');
        }
    };

    const handleNumberChange = (
        e: ChangeEvent<HTMLInputElement>, 
        setter: React.Dispatch<React.SetStateAction<number>>
    ) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setter(value);
        }
    };

    return (
        <div className="banner">
            <h1>Создание рекламного баннера</h1>
            <form onSubmit={handleSubmit}>
                <div className='inp3'>
                    <label className='lab'>Текст:</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={1}
                        placeholder="Введите текст..."
                    />
                </div>
                <div className='inp3'>
                    <label>Координата X текста:</label>
                    <input 
                        type="number" 
                        value={textX} 
                        onChange={(e) => handleNumberChange(e, setTextX)} 
                    />
                </div>
                <div className='inp3'>
                    <label>Координата Y текста:</label>
                    <input 
                        type="number" 
                        value={textY} 
                        onChange={(e) => handleNumberChange(e, setTextY)} 
                    />
                </div>
                <div className='inp3'>
                    <label className='lab'>Ширина:</label>
                    <input 
                        type="number" 
                        value={width} 
                        onChange={(e) => handleNumberChange(e, setWidth)} 
                    />
                </div>
                <div className='inp3'>
                    <label className='lab'>Высота:</label>
                    <input 
                        type="number" 
                        value={height} 
                        onChange={(e) => handleNumberChange(e, setHeight)} 
                    />
                </div>
                <div>
                    <label>Изображение:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        required
                    />
                </div>
                <button type="submit">Создать баннер</button>
            </form>
            
            {bannerUrl && (
                <div className='createbanner'>
                    <h2>Ваш баннер:</h2>
                    <img src={bannerUrl} alt="Рекламный баннер" />
                    <button 
                        onClick={handleSaveBanner} 
                        style={{ marginTop: '10px' }}
                    >
                        Загрузить баннер
                    </button>
                </div>
            )}
            
            {rulesUrl && (
                <div className='createbanner'>
                    <h2>Ссылка на JSON-файл:</h2>
                    <p>
                        <a href={rulesUrl} target="_blank" rel="noopener noreferrer">
                            {rulesUrl}
                        </a>
                    </p>
                </div>
            )}
            
            <button 
                onClick={handleLoginRedirect} 
                style={{ marginTop: '20px' }}
            >
                Выйти
            </button>
        </div>
    );
}

export default CreateBanner;