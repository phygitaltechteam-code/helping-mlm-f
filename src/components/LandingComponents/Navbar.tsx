//FROM TMS CHANGED

// import Logo from '../../../public/ARClogo.png';
import React, {useState, useEffect} from 'react';
import {GiHamburgerMenu} from 'react-icons/gi';
import {RxCross2} from 'react-icons/rx';
import {Link} from 'react-scroll';
import {Link as Link2, useLocation} from '@tanstack/react-router';
import pdf from '../../assets/HappilyLife.pdf';

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
      const sections = ['home', 'hero', 'faq', 'testimonials', 'contact', 'termsandconditions'];
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
      <div className="mx-auto max-w-screen-xl px-4 py-4 md:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {/* Logo - Left on desktop */}
          <Link
            to="home"
            smooth={true}
            duration={500}
            offset={-80}
            className="flex cursor-pointer items-center"
            onClick={() => setActiveTab('home')}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-auto w-[120px] md:w-[140px] lg:w-[160px]"
            />
          </Link>

          {/* Navigation Items - Right on desktop */}
          <ul className="flex items-center space-x-1 lg:space-x-3">
            <li>
              <Link
                to="home"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('home')}
                className={`block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 ${getActiveStyles('home')}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="hero"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('hero')}
                className={`block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 ${getActiveStyles('hero')}`}
              >
                About
              </Link>
            </li>
            <li>
              <a
                href={pdf}
                download="businessplan.pdf"
                className="text-gray-700 block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700"
              >
                Business Plan
              </a>
            </li>
            <li>
              <Link
                to="faq"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('faq')}
                className={`block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 ${getActiveStyles('faq')}`}
              >
                FAQs
                
              </Link>
            </li>
            <li>
              <Link
                to="testimonials"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('testimonials')}
                className={`block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 ${getActiveStyles('testimonials')}`}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                onSetActive={() => setActiveTab('contact')}
                className={`block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 ${getActiveStyles('contact')}`}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link to="termsandconditions" 
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveTab('termsandconditions')}
              className={`block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 ${getActiveStyles('termsandconditions')}`}
              >
                Terms & Conditions
              </Link>
            </li>
            <Link2
              to="/signin"
              className={`block cursor-pointer rounded-md px-4 py-2.5 transition-all duration-300 ${
                isSignInPage || activeTab === 'signin'
                  ? 'border-b-2 border-purple-700 text-purple-700'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              Login
            </Link2>
          </ul>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="relative flex items-center justify-between md:hidden">
        {/* Logo - Centered on mobile */}
        <div className="absolute left-1/2 -translate-x-1/2 transform">
          <Link
            to="home"
            smooth={true}
            duration={500}
            offset={-80}
            className="flex cursor-pointer items-center"
            onClick={() => setActiveTab('home')}
          >
            <img src="/logo.png" alt="Logo" className="h-auto w-[80px]" />
          </Link>
        </div>

        {/* Menu Button - Right side */}
        <button
          type="button"
          className="text-gray-500 hover:bg-gray-100 focus:ring-gray-200 ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 focus:outline-none focus:ring-2"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">Open main menu</span>
          {!open ? <GiHamburgerMenu size={24} /> : <RxCross2 size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`${open ? 'block' : 'hidden'} mt-4 md:hidden`}>
        <ul className="bg-gray-50 flex flex-col items-center space-y-2 rounded-lg border border-stroke p-4">
          <li className="w-full">
            <Link
              to="home"
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveTab('home')}
              onClick={() => setOpen(false)}
              className={`block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 ${getActiveStyles('home')}`}
            >
              Home
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="hero"
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveTab('hero')}
              onClick={() => setOpen(false)}
              className={`block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 ${getActiveStyles('hero')}`}
            >
              About
            </Link>
          </li>
          <li className="w-full">
            <a
              href={pdf}
              download="businessplan.pdf"
              onClick={() => setOpen(false)}
              className="text-gray-700 block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 hover:bg-purple-50 hover:text-purple-700"
            >
              Business Plan
            </a>
          </li>
          <li className="w-full">
            <Link
              to="faq"
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveTab('faq')}
              onClick={() => setOpen(false)}
              className={`block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 ${getActiveStyles('faq')}`}
            >
              FAQs
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="testimonials"
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveTab('testimonials')}
              onClick={() => setOpen(false)}
              className={`block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 ${getActiveStyles('testimonials')}`}
            >
              Testimonials
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="contact"
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveTab('contact')}
              onClick={() => setOpen(false)}
              className={`block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 ${getActiveStyles('contact')}`}
            >
              Contact
            </Link>

          </li>
          
          <li className="w-full">
            <Link
              to="termsandconditions"
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveTab('termsandconditions')}
              onClick={() => setOpen(false)}
              className={`block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 ${getActiveStyles('termsandconditions')}`}
            >
              Terms & Conditions
            </Link>
          </li>
          
          <li className="w-full">
            <Link2
              to="/signin"
              onClick={() => setOpen(false)}
              className={`block cursor-pointer rounded-md px-4 py-2.5 text-center transition-all duration-300 ${
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
    </nav>
  );
};

export default Navbar;