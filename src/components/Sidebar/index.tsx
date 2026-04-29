import { useAuthContext } from '@/context/AuthContext';
import { NetworkIcon, ProfileIcon, RegistrationIcon, ReportIcon } from '@/icons';
import { SidebarProps } from '@/types';
import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { BiListUl, BiRupee } from 'react-icons/bi';
import { FaNetworkWired } from 'react-icons/fa';
import { FaArrowLeftLong, FaMoneyBillTransfer } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';
import { MdApproval } from 'react-icons/md';
import {
  PiEnvelopeSimpleLight,
  PiFileTextLight,
  PiNavigationArrowFill,
  PiShareLight,
  PiSquaresFourLight,
} from 'react-icons/pi';
import SidebarLinkGroup from './SidebarLinkGroup';
import logo from '../../../public/logo.png';
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useAuthContext();
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
          label: 'My Team',
          path: '/admin/customerlist',
          icon: <BiListUl size={18} />,
        },
        // {
        //   label: 'Laverage Tree',
        //   path: '/admin/autopool',
        //   icon: <NetworkIcon size={18} />,
        // },
        // {
        //   label: 'My Invoice',
        //   path: '/admin/invoice',
        //   icon: <PiFileTextLight size={18} />,
        // },
        // {
        //   label: 'Welcome Letter',
        //   path: '/admin/wlcmletter',
        //   icon: <PiEnvelopeSimpleLight size={18} />,
        // },
        {
          label: 'Helping Tree',
          path: '/admin/binarytree',
          icon: <NetworkIcon size={18} />,
        },
        {
          label: 'Generation Tree',
          path: '/admin/network',
          icon: <FaNetworkWired size={18} />,
        },
        // {
        //   label: 'Registeration',
        //   path: '/admin/customerregister',
        //   icon: <RegistrationIcon size={18} />,
        // },
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: <PiSquaresFourLight size={18} />,
        },
        {
          label: 'Laverage Tree',
          path: '/admin/autopool',
          icon: <NetworkIcon size={18} />,
        },
        // {
        //   label: 'My Invoice',
        //   path: '/admin/invoice',
        //   icon: <PiFileTextLight size={18} />,
        // },
        // {
        //   label: 'Welcome Letter',
        //   path: '/admin/wlcmletter',
        //   icon: <PiEnvelopeSimpleLight size={18} />,
        // },
        {
          label: 'Binary Tree',
          path: '/admin/binarytree',
          icon: <NetworkIcon size={18} />,
        },
        // {
        //   label: 'Generation Tree',
        //   path: '/admin/network',
        //   icon: <FaNetworkWired size={18} />,
        // },
        // {
        //   label: 'Registeration',
        //   path: '/admin/customerregister',
        //   icon: <RegistrationIcon size={18} />,
        // },

        {
          label: 'Customer List',
          path: '/admin/customerlist',
          icon: <BiListUl size={18} />,
        },
        {
          label: 'Fund Request',
          path: '/admin/epinrequest',
          icon: <MdApproval size={18} />,
        },
        {
          label: 'Fund Transfer',
          path: '/fundtransfer',
          icon: <FaMoneyBillTransfer size={18} />,
        },
        // {
        //   label: 'Activate ID',
        //   path: '/admin/topup',
        //   icon: <MdApproval size={18} />,
        // },

        {
          label: 'Share Link',
          path: '/admin/sharelink',
          icon: <PiShareLight size={18} />,
        },
        // {
        //   label: 'Delivered Products',
        //   path: '/admin/productreport',
        //   icon: <PiShareLight size={18} />,
        // },
        // {
        //   label: 'Delivered Products',
        //   path: '/admin/deliverdproducts',
        //   icon: <PiShareLight size={18} />,
        // },

        {
          label: 'Reports',
          path: '/admin/roi',
          icon: <PiShareLight size={18} />,
          subRoutes: [
            {
              label: 'ROI Income',
              path: '/admin/roi',
            },
          ],
        },

        // {
        //   label: 'Wallet Report',
        //   path: '/admin/wallethistory',
        //   icon: <FaHistory size={18} />,
        // },

        // {
        //   label: 'Sales Report',
        //   path: '/admin/productsalesreport',
        //   icon: <ReportIcon size={18} />,
        // },
        // {
        //   label: 'Bussiness Development Fund',
        //   path: '/admin/retirement',
        //   icon: <FaUnderline size={18} />,
        // },
        // {
        //   label: 'Gold Reward',
        //   path: '/admin/gold',
        //   icon: <GiOldKing size={18} />,
        // },
        // {
        //   label: 'Award Reward',
        //   path: '/admin/awardreward',
        //   icon: <BiAward size={18} />,
        // },
        // {
        //   label: 'Leadership Fund',
        //   path: '/admin/leadership',
        //   icon: <LuAlignVerticalDistributeEnd size={18} />,
        // },
        // {
        //   label: 'Repurchase Report',
        //   path: '/admin/repurchaseproduct',
        //   icon: <BiRupee size={18} />,
        // },
        // {
        //   label: 'Banner',
        //   path: '/admin/banner',
        //   icon: <GiTargetPoster size={18} />,
        // },
        {
          label: 'Payout',
          path: '/admin/commisionreport',
          icon: <BiRupee size={18} />,
          subRoutes: [
            {
              label: 'Paid Commission ',
              path: '/admin/commisionreport',
            },
            {
              label: 'Pending Commission ',
              path: '/admin/pendingcommisionreport',
            },
            // {
            //   label: 'fund Request',
            //   path: '/admin/flashoutcommision',
            // },
          ],
        },

        {
          label: 'E-Pin',
          icon: <PiSquaresFourLight size={18} />,
          subRoutes: [
            {
              label: 'Admin E-Pin',
              path: '/admin/Epin',
            },
            {
              label: 'Customer E-Pin',
              path: '/admin/customerepin',
            },
            {
              label: 'Recall E-pin',
              path: '/admin/recallepin',
            },
            {
               label: 'Approve E-pin',
              path: '/admin/approvedepin',
            }
          ],
        },
        // {
        //   label: 'Power Leg',
        //   path: '/admin/powerlegcustlist',
        //   icon: <TbBinaryTree2Filled size={18} />,
        // },
        // {
        //   label: 'Change Email',
        //   path: '/admin/editemail',
        //   icon: <MdEmail size={18} />,
        // },
      ]
      : // Customer
      // role === 'CUSTOMER'
      //   ? [
      //     {
      //       label: 'Dashboard',
      //       path: '/customer/dashboard',
      //       icon: <PiSquaresFourLight size={18} />,
      //     },
      //     // {
      //     //   label: 'Registeration',
      //     //   path: '/customer/customerregisterc',
      //     //   icon: <RegistrationIcon size={18} />,
      //     // },
      //     {
      //       label: 'Customer Profile',
      //       path: '/customer/profile',
      //       icon: <ProfileIcon size={18} />,
      //     },
      //     {
      //       label: 'My Network',
      //       path: '/admin/binarytree',
      //       icon: <NetworkIcon size={18} />,
      //       subRoutes: [
      //         {
      //           label: 'Tree View',
      //           path: '/admin/binarytree',
      //         },
      //         {
      //           label: 'Downline List',
      //           path: '/customer/downlinelist',
      //         },
      //       ],
      //     },

      //     // {
      //     //   label: 'Direct Customer',
      //     //   path: '/customer/directcustomer',
      //     //   icon: <NetworkIcon size={18} />,
      //     // },
      //     // {
      //     //   label: 'Generation Tree',
      //     //   path: '/customer/gentree',
      //     //   icon: <FaNetworkWired size={18} />,
      //     // },
      //     {
      //       label: 'Activate ID',
      //       path: '/customer/topup',
      //       icon: <PiSquaresFourLight size={18} />,
      //       subRoutes: [

      //         {
      //           label: 'Activate ID Wallet',
      //           path: '/customer/activatefromwallet',
      //         },
      //         {
      //           label: 'Activate history',
      //           path: '/customer/activateIdHistory',
      //         },
      //       ],
      //     },
      //     // {
      //     //   label: 'Award Reward',
      //     //   path: '/customer/awardreward',
      //     //   icon: <BiAward size={18} />,
      //     // },
      //     {
      //       label: 'Report',
      //       path: '/customer/reportc',
      //       icon: <ReportIcon size={18} />,
      //     },
      //     // {
      //     //   label: 'Lavrage',
      //     //   path: '/customer/helping',
      //     //   icon: <ReportIcon size={18} />,
      //     // },
      //     // {
      //     //   label: 'BDF',
      //     //   path: '/customer/royelty',
      //     //   icon: <PiSquaresFourLight size={18} />,
      //     // },
      //     // {
      //     //   label: 'Share Link',
      //     //   path: '/customer/customersidesharelink',
      //     //   icon: <PiSquaresFourLight size={18} />,
      //     // },
      //     {
      //       label: 'Wallet',
      //       path: '/customer/walletc',
      //       icon: <PiSquaresFourLight size={18} />,
      //       subRoutes: [
      //         {
      //           label: 'Wallet History',
      //           path: '/customer/walletc',
      //         },
      //         {
      //           label: 'Roi History',
      //           path: '/customer/roiHistory',
      //         },
      //         {
      //           label: 'Wallet Address',
      //           path: '/customer/addwallet',
      //         },
      //         {
      //           label: 'Wallet income',
      //           path: '/customer/walletincome',
      //         },
      //       ],
      //     },
      //     {
      //       label: 'Withdrawal',
      //       path: '/customer/withdraw',
      //       icon: <PiSquaresFourLight size={18} />,
      //       subRoutes: [
      //         {
      //           label: 'Withdrawal',
      //           path: '/customer/withdraw',
      //         },
      //         {
      //           label: 'Withdrawal History',
      //           path: '/customer/withdrawhistory',
      //         },
      //       ],
      //     },

      //     // {
      //     //   label: ' Payout History',
      //     //   path: '/customer/historypayout',
      //     //   icon: <PiSquaresFourLight size={18} />,
      //     // },
      //     // {
      //     //   label: 'Withdraw Amount',
      //     //   path: '/customer/withdraw',
      //     //   icon: <PiSquaresFourLight size={18} />,
      //     // },
      //     {
      //       label: 'fund transfer',
      //       path: '/customer/custmerfundtransfer',
      //       icon: <PiSquaresFourLight size={18} />,
      //       subRoutes: [
      //         {
      //           label: 'fund transfer',
      //           path: '/customer/custmerfundtransfer',
      //         },
      //         {
      //           label: 'Transfer History',
      //           path: '/customer/fundTransferHistory',
      //         },
      //       ],
      //     },
      //     {
      //       label: 'E-Pin',
      //       path: '/customer/epinc',
      //       icon: <PiNavigationArrowFill size={18} />,

      //     },
      //     {
      //       label: 'Fund Request',
      //       path: '/customer/epinc',
      //       icon: <PiNavigationArrowFill size={18} />,
      //       subRoutes: [
      //         {
      //           label: 'Fund Request',
      //           path: '/customer/epinc',
      //         },
      //         {
      //           label: 'request History',
      //           path: '/customer/fundrequestHistory',
      //         },
      //       ],
      //     },
      //     // {
      //     //   label: 'Repurchase Product',
      //     //   path: '/customer/repurchaseproduct',
      //     //   icon: <MdOutlineProductionQuantityLimits size={18} />,
      //     // },
      //   ]
      // Customer
        role === 'CUSTOMER'
      role === 'CUSTOMER'
        ? [
          {
            label: 'Dashboard',
            path: '/customer/dashboard',
            icon: <PiSquaresFourLight size={18} />,
          },
          // {
          //   label: 'Registeration',
          //   path: '/customer/customerregisterc',
          //   icon: <RegistrationIcon size={18} />,
          // },
          {
            label: 'Customer Profile',
            path: '/customer/profile',
            icon: <ProfileIcon size={18} />,
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

          // {
          //   label: 'Direct Customer',
          //   path: '/customer/directcustomer',
          //   icon: <NetworkIcon size={18} />,
          // },
          // {
          //   label: 'Generation Tree',
          //   path: '/customer/gentree',
          //   icon: <FaNetworkWired size={18} />,
          // },
          {
            label: 'Activate ID',
            path: '/customer/topup',
            icon: <PiSquaresFourLight size={18} />,
            subRoutes: [

              {
                label: 'Activate ID Wallet',
                path: '/customer/activatefromwallet',
              },
              {
                label: 'Activate history',
                path: '/customer/activateIdHistory',
              },
            ],
          },
          // {
          //   label: 'Award Reward',
          //   path: '/customer/awardreward',
          //   icon: <BiAward size={18} />,
          // },
          {
            label: 'Report',
            path: '/customer/reportc',
            icon: <ReportIcon size={18} />,
          },
          // {
          //   label: 'Lavrage',
          //   path: '/customer/helping',
          //   icon: <ReportIcon size={18} />,
          // },
          // {
          //   label: 'BDF',
          //   path: '/customer/royelty',
          //   icon: <PiSquaresFourLight size={18} />,
          // },
          // {
          //   label: 'Share Link',
          //   path: '/customer/customersidesharelink',
          //   icon: <PiSquaresFourLight size={18} />,
          // },
          {
            label: 'Wallet',
            path: '/customer/walletc',
            icon: <PiSquaresFourLight size={18} />,
            subRoutes: [
              {
                label: 'Wallet History',
                path: '/customer/walletc',
              },
              {
                label: 'Roi History',
                path: '/customer/roiHistory',
              },
              {
                label: 'Wallet Address',
                path: '/customer/addwallet',
              },
              {
                label: 'Wallet income',
                path: '/customer/walletincome',
              },
            ],
          },
          {
            label: 'Withdrawal',
            path: '/customer/withdraw',
            icon: <PiSquaresFourLight size={18} />,
            subRoutes: [
              {
                label: 'Withdrawal',
                path: '/customer/withdraw',
              },
              {
                label: 'Withdrawal History',
                path: '/customer/withdrawhistory',
              },
            ],
          },

          // {
          //   label: ' Payout History',
          //   path: '/customer/historypayout',
          //   icon: <PiSquaresFourLight size={18} />,
          // },
          // {
          //   label: 'Withdraw Amount',
          //   path: '/customer/withdraw',
          //   icon: <PiSquaresFourLight size={18} />,
          // },
          {
            label: 'fund transfer',
            path: '/customer/custmerfundtransfer',
            icon: <PiSquaresFourLight size={18} />,
            subRoutes: [
              {
                label: 'fund transfer',
                path: '/customer/custmerfundtransfer',
              },
              {
                label: 'Transfer History',
                path: '/customer/fundTransferHistory',
              },
            ],
          },
          {
            label: 'E-Pin',
            path: '/customer/epinc',
            icon: <PiNavigationArrowFill size={18} />,

          },
          {
            label: 'Fund Request',
            path: '/customer/epinc',
            icon: <PiNavigationArrowFill size={18} />,
            subRoutes: [
              {
                label: 'Fund Request',
                path: '/customer/epinc',
              },
              {
                label: 'request History',
                path: '/customer/fundrequestHistory',
              },
            ],
          },
          // {
          //   label: 'Repurchase Product',
          //   path: '/customer/repurchaseproduct',
          //   icon: <MdOutlineProductionQuantityLimits size={18} />,
          // },
        ]
        : [];

  const location = useLocation();
  const { pathname } = location;
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );
  const handleLinkClick = () => {
    // Close the sidebar when a link is clicked
    setSidebarOpen(false);
  };
  // close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const { target } = event;
      const { target } = event;

      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`lg:to-gray-50 absolute left-0 top-0 z-[9999] flex h-screen w-64 flex-col overflow-y-hidden bg-white shadow-xl duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 lg:bg-gradient-to-b lg:from-white lg:dark:from-boxdark lg:dark:to-boxdark/95 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      className={`lg:to-gray-50 absolute left-0 top-0 z-[9999] flex h-screen w-64 flex-col overflow-y-hidden bg-white shadow-xl duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 lg:bg-gradient-to-b lg:from-white lg:dark:from-boxdark lg:dark:to-boxdark/95 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="border-gray-200/70 dark:border-gray-800 flex items-center justify-between gap-2 border-b px-5 py-4">
        <Link
          to="/"
          className="hover:bg-gray-100 dark:hover:bg-gray-800 group flex h-16 w-auto items-center justify-start space-x-3 rounded-xl px-3 py-2 transition-all"
        >
          <div className="flex items-center justify-center overflow-hidden rounded-xl p-2 shadow-sm transition-transform group-hover:scale-105">
            <img
              src={logo}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 w-8 items-center justify-center rounded-lg transition-all dark:hover:text-white lg:hidden"
        >
          <FaArrowLeftLong
            className={`fill-current transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
            size={16}
          />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-6 px-4">
          <div>
            <ul className="mb-6 flex flex-col gap-2">
              {sidebarRoutes.map((route, index) =>
                route.subRoutes ? (
                  <SidebarLinkGroup
                    key={index}
                    activeCondition={pathname.includes(route.path!)}
                  >
                    {(handleClick, open) => (
                      <>
                        <Link
                          to=""
                          className={`text-gray-700 dark:text-gray-300 group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${pathname.includes(route.path!) &&
                          className={`text-gray-700 dark:text-gray-300 group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${pathname.includes(route.path!) &&
                            'bg-primary/10 text-primary dark:bg-primary/20'
                            }`}
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <span className="text-xl transition-transform group-hover:scale-110">
                            {route.icon}
                          </span>
                          <span className="flex-1">{route.label}</span>
                          <IoIosArrowDown
                            className={`transition-all duration-300 ${open ? 'rotate-180' : ''
                              }`}
                            size={18}
                          />
                        </Link>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                          <ul className="mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
                            {route.subRoutes.map((subRoute, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  to={subRoute.path}
                                  className="text-gray-600 dark:text-gray-400 group relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:bg-primary/10 hover:pl-6 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
                                  activeProps={{
                                    className:
                                      '!text-primary !bg-primary/10 dark:!bg-primary/20',
                                  }}
                                  onClick={handleLinkClick}
                                >
                                  <span className="bg-gray-400 h-1.5 w-1.5 rounded-full transition-all group-hover:w-3 group-hover:bg-primary"></span>
                                  {subRoute.label}
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
                      className={`text-gray-700 dark:text-gray-300 group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:bg-primary/10 hover:pl-6 hover:text-primary dark:hover:bg-primary/20 ${pathname.includes(route.path) &&
                      className={`text-gray-700 dark:text-gray-300 group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:bg-primary/10 hover:pl-6 hover:text-primary dark:hover:bg-primary/20 ${pathname.includes(route.path) &&
                        'bg-primary/10 text-primary dark:bg-primary/20'
                        }`}
                        }`}
                      onClick={handleLinkClick}
                    >
                      <span className="text-xl transition-transform group-hover:scale-110">
                        {route.icon}
                      </span>
                      <span>{route.label}</span>
                      {pathname.includes(route.path) && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"></span>
                      )}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}

        {/* Optional Footer Section */}
        <div className="mt-auto p-4">
          <div className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-4">
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Need help? Check our documentation or contact support.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
