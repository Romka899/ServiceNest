import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import './BannerSelection.css';
import axios from "axios";
import logo from './img/logocomp.png';
import SK from './img/SKlogo.png';
import YA from './img/YAlogo.png';
import BB from './img/BBlogo.png';
import OZ from './img/OZlogo.png';
import Ex from './img/ExitIcon.png';
import PB from './img/pocketbank.jpg';
import moment from 'moment-timezone';


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
  companyName: string;
  showTime: string;
  period: string;
  isActive: boolean;
};


type AdObject = {
  id: number;
  companyLogo: string;
  companyName: string;
  banners?: Banner[];
};

const BannerSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<AdObject | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  //const cerrentUser = localStorage.getItem('username') || '';


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

    },
    {
      id: 5,
      companyLogo: PB,
      companyName: 'PocketBank',
    }
  ];

  
  useEffect(() => {
    const fetchUserBanners = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-banners', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setBanners(response.data);
      } catch (error) {
        console.error('Full error details:', error);
        if (axios.isAxiosError(error)) {
            console.error('Error response:', error.response?.data);
        }
    } finally {
        setLoading(false);
    }
};

fetchUserBanners();
}, [navigate]);


const handleSelectCompany = (company: AdObject) => {
  const companyBanners = banners.filter(b => 
    (b.userId === localStorage.getItem('username') || 
     b.username === localStorage.getItem('username')) &&
    b.companyId?.toString() === company.id.toString()
  );
  
  setSelectedCompany({
    ...company,
    banners: companyBanners
  });
  setEditMode(false);
  setSelectedBanners([]);
};


