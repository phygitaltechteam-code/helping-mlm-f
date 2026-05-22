//FROM TMS CHANGED

// import Logo from '../../../public/ARClogo.png';
import React, {useState, useEffect} from 'react';
import {BiLogoPlayStore} from 'react-icons/bi';
import {GiHamburgerMenu} from 'react-icons/gi';
import {RxCross2} from 'react-icons/rx';
import {Link} from 'react-scroll';
import {Link as Link2, useLocation} from '@tanstack/react-router';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const location = useLocation();
  const isSignInPage = location.pathname === '/signin';

  // Handle scroll spy for active tab
  useEffect(() => {
    if (isSignInPage) {
      setActiveTab('signin');
      return;
    }

    const handleScroll = () => {
      const sections = ['home', 'hero', 'faq', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const {offsetTop, offsetHeight} = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSignInPage]);

  // Get active styles with underline
  const getActiveStyles = (tabName: string) => {
    return activeTab === tabName
      ? 'text-purple-700 border-b-2 border-purple-700'
      : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50';
  };

  return (
    <nav className="start-0 top-0 z-20 w-full border-b border-stroke bg-white shadow-sm md:fixed">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="home"
          smooth={true}
          duration={500}
          offset={-80}
          className="flex cursor-pointer items-center space-x-3 rtl:space-x-reverse"
          onClick={() => setActiveTab('home')}
        >
          <img src="/logo.png" alt="Logo" width={60} />
        </Link>

        {/* Mobile Menu Button */}
        <div className="flex space-x-3 md:order-2 rtl:space-x-reverse">
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="text-gray-500 hover:bg-gray-100 focus:ring-gray-200 inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Open main menu</span>
            {!open ? <GiHamburgerMenu size={20} /> : <RxCross2 size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div
          className={`${
            open ? 'block' : 'hidden'
          } w-full md:order-1 md:flex md:w-auto`}
          id="navbar-sticky"
        >
          <ul className="bg-gray-50 mt-4 flex flex-col items-center rounded-lg border border-stroke p-4 font-medium md:mt-0 md:flex-row md:space-x-1 md:border-0 md:bg-transparent md:p-0 lg:space-x-2 rtl:space-x-reverse">
            {/* Home Tab */}
            <li className="w-full md:w-auto">
              <Link
                to="home"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('home')}
                onClick={() => {
                  setOpen(false);
                  setActiveTab('home');
                }}
                className={`block cursor-pointer rounded-md px-4 py-2 text-center transition-all duration-300 md:rounded-md ${getActiveStyles(
                  'home',
                )}`}
              >
                Home
              </Link>
            </li>

            {/* About Tab */}
            <li className="w-full md:w-auto">
              <Link
                to="hero"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('hero')}
                onClick={() => {
                  setOpen(false);
                  setActiveTab('hero');
                }}
                className={`block cursor-pointer rounded-md px-4 py-2 text-center transition-all duration-300 md:rounded-md ${getActiveStyles(
                  'hero',
                )}`}
              >
                About
              </Link>
            </li>

            {/* Business Plan Tab */}
            <li className="w-full md:w-auto">
              <a
                href="/businessplan.pdf"
                download="businessplan.pdf"
                onClick={() => setOpen(false)}
                className="text-gray-700 block cursor-pointer rounded-md px-4 py-2 text-center transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 md:rounded-md"
              >
                Business Plan
              </a>
            </li>

            {/* FAQs Tab */}
            <li className="w-full md:w-auto">
              <Link
                to="faq"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('faq')}
                onClick={() => {
                  setOpen(false);
                  setActiveTab('faq');
                }}
                className={`block cursor-pointer rounded-md px-4 py-2 text-center transition-all duration-300 md:rounded-md ${getActiveStyles(
                  'faq',
                )}`}
              >
                FAQs
              </Link>
            </li>

            {/* Testimonials Tab */}
            <li className="w-full md:w-auto">
              <Link
                to="testimonials"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('testimonials')}
                onClick={() => {
                  setOpen(false);
                  setActiveTab('testimonials');
                }}
                className={`block cursor-pointer rounded-md px-4 py-2 text-center transition-all duration-300 md:rounded-md ${getActiveStyles(
                  'testimonials',
                )}`}
              >
                Testimonials
              </Link>
            </li>

            {/* Contact Tab */}
            <li className="w-full md:w-auto">
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('contact')}
                onClick={() => {
                  setOpen(false);
                  setActiveTab('contact');
                }}
                className={`block cursor-pointer rounded-md px-4 py-2 text-center transition-all duration-300 md:rounded-md ${getActiveStyles(
                  'contact',
                )}`}
              >
                Contact
              </Link>
            </li>

            {/* Login Tab */}
            <li className="w-full md:w-auto">
              <Link2
                to="/signin"
                onClick={() => {
                  setOpen(false);
                  setActiveTab('signin');
                }}
                className={`block cursor-pointer rounded-md px-4 py-2 text-center transition-all duration-300 md:rounded-md ${
                  isSignInPage || activeTab === 'signin'
                    ? 'border-b-2 border-purple-700 text-purple-700'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                Login
              </Link2>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
