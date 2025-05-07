import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Autorisation.css"
import logo from "./img/logocomp.png"
//import { AuthResponse } from '../../test/tests/src/auth/interfaces/auth.interface'
//'./test/tests/src/auth/interfaces/auth.interface.ts'

const Autorisation: React.FC = () => {
    const [username, setUsername] = useState<string>(() => {
        return localStorage.getItem('rememberedUsername') || '';
      });
    const [rememberMe, setRememberMe] = useState<boolean>(() => {
        return localStorage.getItem('rememberMe') === 'true';
      });

    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();


    

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
        
        if (!e.target.checked) {
            localStorage.removeItem('rememberedUsername');
        }
    };

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/authorization', 
        { username, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      if (response.data.status === 'success') {
        if (rememberMe) {
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberMe');
          }
  
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        navigate('/ad-objects');
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      setError('Неверные учетные данные или ошибка сервера');
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