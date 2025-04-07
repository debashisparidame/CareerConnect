import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { BASE_URL } from '../../config/backend_url';

function Home() {
  document.title = 'CareerConnect | Admin Dashboard';

  const [countUsers, setCountUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setCountUsers(response.data);
      } catch (error) {
        console.log("Home.jsx => ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-72">
          <i className="text-3xl fa-solid fa-spinner fa-spin max-sm:text-2xl" />
        </div>
      ) : (
        <div className="mt-10">
          <div className="flex flex-col flex-wrap items-center justify-center gap-20 ">
            <div className="flex flex-wrap items-center w-full gap-4 px-10  justify-evenly">
              <Link className='text-black no-underline' to='../admin/management'>
                <div className="flex flex-col items-center text-center transition-all ease-in-out border-2 border-gray-600 rounded-md shadow cursor-pointer bg-slate-300/30 h-44 w-60 justify-evenly hover:bg-slate-400/30 max-sm:h-32 max-sm:w-44">
                  <span className='text-3xl max-sm:text-2xl'>Management Admin</span>
                  <span className='text-3xl max-sm:text-2xl'>{countUsers.managementUsers}</span>
                </div>
              </Link>
              <Link className='text-black no-underline' to='../admin/tpo'>
                <div className="flex flex-col items-center text-center transition-all ease-in-out border-2 border-gray-600 rounded-md shadow cursor-pointer bg-slate-300/30 h-44 w-60 justify-evenly hover:bg-slate-400/30 max-sm:h-32 max-sm:w-44">
                  <span className='text-3xl max-sm:text-2xl'>TPO Admin</span>
                  <span className='text-3xl max-sm:text-2xl'>{countUsers.tpoUsers}</span>
                </div>
              </Link>
              <Link className='text-black no-underline' to='../admin/student'>
                <div className="flex flex-col items-center text-center transition-all ease-in-out border-2 border-gray-600 rounded-md shadow cursor-pointer bg-slate-300/30 h-44 w-60 justify-evenly hover:bg-slate-400/30 max-sm:h-32 max-sm:w-44">
                  <span className='text-3xl max-sm:text-2xl'>Student User</span>
                  <span className='text-3xl max-sm:text-2xl'>{countUsers.studentUsers}</span>
                </div>
              </Link>
              <div className="flex flex-col items-center text-center transition-all ease-in-out border-2 border-gray-600 rounded-md shadow cursor-pointer bg-slate-300/30 h-44 w-60 justify-evenly hover:bg-slate-400/30 max-sm:h-32 max-sm:w-44">
                <span className='text-3xl max-sm:text-2xl'>Superuser</span>
                <span className='text-3xl max-sm:text-2xl'>{countUsers.superUsers}</span>
              </div>
            </div>
            {
              countUsers.studentApprovalPendingUsers !== 0 &&
              (
                <div className="bg-red-500 rounded">
                  <Link className='text-black no-underline' to='../admin/approve-student'>
                    <div className="flex flex-col items-center text-center transition-all ease-in-out border-2 border-gray-600 rounded-md shadow cursor-pointer bg-slate-300/30 h-44 w-80 justify-evenly hover:bg-slate-400/30 max-sm:h-32 max-sm:w-56">
                      <span className='text-3xl max-sm:text-2xl'>
                        Student Approval Pending
                        <Badge bg="secondary" pill className='mx-2'>Action Needed</Badge>
                      </span>
                      <span className='text-3xl max-sm:text-2xl'>{countUsers.studentApprovalPendingUsers}</span>
                    </div>
                  </Link>
                </div>
              )
            }

          </div>
        </div>
      )
      }
    </>
  )
}

export default Home
