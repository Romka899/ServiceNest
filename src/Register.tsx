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
            <h1>Регистрация</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div className='Login'>
                    <label>Login</label>
                    <input 
                        className='inp1' 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div className='Password'>
                    <label>Password</label>
                    <input 
                        className='inp2' 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                <div className='Zareg'>
                    <button type="submit">
                        Зарегистрироваться
                    </button>
                </div>
                <div className='Autor'>
                    <button 
                        type="button" 
                        onClick={handleLoginRedirect} 
                        style={{ marginTop: '20px' }}
                    >
                        Авторизация
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;