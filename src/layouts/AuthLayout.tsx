import {Navigate, Outlet} from '@tanstack/react-router';
import MenuBook from '../assets/images/logo/Menubook.png';
import React from 'react';
import {useAuthContext} from '@/context/AuthContext';

const AuthLayout = () => {
  const {isAuthenticated} = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (


<div className="flex min-h-screen w-full overflow-hidden flex-col items-center justify-center rounded-sm border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
  <div className="flex w-full items-center justify-center">
    <div className="w-full xl:w-1/2 2xl:w-1/3">
      <div className="w-full p-4 sm:p-8 lg:p-12">
        <Outlet />
      </div>
    </div>
  </div>
</div>
  );
};

export default AuthLayout;
