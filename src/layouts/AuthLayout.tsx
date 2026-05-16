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
<div className="flex min-h-screen w-full overflow-hidden flex-col items-center justify-center rounded-sm border border-stroke bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-default dark:border-strokedark dark:bg-boxdark">      <div className="flex w-full items-center justify-center ">
        <div className="w-full xl:w-1/2 2xl:w-1/3 ">
          <div className="w-full p-4 sm:p-8 lg:p-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
