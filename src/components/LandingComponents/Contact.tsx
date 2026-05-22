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
        <div className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {/* Location Card */}
              <div className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
                <div className="mb-4 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl text-indigo-500 sm:mb-5 sm:h-20 sm:w-20 sm:text-4xl">
                  <FaLocationDot />
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 title-font mb-2 text-base font-medium sm:mb-3 sm:text-lg md:text-xl">
                    Our Location
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed sm:text-base">
                    Flat No. S NO. 56 B wing Office No. 5, <br />
                    Near Ambedkar Hotel, <br />
                    Mantra Essence Commercial Pri, <br />
                    Pune, Maharashtra 411028
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
                <div className="mb-4 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl text-indigo-500 sm:mb-5 sm:h-20 sm:w-20 sm:text-4xl">
                  <MdAlternateEmail />
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 title-font mb-2 text-base font-medium sm:mb-3 sm:text-lg md:text-xl">
                    Our Email Address
                  </h2>
                  <p className="text-gray-600 break-all text-sm leading-relaxed sm:text-base">
                    Ganeshpirangute2151@gmail.com
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm transition-shadow duration-300 hover:shadow-md sm:col-span-2 sm:p-6 lg:col-span-1">
                <div className="mb-4 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl text-indigo-500 sm:mb-5 sm:h-20 sm:w-20 sm:text-4xl">
                  <FaPhone />
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 title-font mb-2 text-base font-medium sm:mb-3 sm:text-lg md:text-xl">
                    Contact Number
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed sm:text-base">
                    +91 77698 22034
                  </p>
                </div>
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
        className="px-4 pb-16 pt-6 sm:px-6 md:pb-20 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Map Section */}
            <div className="w-full lg:w-2/3">
              <div className="h-full overflow-hidden rounded-xl bg-white shadow-md">
                <div className="relative h-80 w-full sm:h-96 md:h-[450px]">
                  <iframe
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    frameBorder="0"
                    title="Location Map - Pune, Maharashtra"
                    scrolling="no"
                    src={mapUrl}
                    style={{border: 0}}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;