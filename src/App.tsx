import './App.css';
import "./Register.css"
import "./BannerForm.css"
import React/*, {useEffect}*/ from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import Register from './Register';
import BannerForm from './BannerForm';
import Autorisation from './Autorisation';
import BannerSelection from './BannerSelection';



const AppContent: React.FC = () => {
    //const navigate = useNavigate();

    /*
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            navigate('/ad-objects');
        } else if(!isAuthenticated && window.location.pathname === '/create-banner'){
            navigate('/autorization');
        }
    }, [navigate]);
*/



    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<Autorisation />} />
                <Route path="/autorisation" element={<Autorisation />} />
                <Route path='/ad-objects' element= {<BannerSelection />} />

                    <Route path="/create-banner/:companyId" element={
                        <BannerForm mode="create" />
                    } />
                    
                    <Route path="/edit-banner/:bannerId" element={
                        <BannerForm mode="edit" />
                    } />
                <Route path="*" element={<Navigate to="/ad-objects" replace />} />
            </Routes>
        </div>
    );
}

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;