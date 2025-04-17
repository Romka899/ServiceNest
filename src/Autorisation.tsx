import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Autorisation.css"
import logo from "./img/logocomp.png"

const Autorisation: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/autorisation', {
                username,
                password,
            });

            if (response.data.message === 'Авторизация успешна') {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', username);
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
            <h1 className='zagolovok'>Авторизация</h1>
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
                <div className='EmptyHeight'>
                </div>
                <div className='Zareg'>
                    <button className='btnauth' type="submit">Войти</button>
                    <button className='btnzar' type='button' onClick={handleRegistrRedirect} >Зарегистрироваться</button>
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