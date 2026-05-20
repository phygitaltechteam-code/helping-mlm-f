/* eslint-disable */
import React from 'react';
import {useAuthContext} from '@/context/AuthContext';

const WlcmLetter: React.FC = () => {
  const {user} = useAuthContext(); // get logged-in user
  console.log('user', user);

  if (!user) return <p className="py-8 text-center">No user data found</p>;

  return (
    // Replaced fixed 700px with responsive w-full and max-w-[700px]
    <div className="mx-auto w-full max-w-[700px] bg-white font-sans sm:p-4">
      {/* 
        Swapped <img> + absolute div for a background-image div.
        This ensures the background stretches with the text on mobile screens. 
      */}
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat px-5 py-10 shadow-sm sm:px-12 sm:py-12"
        style={{
          backgroundImage: "url('https://npspension.co.in/MemberPanel/images/welcome.jpg')",
        }}
      >
        {/* Logo in center top */}
        <div className="mt-8 text-center sm:mt-16">
          {/* Responsive font sizing */}
          <h5 className="font-[Cambria] text-2xl text-[#1f7ca7] sm:text-3xl">
            HAPPILY LIFE
          </h5>
          <p className="mt-1 text-xs sm:text-sm">www.happilylife.co.in</p>
        </div>

        {/* Title */}
        <h2 className="my-6 text-center text-xl font-bold text-[#e6860a] sm:my-8 sm:text-2xl">
          Congratulations
        </h2>

        {/* Name + ID */}
        <div className="mb-6 text-center text-sm sm:text-base">
          <p>
            <strong className="text-black">Name:</strong> {user.fullname}
          </p>
          {/* <p>
            <strong className="text-black">ID:</strong> {user.crnNo}
          </p> */}
        </div>

        {/* Letter Body */}
        <div className="rounded-lg bg-white/80 p-4 text-justify text-sm leading-relaxed text-black sm:p-6 sm:text-base">
          <p className="mb-4">
            Welcome to be a proud member of{' '}
            <strong className="text-[#e6860a]">HAPPILY LIFE</strong>. We
            really appreciate your faith in us. At{' '}
            <strong className="text-[#e6860a]">HAPPILY LIFE</strong> you
            will now realise that dreams are not that difficult and success is
            within your sight. You are now a part of the opportunity of the
            millennium.
          </p>

          <p className="mb-4">
            <strong className="text-[#e6860a]">HAPPILY LIFE</strong> is
            an exciting "People Business". A business that has the potential to
            turn your dreams into reality. As you build your business, you will
            establish lifelong friendships and develop support systems
            unparalleled in any other business.
          </p>

          <p className="mb-4">
            We are confident that you will receive gratification from your
            involvement with{' '}
            <strong className="text-[#e6860a]">HAPPILY LIFE </strong>
            and we wish you every success!
          </p>

          <p>
            Please note we are providing you an opportunity to earn money which
            is optional, your earnings will depend directly on the amount of
            effort you put to develop your business. For further details login
            on{' '}
            <strong className="text-[#e6860a]">
            https://happilylife.shop/
            </strong>{' '}
            with your userid and password.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-8 text-right sm:mt-12">
          <h4 className="text-sm font-semibold sm:text-base">Regards</h4>
          <h3 className="mt-1 text-base font-bold text-[#e6860a] sm:text-lg">
            HAPPILY LIFE
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WlcmLetter;