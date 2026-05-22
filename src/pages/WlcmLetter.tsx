/* eslint-disable */
import React from 'react';
import {useAuthContext} from '@/context/AuthContext';

const WlcmLetter: React.FC = () => {
  const {user} = useAuthContext(); // get logged-in user
  console.log('user', user);

  if (!user) return <p className="py-8 text-center">No user data found</p>;

  return (
    <div className="mx-auto w-full max-w-[700px] bg-white font-sans sm:p-4">
      {/* Purple gradient header banner */}
      <div className="bg-gradient-to-r from-primary to-secondary px-5 py-6 text-center text-white sm:px-12 sm:py-8">
        <h5 className="font-[Cambria] text-2xl font-bold tracking-widest sm:text-3xl">
          HAPPILY LIFE
        </h5>
        <p className="mt-1 text-xs opacity-80 sm:text-sm">www.happilylife.online</p>
      </div>

      <div className="relative w-full bg-white px-2 py-10 sm:px-5 sm:py-5"
        style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #fff 60%, #fdf2fa 100%)' }}
      >
        {/* Decorative left accent bar */}

        {/* Title */}
        <h2 className="my-2 text-center text-xl font-bold text-primary sm:my-2 sm:text-2xl">
         Congratulations
        </h2>

        {/* Name */}
        <div className="mb-6 text-center text-sm sm:text-base">
          <p>
            <strong className="text-primary">Name:</strong>{' '}
            <span className="text-black">{user.fullname}</span>
          </p>
        </div>

        {/* Letter Body */}
        <div className="rounded-xl border border-primary/15 bg-white p-4 text-justify text-sm leading-relaxed text-gray-700 shadow-sm sm:p-6 sm:text-base">
          <p className="mb-4">
            Welcome to be a proud member of{' '}
            <span className="text-primary">HAPPILY LIFE</span>. We
            really appreciate your faith in us. At{' '}
            <span className="text-primary">HAPPILY LIFE</span> you
            will now realise that dreams are not that difficult and success is
            within your sight. You are now a part of the opportunity of the
            millennium.
          </p>

          <p className="mb-4">
            <span className="text-primary">HAPPILY LIFE</span> is
            an exciting "People Business". A business that has the potential to
            turn your dreams into reality. As you build your business, you will
            establish lifelong friendships and develop support systems
            unparalleled in any other business.
          </p>

          <p className="mb-4">
            We are confident that you will receive gratification from your
            involvement with{' '}
            <span className="text-primary">HAPPILY LIFE</span>{' '}
            and we wish you every success!
          </p>

          <p>
            Please note we are providing you an opportunity to earn money which
            is optional, your earnings will depend directly on the amount of
            effort you put to develop your business. For further details login
            on{' '}
            <strong className="text-secondary underline decoration-secondary/40">
              https://happilylife.online/
            </strong>{' '}
            with your userid and password.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-8 text-right sm:mt-12">
          <h4 className="text-sm font-semibold text-gray-500 sm:text-base">Regards,</h4>
          <h3 className="mt-1 text-base font-bold text-primary sm:text-lg">
            HAPPILY LIFE
          </h3>
          <p className="text-xs text-secondary">www.happilylife.co.in</p>
        </div>
      </div>

      {/* Footer strip */}
      <div className="bg-gradient-to-r from-primary to-secondary py-2 text-center">
        <p className="font-[Cambria] text-xs text-white opacity-90">
          www.happilylife.online
        </p>
      </div>
    </div>
  );
};

export default WlcmLetter;