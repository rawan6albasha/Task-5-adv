import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from './SideBar.module.css';
import logo from './../../assets/img/Logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCubes } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const SideBar = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const first_name = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('lastName');
    const profileImg = localStorage.getItem('profileImage');

    if (first_name && lastName) {
      setFullName(`${first_name} ${lastName}`);
    }

    if (profileImg) {
      setProfileImage(profileImg);
    }
  }, []);

  const handleLogout = () => {
    axios.post("https://test1.focal-x.com/api/logout", {}, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    .then(() => {
      localStorage.removeItem('first_name');
      localStorage.removeItem('lastName');
      localStorage.removeItem('profileImage');
      localStorage.removeItem('token');
      navigate('/SignIn');
    })
    .catch(error => {
      console.error("Logout error:", error);
    });
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 767) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };

    updateItemsPerPage(); // تحديث في أول تحميل
    window.addEventListener('resize', updateItemsPerPage); // استماع لتغييرات الحجم

    return () => {
      window.removeEventListener('resize', updateItemsPerPage); // تنظيف الحدث عند إلغاء تحميل المكون
    };
  }, []);

  return (
    <div>
      {window.innerWidth <= 768 && (
        <button className={style.toggle_btn} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faUser} />
        </button>
      )}
      {isSidebarVisible && (
        <div className={style.sidebar}>
          <div>
            <div className={style.profile}>
              <div className={style.logo}>
                <img src={logo} alt='logo' />
              </div>
              {profileImage ? (
                <img className={style.profile_img} src={profileImage} alt="Profile" />
              ) : (
                <img className={style.profile_img} src="default-profile.png" alt="Default Profile" />
              )}
              <h2 className={style.username}>{fullName}</h2>
            </div>
            <div className={style.department}>
              <Link to='/products' className={style.activ}><FontAwesomeIcon icon={faCubes} /><p>Products</p></Link>
              <Link to='/favorites'><FontAwesomeIcon icon={faBookmark} /><p>Favorites</p></Link>
              <Link to='/order-list'><FontAwesomeIcon icon={faBookmark} /><p>Order List</p></Link>
            </div>
          </div>
          <button className={style.logout_btn} onClick={handleLogout}>
            <p>Logout </p> <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SideBar;
