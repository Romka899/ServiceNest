import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from './api'
import exp from "constants";

const SessionChecker = () => {
    const navigate = useNavigate();

    useEffect(() =>{
        const checkSession = async() => {
            try{
                await api.get('/check-session');
            } catch (error) {
                localStorage.removeItem('isAuthenticated');
                navigate('/');
            }
        };

        const interval = setInterval(checkSession, 1 * 1000);

        checkSession();
        return() => clearInterval(interval);
    }, [navigate]);

    return null;
};

export default SessionChecker;