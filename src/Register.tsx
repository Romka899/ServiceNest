import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import "./Register.css"

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/register', {
                username,
                password,
            });
            alert(response.data);
            navigate('/create-banner');
        } catch (error) {
            setError('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
            console.error('Ошибка регистрации:', error);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/autorisation');
    };

    return (
        <div className="reg">
            <div className='reg-left'>
            <h1 className='zagolovok'>Сервис загрузки рекламных объектов</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div className='Login'>
                    <label className='log'>Введите номер телефона</label>
                    <input 
                        className='inp1' 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div className='Password'>
                    <label className='pass'>Пароль</label>
                    <input 
                        className='inp2' 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                <div className='Zareg'>
                    <button className='btnzar' type="submit">
                        Зарегистрироваться
                    </button>
                    <button className='btnauth'
                        type="button" 
                        onClick={handleLoginRedirect} 
                    >
                        Авторизация
                    </button>
                </div>
                <div className='copyright'>
                    Копирайт © 2025 ООО «Компас Плюс»
                </div>
            </form>
            </div>
            <div className='reg-right'>
                
            </div>
        </div>
    );
}

export default Register;