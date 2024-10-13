import { ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Show from './pages/Show/Show';

import Edit from './pages/Edit/Edit';
import Add from './pages/Add/Add';
import SideBar from './Components/SideBar/SideBar';

function App() {
  const pages: { name: string, component: ReactNode }[] = [
    { name: 'SignIn', component: <SignIn/> },
    { name: 'SignUp', component: <SignUp/> },
    { name: '', component: <Dashboard/> },
    { name: 'show/:id', component: <Show/> },
    { name: 'edit/:id', component: <Edit/> },
    { name: 'add', component: <Add/> },
  ];
  const hideSideBarRoutes = ['/SignIn', '/SignUp']; // يمكنك إضافة المزيد من المسارات هنا

  const shouldShowSideBar = !hideSideBarRoutes.includes(location.pathname);
  return (
    <div className='app'>
    {/* <SignUp /> */}
    {shouldShowSideBar && <SideBar />}
      <Routes>
        {pages.map((page, index) => (
          <Route key={index} path={`/${page.name}`} element={page.component} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
