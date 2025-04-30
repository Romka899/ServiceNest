import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import './BannerSelection.css';
import axios from "axios";
import logo from './img/logocomp.png';
import SK from './img/SKlogo.png';
import YA from './img/YAlogo.png';
import BB from './img/BBlogo.png';
import OZ from './img/OZlogo.png';
//import Ex from './img/ExitIcon.png';


type Banner = {
  id: string;
  bannerName: string;
  imageNames?: string[];
  placement: string;
  app: string;
  timestamp: string;
  username: string;
  userId: string;
  companyId: number;
};


type AdObject = {
  id: number;
  companyLogo: string;
  companyName: string;
};

const BannerSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<AdObject | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const cerrentUser = localStorage.getItem('username') || '';


  const adObjects: AdObject[] = [
    {
      id: 1,
      companyLogo: SK,
      companyName: 'Своя Компания',

    },
    {
      id: 2,
      companyLogo: YA,
      companyName: 'Яндекс Маркет',

    },
    {
      id: 3,
      companyLogo: BB,
      companyName: 'ВкусВилл',

    },
    {
      id: 4,
      companyLogo: OZ,
      companyName: 'OZON',

    }
  ];

  useEffect(() => {
    const fetchUserBanners = async() => {
      try{
        const response = await axios.get('http://localhost:3000/api/user-banners', {
          withCredentials: true
        });
        setBanners(response.data);
        setLoading(false);
      }catch(error)
      {
        console.log('Error fetching user banners', error);
        setLoading(false);
      }
    };
    
    fetchUserBanners();
  }, []);



  const handleSelectCompany = (company: AdObject) => {
    setSelectedCompany(company);
  };

  const handleCreateNewBanner = () => {
    if (selectedCompany) {
      navigate(`/create-banner/${selectedCompany.id}`);
    } 
  };

  const handleGoBack = () => {
    setSelectedCompany(null);
  };

  const handleEditBanner = (bannerId: string) => {
    navigate(`/edit-banner/${bannerId}`);
  };


  const Header = ({ title }: { title: string }) => {
    return (
      <header className="app-header">
        <div className="header-content">
          <div className='head-logo'>
            <img src={logo} alt=""/>
          </div>
          <h1>{title}</h1>
          <div className="user-info">
            <span>{localStorage.getItem('username') || 'Пользователь'}</span>
          </div>
        </div>
      </header>
    );
  };

  if(loading){
    return <div>Загрузка...</div>
  }
  return (
    <div className='app-all'>
      <div className="app-container2">
        {selectedCompany ? (
          <>
            <Header title={`Добавленные рекламные объекты`}/>
            <div className="content-container">
              <div className="company-header">
                <img 
                  src={selectedCompany.companyLogo} 
                  alt={`Логотип ${selectedCompany.companyName}`}
                  className="company-logo-large"
                />
                <h2 className="company-name-large">{selectedCompany.companyName}</h2>
              </div>
              
              <div className="banners-grid">
                {banners
                .filter(banner => banner.companyId === selectedCompany.id)
                .map(banner =>(
                  <div
                    key={banner.id}
                    className="banner-card"
                    onClick={() => handleEditBanner(banner.id)}
                  >
                    <div className="banner-image-placeholder">
                      {banner.imageNames?.[0] ?(
                        <img
                          src={`http://localhost:3000/images/${banner.imageNames[0]}`}
                          alt={banner.bannerName}
                        />
                      ) : (
                        <span>{banner.bannerName}</span>
                      )}
                    </div>
                    <div className="banner-info">
                      <h3 className="banner-name">{banner.bannerName}</h3>
                      <p className="banner-date">
                        {new Date(banner.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              }
              </div>
              
              <div className="action-buttons">
                <button 
                  onClick={handleGoBack}
                  className="back-btn"
                >
                  Назад
                </button>
                <button 
                  onClick={handleCreateNewBanner}
                  className="create-btn"
                >
                  Добавить баннер
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Header title="Рекламные объекты"/>
            <div className="content-container">
              <h2 className="section-title">Добавленные рекламные объекты</h2>
              
              <div className="companies-conteiner">
                {adObjects.map(company => {
                  const companyBanners = banners.filter(b => b.companyId === company.id);
                  return(                  
                  <div 
                    key={company.id} 
                    className="company-card"
                    onClick={() => handleSelectCompany(company)}
                  >
                    <div className="company-card-content">
                      <img 
                        src={company.companyLogo} 
                        alt={`Логотип ${company.companyName}`}
                        className="company-logo"
                      />
                      <h3 className="company-name">{company.companyName}</h3>
                    </div>
                    <div className="banners-count">
                      Баннеров: {companyBanners.length}
                    </div>
                  </div>);
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BannerSelection;