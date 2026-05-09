import React, { useEffect, useState } from 'react';
import {
  useApproveEpinRequest,
  useGetAllEpinRequests,
  useRejectEpinRequest,
} from '@/lib/react-query/Admin/Epin/epin';
import toast, { CheckmarkIcon } from 'react-hot-toast';
import { IoCloseCircleOutline } from 'react-icons/io5';
import EpinHistory from './EpinHistory';
import { useAuthContext } from '@/context/AuthContext';

const EpinApproval = () => {
  const { data } = useGetAllEpinRequests();
  console.log('Epin Requests :', data);

  const {
    mutate: rejectEpin,
    isSuccess: rejectSuccess,
    isError: rejectError,
  } = useRejectEpinRequest();

  const {
    mutate: approveEpin,
    isSuccess: approveSuccess,
    isError: approveError,
  } = useApproveEpinRequest();

  const [epinValues, setEpinValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const handleApprove = (item) => {
    const count = parseInt(epinValues[item.id]);

    if (!count || count <= 0) {
      toast.error('Enter valid count');
      return;
    }

    approveEpin({
      id: item.id,
      data: { epincount: count },
    });
  };

  const handleReject = (item) => {
    rejectEpin(item.id);
  };

  const handleEpinChange = (id, value) => {
    setEpinValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    console.log(epinValues);
  };

  const openModal = (image) => {
    console.log("MODAL IMAGE:", image);
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage('');
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (rejectSuccess) {
      toast.success('E-pin Request Rejected');
    }
    if (rejectError) {
      toast.error('Failed to reject E-pin Request');
    }
  }, [rejectSuccess, rejectError]);

  useEffect(() => {
    if (approveSuccess) {
      toast.success('E-pin Request Approved');
    }
    if (approveError) {
      toast.error('Failed to approve E-pin Request');
    }
  }, [approveSuccess, approveError]);

  const totalPages = Math.ceil((data?.length || 0) / recordsPerPage);

  const paginatedData = data?.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="rounded-sm bg-white px-5 pb-2.5 pt-6 shadow-default dark:bg-boxdark">
        <h1 className="mb-4 text-xl font-bold dark:text-white">
          Epin Approval Requests
        </h1>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {[
                  { label: 'Date & Time' },
                  { label: 'Customer Name' },
                  { label: 'CRN' },
                  { label: 'Requested Amount' },
                  { label: 'Image' },
                  { label: 'Approve Count' },
                  { label: 'Actions' },
                ].map((col, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 font-medium text-black dark:text-white"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.isArray(paginatedData) &&
                paginatedData.map((item) => {
                  console.log("IMAGE VALUE:", item.image);
                  console.log("FULL ITEM:", item);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-boxhoverdark"
                    >
                      <td className="px-4 py-2 dark:text-white">
                        {new Date(item.createdAt).toLocaleString('en-US')}
                      </td>

                      <td className="px-4 py-2 dark:text-white">
                        {item.customer?.user?.fullname || 'N/A'}
                      </td>

                      <td className="px-4 py-2 dark:text-white">
                        {item.customer?.crnNo || 'N/A'}
                      </td>

                      <td className="px-4 py-2 dark:text-white">
                        {item.paidAmount}
                      </td>

                      <td className="px-4 py-2 dark:text-white">
                        <img
                          src={item.image}
                          alt="Request"
                          className="h-12 w-12 cursor-pointer rounded object-cover"
                          onClick={() => openModal(item.image)}
                          onError={(e) => {
                            console.log("IMAGE FAILED:", item.image);
                            e.currentTarget.style.display = "https://via.placeholder.com/100?text=No+Image";
                          }}
                        />
                      </td>

                      <td className="px-4 py-2 dark:text-white">
                        <input
                          type="number"
                          min="1"
                          placeholder="Count"
                          value={epinValues[item.id] || ''}
                          onChange={(e) =>
                            handleEpinChange(item.id, e.target.value)
                          }
                          className="w-20 rounded border px-2 py-1 text-black"
                        />
                      </td>

                      <td className="px-4 py-2 dark:text-white">
                        <div className="flex items-center space-x-4">
                          <button
                            className="bg-green-500 px-2 py-2 text-white"
                            onClick={() => handleApprove(item)}
                          >
                            <CheckmarkIcon className="h-5 w-5" />
                          </button>

                          <button
                            className="bg-red-500 px-2 py-2 text-white"
                            onClick={() => handleReject(item)}
                          >
                            <IoCloseCircleOutline className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            onClick={closeModal}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                alt="Large View"
                className="max-h-[90vh]"
                onError={() =>
                  console.log("MODAL IMAGE FAILED:", selectedImage)
                }
              />
              <button onClick={closeModal}>✕</button>
            </div>
          </div>
        )}
      </div>

      <EpinHistory />
    </>
  );
};

export default EpinApproval;