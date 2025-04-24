import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Autorisation.css"
import logo from "./img/logocomp.png"

const Autorisation: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
        
        if (!e.target.checked) {
            localStorage.removeItem('rememberedUsername');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/autorization', {
                username,
                password,
            });

            if (response.data.message === 'Авторизация успешна') {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', username);
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }
                navigate('/create-banner'); 
            } else {
                setError('Неверный логин или пароль');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Ошибка при авторизации:', axiosError);
            setError('Такого пользователя нет');
        }
    };

    const handleRegistrRedirect = () => {
        navigate('/');
    };

    const Header = () => {
        return (
            <div className="logo">
                <img src = {logo} alt=""/>
            </div>
        );
    };

    return (
        <div className="reg">
            <div className='block-left'>
            <Header/>
            <h1 className='zagolovok2'>Авторизация</h1>
            <form onSubmit={handleLogin}>
                <div className='Login'>
                    <label className='log'>Номер телефона пользователя:</label>
                    <input 
                        className='inp1' 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div className='Password'>
                    <label className='pass'>Пароль:</label>
                    <input
                        className='inp2'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="remember-me">
                            <input 
                                className="checkbox" 
                                type="checkbox" 
                                id="remember" 
                                checked={rememberMe}
                                onChange={handleRememberMeChange} 
                            />
                            <label>Запомнить логин</label>
                        </div>
                <div className='Zareg'>
                    <button className='btnauth2' type="submit">Войти</button>
                    <button className='btnzar2' type='button' onClick={handleRegistrRedirect} >Зарегистрироваться</button>
                </div>
                    {error && <div className='Error' style={{color: 'red' }}>{error}</div>}

                <div className='copyright'>
                    Копирайт © 2025 ООО «Компас Плюс»
                </div>
            </form>

            </div>
            <div className='block-right'>
                
            </div>
        </div>
    );
}

export default Autorisation;