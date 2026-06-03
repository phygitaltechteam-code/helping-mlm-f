/* eslint-disable */

// FROM TMS CHANGED

import {motion} from 'framer-motion';
import React from 'react';
import {FaPhone} from 'react-icons/fa';
import {FaLocationDot} from 'react-icons/fa6';
import {MdAlternateEmail} from 'react-icons/md';

const Contact: React.FC = () => {
  // Updated map URL with the correct address
  const mapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.8084422722947!2d73.8569787!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c068c8e6e6e1%3A0x8f8b6f6b6f6b6f6b!2sPune%2C%20Maharashtra%20411028!5e0!3m2!1sen!2sin!4v1724909582026!5m2!1sen!2sin';

  return (
    <div id="contact" className="text-gray-600 body-font relative">
      <h1 className="title-font pb-8 pt-20 text-center text-2xl font-semibold text-black sm:text-3xl">
        Get in Touch
      </h1>
      <p className="text-gray-500 mb-8 px-4 text-center text-base leading-relaxed lg:w-3/4 xl:w-2/4 mx-auto">
        For inquiries and collaborations, feel free to reach out. We're here to
        help you achieve your goals.
      </p>

      <section className="text-gray-600 body-font">
        <div className="container mx-auto px-5 pb-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center p-4 text-center">
              <div className="mb-5 inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-4xl text-indigo-500">
                <FaLocationDot />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 title-font mb-3 text-lg font-medium sm:text-xl">
                  Our Location
                </h2>
                <p className="text-base leading-relaxed">
             Flat No. S NO. 56 B wing Office No. 5 , Near Ambedkar Hotel ,
                Mantra Essence Commercial Pri , Pune, Maharashtra 411028
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center p-4 text-center">
              <div className="mb-5 inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-4xl text-indigo-500">
                <MdAlternateEmail />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 title-font mb-3 text-lg font-medium sm:text-xl">
                  Our Email Address
                </h2>
                <p className="text-base leading-relaxed">
                 happilylife2026@gmail.com
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center p-4 text-center">
              <div className="mb-5 inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-4xl text-indigo-500">
                <FaPhone />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 title-font mb-3 text-lg font-medium sm:text-xl">
                  Contact Number
                </h2>
                <p className="text-base leading-relaxed">+91 77698 22034</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.div
        initial={{opacity: 0, y: 50}}
        whileInView={{opacity: 1, y: 0}}
        exit={{opacity: 0}}
        transition={{duration: 0.7, delay: 0.1}}
        viewport={{once: false, amount: 0.2}}
        className="container mx-auto flex flex-wrap px-5 pb-24 pt-8 sm:flex-nowrap"
      >
        <div className="bg-gray-300 relative flex items-end justify-start overflow-hidden rounded-lg p-10 sm:mr-10 md:w-1/2 lg:w-2/3">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            frameBorder="0"
            title="map"
            scrolling="no"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3115.8820888753867!2d74.4594743!3d18.1402177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2938d7ff0d9b5%3A0x9f7f9e43a99f7c8e!2s18%C2%B008'24.8%22N%2074%C2%B027'43.4%22E!5e0!3m2!1sen!2sin!4v1724909582026!5m2!1sen!2sin"
          ></iframe>
          <div className="relative flex flex-wrap rounded bg-white py-6 shadow-md">
            <div className="px-6 lg:w-1/2">
              <h2 className="title-font text-gray-900 text-xs font-semibold tracking-widest">
                ADDRESS
              </h2>
              <p className="mt-1">
                18°08'24.8"N 74°27'43.4"E, Maharashtra, India
              </p>
            </div>
            <div className="mt-4 px-6 lg:mt-0 lg:w-1/2">
              <h2 className="title-font text-gray-900 text-xs font-semibold tracking-widest">
                EMAIL
              </h2>
              <a className="leading-relaxed text-indigo-500">
happilylife2026@gmail.com              </a>
              <h2 className="title-font text-gray-900 mt-4 text-xs font-semibold tracking-widest">
                PHONE
              </h2>
              <p className="leading-relaxed">+91 77698 22034</p>
            </div>
          </div>
        </div>

            {/* Feedback Form */}
            <div className="w-full lg:w-1/3">
              <div className="flex h-full w-full flex-col rounded-xl bg-white p-6 shadow-md sm:p-7 md:p-8">
                <h2 className="title-font mb-3 text-xl font-semibold text-purple-600 sm:mb-4 sm:text-2xl">
                  Feedback
                </h2>
                <p className="text-gray-600 mb-5 text-sm leading-relaxed sm:mb-6 sm:text-base">
                  Share your thoughts with us. Your feedback is valuable to help
                  us improve.
                </p>
                <form className="flex flex-col space-y-4 sm:space-y-5">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="text-gray-600 text-sm leading-7"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="bg-gray-50 text-gray-700 w-full rounded-lg border-0 px-4 py-2.5 text-sm leading-8 shadow-sm outline-none transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-purple-200 sm:text-base"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="text-gray-600 text-sm leading-7"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="bg-gray-50 text-gray-700 w-full rounded-lg border-0 px-4 py-2.5 text-sm leading-8 shadow-sm outline-none transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-purple-200 sm:text-base"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className="text-gray-600 text-sm leading-7"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="bg-gray-50 text-gray-700 h-32 w-full resize-none rounded-lg border-0 px-4 py-2.5 text-sm leading-6 shadow-sm outline-none transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-purple-200 sm:h-36 sm:text-base"
                      placeholder="Your message here..."
                    />
                  </div>
                  <button className="mt-2 transform rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-purple-700 focus:outline-none sm:text-base">
                    Send Feedback
                  </button>
                </form>
                <p className="text-gray-500 mt-4 text-center text-xs sm:mt-5">
                  Your feedback helps us improve. Thank you for taking the time to
                  share your thoughts with us.
                </p>
              </div>
            </div>

      </motion.div>
    </div>
  );
};

export default Contact;