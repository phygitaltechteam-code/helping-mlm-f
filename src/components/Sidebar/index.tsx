import { useAuthContext } from '@/context/AuthContext';
import { NetworkIcon, ProfileIcon, ReportIcon } from '@/icons';
import { SidebarProps } from '@/types';
import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { BiListUl, BiRupee } from 'react-icons/bi';
import { FaNetworkWired } from 'react-icons/fa';
import { FaArrowLeftLong, FaMoneyBillTransfer } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';
import { MdApproval } from 'react-icons/md';
import {
  PiNavigationArrowFill,
  PiShareLight,
  PiSquaresFourLight,
} from 'react-icons/pi';
import SidebarLinkGroup from './SidebarLinkGroup';
import logo from '../../../public/logo.png';

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useAuthContext();
  const role = user?.role;

  const sidebarRoutes =
    role === 'ADMIN'
      ? [
          {
            label: 'Dashboard',
            path: '/dashboard',
            icon: <PiSquaresFourLight size={18} />,
          },
          {
            label: 'Customer List',
            path: '/admin/customerlist',
            icon: <BiListUl size={18} />,
          },
           {
            label: 'Generation Tree',
            path: '/admin/network',
            icon: <FaNetworkWired size={18} />,
          },
          {
            label: 'Upgrade Tree',
            path: '/admin/binarytree',
            icon: <NetworkIcon size={18} />,
          },
          {
            label: 'Payout',
            path: '/admin/commisionreport',
            icon: <BiRupee size={18} />,
            subRoutes: [
              {
                label: 'Pending Commission',
                path: '/admin/pendingcommisionreport',
              },
              {
                label: 'Paid Commission',
                path: '/admin/commisionreport',
              },
              
            ],
          },

           {
            label: 'E-Pin',
            icon: <PiSquaresFourLight size={18} />,
            path: '/admin/Epin',
            subRoutes: [
               { label: 'Assign E-Pin', path: '/admin/Epin' },
              { label: 'Customer Activation', path: '/admin/productassignpage' },
              { label: 'Recall E-pin', path: '/admin/recallepin' },
              { label: 'Requested E-pin', path: '/admin/approvedepin' },
            ],
          },

          {
            label: 'Product Deliverd List',
            path: '/admin/productapprove',
            icon: <ProfileIcon size={18} />,
          },
          
         
          // {
          //   label: 'Fund Request',
          //   path: '/admin/epinrequest',
          //   icon: <MdApproval size={18} />,
          // },
          // {
          //   label: 'Fund Transfer',
          //   path: '/fundtransfer',
          //   icon: <FaMoneyBillTransfer size={18} />,
          // },
          // {
          //   label: 'Share Link',
          //   path: '/admin/sharelink',
          //   icon: <PiShareLight size={18} />,
          // },
          // {
          //   label: 'Reports',
          //   path: '/admin/roi',
          //   icon: <PiShareLight size={18} />,
          //   subRoutes: [
          //     {
          //       label: 'ROI Income',
          //       path: '/admin/roi',
          //     },
          //   ],
          // },
          
         
        ]
      : role === 'CUSTOMER'
        ? [
          {
            label: 'Dashboard',
            path: '/customer/dashboard',
            icon: <PiSquaresFourLight size={18} />,
          },

          {
            label: 'My Invoice',
            path: '/customer/myInvoice',
            icon: <PiSquaresFourLight size={18} />,
          },
          {
            label: 'Welcome Letter',
            path: '/customer/wlcletter',
            icon: <PiSquaresFourLight size={18} />,
          },
          {
            label: 'My Tree',
            path: '/customer/generation-tree',
            icon: <NetworkIcon size={18} />,
            subRoutes: [
              {
                label: 'Generation Tree',
                path: '/customer/generation-tree',
              },
            ],
          },
          {
            label: 'My Team',
            path: '/customer/generation-team',
            icon: <FaNetworkWired size={18} />,
            subRoutes: [
              {
                label: 'Generation Team',
                path: '/customer/generation-team',
              },
            ],
          },
          {
            label: 'Commission Report',
            path: '/customer/reportc',
            icon: <ReportIcon size={18} />,
          },
          // {
          //   label: 'Wallet',
          //   path: '/customer/walletc',
          //   icon: <PiSquaresFourLight size={18} />,
          //   subRoutes: [
          //     { label: 'Wallet History', path: '/customer/walletc' },
          //     { label: 'Roi History', path: '/customer/roiHistory' },
          //     { label: 'Wallet Address', path: '/customer/addwallet' },
          //     { label: 'Wallet income', path: '/customer/walletincome' },
          //   ],
          // },
          // {
          //   label: 'Withdrawal',
          //   path: '/customer/withdraw',
          //   icon: <PiSquaresFourLight size={18} />,
          //   subRoutes: [
          //     { label: 'Withdrawal', path: '/customer/withdraw' },
          //     { label: 'Withdrawal History', path: '/customer/withdrawhistory' },
          //   ],
          // },
          // {
          //   label: 'Fund Transfer',
          //   path: '/customer/custmerfundtransfer',
          //   icon: <PiSquaresFourLight size={18} />,
          //   subRoutes: [
          //     {
          //       label: 'Fund Transfer',
          //       path: '/customer/custmerfundtransfer',
          //     },
          //     {
          //       label: 'Transfer History',
          //       path: '/customer/fundTransferHistory',
          //     },
          //   ],
          // },
          {
            label: 'E-Pin Request',
            path: '/customer/epinc',
            icon: <PiNavigationArrowFill size={18} />,
          },
          {
            label: 'Customer Activation',
            path: '/customer/customeractivation',
            icon: <MdApproval size={18} />,
          },
        ]
        : [];

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === 'true'
  );

  const handleLinkClick = () => setSidebarOpen(false);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (
        !sidebar.current ||
        !trigger.current ||
        !sidebarOpen ||
        sidebar.current.contains(event.target as Node) ||
        trigger.current.contains(event.target as Node)
      )
        return;

      setSidebarOpen(false);
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!sidebarOpen || event.key !== 'Escape') return;
      setSidebarOpen(false);
    };

    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', String(sidebarExpanded));
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-[9999] flex h-screen w-64 flex-col bg-white shadow-xl duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 w-auto object-contain"
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-lg"
        >
          <FaArrowLeftLong />
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <div>
          <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
            MENU
          </h3>
          <ul className="flex flex-col gap-1.5">
            {sidebarRoutes.map((route, index) =>
              route.subRoutes ? (
                <SidebarLinkGroup
                  key={index}
                  activeCondition={
                    pathname === route.path || pathname.includes(route.path!)
                  }
                >
                  {(handleClick, open) => (
                    <>
                      <Link
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-gray-200 dark:text-white dark:hover:bg-meta-4 ${(pathname === route.path ||
                          pathname.includes(route.path!)) &&
                          'bg-gray-100 dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                        }}
                      >
                        {route.icon}
                        {route.label}
                        <IoIosArrowDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                        />
                      </Link>

                      {/* Dropdown Menu */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          {route.subRoutes.map((sub, i) => (
                            <li key={i}>
                              <Link
                                to={sub.path}
                                onClick={handleLinkClick}
                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black duration-300 ease-in-out hover:text-primary ${pathname === sub.path && 'text-primary'
                                  }`}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              ) : (
                <li key={index}>
                  <Link
                    to={route.path}
                    onClick={handleLinkClick}
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-gray-200 dark:text-white dark:hover:bg-meta-4 ${pathname === route.path && 'bg-gray-100 dark:bg-meta-4'
                      }`}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;