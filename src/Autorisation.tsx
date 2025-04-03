import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Autorisation.css"

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

    return (
        <div className="login">
            <h1>Авторизация</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Autorisation;