const calculateIsActive = (banner: Banner): boolean => {
  if (!banner.period) return false;
  
  try {
    const [startStr, endStr] = banner.period.split(' — ');
    
    const startDate = moment(startStr, 'D MMMM YYYY HH:mm');
    const endDate = moment(endStr, 'D MMMM YYYY HH:mm');
    
    if (!startDate.isValid() || !endDate.isValid()) return false;
    
    return moment().isBetween(startDate, endDate);
  } catch (e) {
    console.error('Error parsing banner period:', e);
    return false;
  }
};

  const handleCreateNewBanner = () => {
    if (selectedCompany) {
      navigate(`/create-banner/${selectedCompany.id}`, {
        state: { 
          company: selectedCompany 
        }
      });
    } 
  };

  const handleGoBack = () => {
    setSelectedCompany(null);
  };

  const handleEditBanner = (banner: Banner) => {
    if (editMode) return;
    navigate(`/edit-banner/${banner.id}`, {
      state: {
        company: selectedCompany,
        bannerData: banner
      }
    });
  };

  const handleToggleSelectBanner = (bannerId: string) =>{
    setSelectedBanners(prev =>
      prev.includes(bannerId)
      ? prev.filter(id => id !== bannerId)
      : [...prev, bannerId]
    );
  };

  const handleDeleteSelectedBanners = async () => {
    if (selectedBanners.length === 0) return;
    
    try {
      await Promise.all(
        selectedBanners.map(bannerId => 
          axios.delete(`http://localhost:3000/api/banners/${bannerId}`, {
            withCredentials: true
          })
        )
      );
      
      setBanners(prev => prev.filter(b => !selectedBanners.includes(b.id)));
      
      setSelectedCompany(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          banners: prev.banners?.filter(b => !selectedBanners.includes(b.id)) || []
        };
      });
      
      setSelectedBanners([]);
      setEditMode(false);
      
    } catch (error) {
      console.error('Delete error:', error);
      //alert('Ошибка при удалении баннеров');
    }
  };


  const handleToggleBannersActivation = async (isActive: boolean) => {
    try {
        await axios.post('http://localhost:3000/api/toggle-banners', {
            bannerIds: selectedBanners,
            isActive
        }, {
            withCredentials: true
        });
        
        setSelectedCompany(prev => {
            if (!prev) return null;
            
            return {
                ...prev,
                banners: prev.banners?.map(banner => 
                    selectedBanners.includes(banner.id)
                        ? { ...banner, isActive }
                        : banner
                ) || []
            };
        });
        
        setSelectedBanners([]);
        setEditMode(false);
        //alert(`Баннеры успешно ${isActive ? 'активированы' : 'деактивированы'}`);
    } catch (error) {
        console.error('Activation error:', error);
        //alert('Ошибка при изменении статуса баннеров');
    }
};

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      setSelectedBanners([]);
    }
  };

  const Header = ({ title }: { title: string }) => {
    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:3000/api/logout', {}, {
          withCredentials: true
        });
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        navigate('/autorisation');
        window.location.reload();
      } catch (error) {
        console.error('Ошибка при выходе:', error);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        navigate('/autorisation');
        //window.location.reload();
      }
    };
  
    return (
      <header className="app-header">
        <div className="header-content">
          <div className='head-logo'>
            <img src={logo} alt=""/>
          </div>
          <h1>{title}</h1>
          <div className="user-info">
            <span>{localStorage.getItem('username') || 'Пользователь'}</span>
            <button onClick={handleLogout} className="logout-btn">
              <img src={Ex} alt="Выход" title="Выйти из системы"/>
            </button>
          </div>
        </div>
    </header>
    );
  };

  if (loading) {
    return <div>Загрузка...</div>;
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

                {editMode ? '' :<button
                  className="change-btn"
                  onClick={handleToggleEditMode}
                >Изменить</button>}
              </div>
              
              
              <div className="banners-grid">
                {selectedCompany.banners?.filter(b => b?.id).map((banner) => (
                  <div 
                    key={banner.id} 
                    className={`banner-row ${editMode ? 'edit-mode' : ''}`}
                    onClick={() => !editMode && handleEditBanner(banner)}
                  >
                    {editMode && (
                      <label className="banner-checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedBanners.includes(banner.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleSelectBanner(banner.id);
                          }}
                        />
                        <span className="banner-checkmark"></span>
                      </label>
                    )}
                    <div className="banner-card">
                      <div className="banner-info">
                        <div className="title-container">
                          <p className="ObjName">
                            {banner.bannerName || `Баннер ${banner.id?.slice(0, 4) || 'N/A'}`}
                          </p>
                          <p className="arrow">&gt;</p>
                        </div>
                        <div className="bott-container">
                          <p className="Period">
                            Период публикации: {banner.period || 'значение не задано'}
                          </p>
                          <p className="onActive">
                            {calculateIsActive(banner) ?
                              <span className="Active">Активный</span> : 
                              <span className="noActive">Неактивный</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                {editMode ? (
                  <>
                    <button onClick={handleToggleEditMode} className="back-btn">
                      Отмена
                    </button>
                    <button 
                      onClick={() => handleToggleBannersActivation(true)} 
                      className="activate-btn"
                      disabled={selectedBanners.length === 0}
                    >
                      Активировать выбранные ({selectedBanners.length})
                    </button>
                    <button 
                      onClick={() => handleToggleBannersActivation(false)} 
                      className="deactivate-btn"
                      disabled={selectedBanners.length === 0}
                    >
                      Деактивировать выбранные ({selectedBanners.length})
                    </button>
                    <button 
                      onClick={handleDeleteSelectedBanners} 
                      className="create-btn"
                      disabled={selectedBanners.length === 0}
                    >
                      Удалить выбранные ({selectedBanners.length})
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleGoBack} className="back-btn">
                      Назад
                    </button>
                    <button 
                      onClick={handleCreateNewBanner} 
                      className="create-btn"
                    >
                      Добавить баннер
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Header title="Рекламодатели"/>
            <div className="content-container">
              <h2 className="section-title">Список рекламодателей</h2>
              
              <div className="companies-conteiner">
                {adObjects.map(company => {
                  const companyBanners = banners.filter(b => {
                    const isUserBanner = b.userId === localStorage.getItem('username') || 
                                        b.username === localStorage.getItem('username');
                    
                    const isCompanyBanner = b.companyId !== undefined && 
                                          b.companyId !== null &&
                                          b.companyId.toString() === company.id.toString();
                    
                    return isUserBanner && isCompanyBanner;
                  });
                  
                  return (                  
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
                    </div>
                  );
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