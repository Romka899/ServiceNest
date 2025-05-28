import './App.css';
import "./Register.css"
import "./CreateBanner.css"
import React/*, {useEffect}*/ from 'react';
import { BrowserRouter as Router, Routes, Route/*, useNavigate*/ } from 'react-router-dom';
import Register from './Register';
import CreateBanner from './CreateBanner';
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
                <Route path="/" element={<Register />} />
                <Route path="/autorisation" element={<Autorisation />} />
                <Route path='/ad-objects' element= {<BannerSelection />} />
                <Route path="/create-banner" element={<CreateBanner />} />
                <Route path="/create-banner/:companyId" element={<CreateBanner />} />
                <Route path="/edit-banner/:bannerId" element={<CreateBanner />} />
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