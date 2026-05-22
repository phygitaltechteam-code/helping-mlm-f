import React, { useEffect, useState } from 'react';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import { useRegistration } from '@/context/RegisterContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useAuthContext } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const shareLinkSchema = z.object({
  leftLink: z.string().min(1, 'Link is required'),
  rightLink: z.string().min(1, 'Link is required'),
});

type FormValues = z.infer<typeof shareLinkSchema>;

interface SponsorInfoProps {
  onNext: () => void;
}

export const ShareRegistrationLink: React.FC<SponsorInfoProps> = ({ onNext }) => {
  const { user } = useAuthContext();
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(shareLinkSchema),
    defaultValues: {
      leftLink: '',
      rightLink: '',
    },
  });

  const { setValue } = methods;

  const fullname = user?.fullname
    ? user.fullname.replace(/\s/g, '_')
    : 'unknown_user';
  const crnNo = user?.crnNo || 'ARC000000';

  // const leftRegistrationLink = `https://arcinternational.live/register/${fullname}/${crnNo}/LEFT`;
  // const rightRegistrationLink = `https://arcinternational.live/register/${fullname}/${crnNo}/RIGHT`;

  const leftRegistrationLink = `https://localhost:5173/register/${fullname}/${crnNo}/LEFT`;
  const rightRegistrationLink = `https://localhost:5173/register/${fullname}/${crnNo}/RIGHT`;

  useEffect(() => {
    setValue('leftLink', leftRegistrationLink);
    setValue('rightLink', rightRegistrationLink);
  }, [user, setValue]);

  const onSubmit = (formValues: FormValues) => {
    console.log(formValues);
    if (onNext) onNext();
  };

  const handleCopyLeft = () => {
    navigator.clipboard.writeText(leftRegistrationLink);
    toast.success('Left side link copied to clipboard!');
    setCopiedLeft(true);
    setTimeout(() => setCopiedLeft(false), 2000);
  };

  const handleCopyRight = () => {
    navigator.clipboard.writeText(rightRegistrationLink);
    toast.success('Right side link copied to clipboard!');
    setCopiedRight(true);
    setTimeout(() => setCopiedRight(false), 2000);
  };

  const handleShareLeft = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Join My Network - Left Side',
          text: 'Register under my LEFT side using my referral link:',
          url: leftRegistrationLink,
        })
        .catch(console.error);
    } else {
      handleCopyLeft();
    }
  };

  const handleShareRight = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Join My Network - Right Side',
          text: 'Register under my RIGHT side using my referral link:',
          url: rightRegistrationLink,
        })
        .catch(console.error);
    } else {
      handleCopyRight();
    }
  };

  return (
    <FormProvider {...methods}>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border border-primary/20 bg-gradient-to-br from-white to-primary/5 p-8 shadow-lg dark:border-strokedark dark:bg-gradient-to-br dark:from-boxdark dark:to-boxdark-2"
      >
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 dark:bg-meta-4">
            <FiShare2 className="text-2xl text-primary dark:text-primary/80" />
          </div>
          <h1 className="text-gray-800 text-2xl font-bold dark:text-white">
            Share Registration Links
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Generate and share your unique referral links for both sides
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Side Link */}
          <div className="space-y-3 rounded-lg border border-primary/20 bg-white p-4 dark:border-strokedark dark:bg-boxdark/50">
            <div>
              <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                Left Side Referral Link
              </label>
              <div className="relative w-full">
                <div className="pr-12">
                  <GenericInputField name="leftLink" disabled />
                </div>

                <motion.button
                  type="button"
                  onClick={handleCopyLeft}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary dark:hover:text-primary/80 transition-colors"
                  whileHover={{}}
                  whileTap={{}}
                >
                  {copiedLeft ? (
                    <span className="text-xs font-medium text-secondary">
                      Copied!
                    </span>
                  ) : (
                    <FiCopy className="text-lg" />
                  )}
                </motion.button>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleShareLeft}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 font-medium text-white shadow-md transition-shadow hover:shadow-lg hover:shadow-primary/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiShare2 className="text-lg" />
              Share Left Link
            </motion.button>
          </div>

          {/* Right Side Link */}
          <div className="space-y-3 rounded-lg border border-primary/20 bg-white p-4 dark:border-strokedark dark:bg-boxdark/50">
            <div>
              <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                Right Side Referral Link
              </label>
              <div className="relative w-full">
                <div className="pr-12">
                  <GenericInputField name="rightLink" disabled />
                </div>

                <motion.button
                  type="button"
                  onClick={handleCopyRight}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary dark:hover:text-primary/80 transition-colors"
                  whileHover={{}}
                  whileTap={{}}
                >
                  {copiedRight ? (
                    <span className="text-xs font-medium text-secondary">
                      Copied!
                    </span>
                  ) : (
                    <FiCopy className="text-lg" />
                  )}
                </motion.button>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleShareRight}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 font-medium text-white shadow-md transition-shadow hover:shadow-lg hover:shadow-primary/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiShare2 className="text-lg" />
              Share Right Link
            </motion.button>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 dark:border-strokedark dark:bg-primary/10">
          <h3 className="flex items-center gap-2 font-medium text-primary dark:text-primary/80">
            <FiShare2 className="text-lg" />
            Sharing Tips
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-graydark dark:text-bodydark">
            <li>Share via WhatsApp, Email or Social Media</li>
            <li>Explain the benefits of joining your network</li>
            <li>Choose LEFT or RIGHT side based on your strategy</li>
          </ul>
        </div>
      </motion.form>
    </FormProvider>
  );
};
