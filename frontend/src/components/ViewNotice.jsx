import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../config/backend_url';

function ViewNotice() {
  document.title = 'CareerConnect | Notice';
  const navigate = useNavigate();
  const noticeId = useParams();
  const [notice, setNotice] = useState({});

  const fetchNotice = async () => {
    try {
      if (!noticeId) return;
      const response = await axios.get(`${BASE_URL}/management/get-notice?noticeId=${noticeId.noticeId}`);
      // console.log(response?.data);
      setNotice(response?.data);
    } catch (error) {
      console.log("error while fetching notice => ", error);
    }
  }

  useEffect(() => {
    fetchNotice();
    if (notice === null) navigate('/404');
  }, [noticeId]);

  return (
    <>
      <div className="px-3 py-2 mx-2 my-4 text-base border rounded-lg shadow backdrop-blur-md bg-white/30 border-white/20 shadow-red-400 max-sm:text-sm">
        <div className="flex flex-col justify-between gap-2">
          <span className='my-3 text-2xl max-sm:my-1 max-sm:text-lg'>
            {notice?.title}
          </span>
          <span className='line-clamp-3'>
            {notice?.message}
          </span>
          <span className='my-1 text-right text-gray-400'>
            {new Date(notice?.createdAt).toLocaleDateString('en-IN') + " " + new Date(notice?.createdAt).toLocaleTimeString('en-IN')}
          </span>
        </div>
      </div>
    </>
  )
}

export default ViewNotice
