import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import "./Register.css"
import logo from "./img/logocomp.png"

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/register', 
                { username, password },
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }
            );

            console.log('Registration response:', response.data);

            if (response.data.status === 'success') {
                localStorage.setItem('username', username);
                localStorage.setItem('isAuthenticated', 'true');
                console.log('Redirecting to /ad-objects'); 
                navigate('/ad-objects');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Ошибка регистрации');
            } else {
                setError('Неизвестная ошибка');
            }
        }
    };

    const handleLoginRedirect = () => {
        navigate('/autorisation');
    };

    const Header = () => {
        return (
            <div className="logo">
                <img src={logo} alt="Логотип"/>
            </div>
        );
    };

    return (
        <div className="reg">
            <div className='block-left-content'>
                <div className='block-left'>
                    <Header/>
                    <h1 className='zagolovok'>Сервис загрузки рекламных объектов</h1>
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
                        <div className='EmptyHeight'></div>
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
                        {error && <div className='Error' style={{color: 'red' }}>{error}</div>}
                        <div className='copyright'>
                            Копирайт © 2025 ООО «Компас Плюс»
                        </div>
                    </form>
                </div>
            </div>
            <div className='block-right'></div>
        </div>
    );
}

export default Register;