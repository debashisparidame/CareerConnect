import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import UploadOfferLetter from './UploadOfferLetter';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { LiaEye } from "react-icons/lia";
import { PiEyeClosed } from "react-icons/pi";
import { BASE_URL } from '../../config/backend_url';

function UpdateJobStatus() {
  document.title = 'CareerConnect | Update Job Application Status';
  const navigate = useNavigate();

  const { jobId } = useParams();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  // for applicants of job 
  const [applicant, setApplicant] = useState({});
  // useState for load data
  const [currentUser, setCurrentUser] = useState({});

  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // for hovering on eye
  const [eyeIsHover, setEyeIsHover] = useState(false);

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  // check if hired 
  const [isHired, setHired] = useState(false);

  const closeModal = () => setShowModal(false);

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          first_name: res.data.first_name,
          middle_name: res.data.middle_name,
          last_name: res.data.last_name,
          email: res.data.email,
          number: res.data.number,
          role: res.data.role,
          uin: res.data.studentProfile.uin,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err);
        setShowToast(true);
      });
  }, []);

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)
        setShowToast(true);
        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${data.company}`);
      setCompany(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  }

  const fetchJobDetailsOfApplicant = async () => {
    if (data?.applicants?.length !== 0) {
      // Find if the student user has applied

      const appliedApplicant = await data.applicants.find(app => app.studentId === currentUser.id);
      // console.log(appliedApplicant)
      if (appliedApplicant) setApplicant(appliedApplicant) // If no applicant found, navigate to 404
      else navigate('../404');

      // if status is hired then set hired and show package input
      if (appliedApplicant.status === 'hired') setHired(true);
    }
  }

  const handleSubmit = async () => {
    if (applicant?.status === 'hired' && !applicant?.package) {
      setToastMessage("Package Offered Required!");
      setShowToast(true);
      return;
    }
    try {
      // console.log(applicant);
      const response = await axios.post(`${BASE_URL}/student/update-status/${jobId}/${currentUser.id}`, { applicant });
      // console.log(response.data);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        // Fetch updated applicant data to ensure state is current
        // await fetchJobDetail();
        // await fetchJobDetailsOfApplicant();
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error while update job status => ", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchJobDetail();
        if (data?.company) {
          await fetchCompanyData();
        }
        if (data?.applicants && currentUser?.id) {
          await fetchJobDetailsOfApplicant();
        }
        if (applicant.status === 'hired') setHired(true);
        setLoading(false);
      } catch (error) {
        setToastMessage("Error during fetching and applying job");
        setShowToast(true);
        console.error("Error during fetching and applying job:", error);
      }
    };

    fetchData();
  }, [currentUser?.id, data?.company, jobId]);

  // console.log(applicant)

  const handleApplicantChange = (e) => {
    setApplicant({
      ...applicant,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'status' && e.target.value === 'hired') setHired(true)
    if (e.target.name === 'status' && e.target.value !== 'hired') setHired(false)
  }


  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };


  const handleDelete = () => setShowModal(true);

  // delete offer letter 
  const confirmDelete = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/student/delete-offer-letter/${jobId}/${currentUser.id}`, { applicant });
      // console.log(response.data);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        setShowModal(false);
        // Fetch updated applicant data to ensure state is current
        await fetchJobDetail();
        await fetchJobDetailsOfApplicant();
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      setShowModal(false);
      console.log("Error while update job status => ", error);
    }
  }

  return (
    <>
      {/*  any message here  */}
      < Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {
        loading ? (
          <div className="flex items-center justify-center h-72">
            <i className="text-3xl fa-solid fa-spinner fa-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 my-6 text-base max-sm:grid-cols-1 max-sm:text-sm">
              <div className="flex flex-col gap-2">
                <div className="">
                  {/* Basic Details  */}
                  <Accordion defaultActiveKey={['0']} alwaysOpen className='w-full rounded shadow max-sm:w-fit'>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Basic Details</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          {/* company name  */}
                          <div className="flex flex-col justify-between py-2">
                            {/* Basic Info */}
                            <div className="flex justify-between">
                              <div className="space-y-4">
                                <div>
                                  <span className="font-bold text-gray-700">Full Name: </span>
                                  <span className="font-bold text-blue-500">
                                    {currentUser?.first_name + " "}
                                    {currentUser?.middle_name && currentUser?.middle_name + " "}
                                    {currentUser?.last_name}
                                  </span>
                                </div>

                                <div>
                                  <span className="font-bold text-gray-700">Email: </span>
                                  <span className="font-bold text-blue-500">
                                    {currentUser?.email}
                                  </span>
                                </div>

                                <div>
                                  <span className="font-bold text-gray-700">Number: </span>
                                  <span className="font-bold text-blue-500">
                                    {currentUser?.number}
                                  </span>
                                </div>

                                {
                                  currentUser?.uin && (
                                    <div>
                                      <span className="font-bold text-gray-700">UIN: </span>
                                      <span className="font-bold text-blue-500">
                                        {currentUser?.uin}
                                      </span>
                                    </div>
                                  )
                                }
                                <div>
                                  <span className="font-bold text-gray-700">Company Name: </span>
                                  <span className="font-bold text-blue-500">
                                    {company?.companyName}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-700">Job Title: </span>
                                  <span className="font-bold text-blue-500">
                                    {data?.jobTitle}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
              <div className="">
                {/* Job details  */}
                <Accordion defaultActiveKey={['1']} alwaysOpen className='w-full rounded shadow max-sm:w-fit'>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Job Details</Accordion.Header>
                    <Accordion.Body>
                      <div className="">
                        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                          {/* current round  */}
                          <FloatingLabel controlId="floatingSelectCurrentRound" label="Current Round">
                            <Form.Select
                              aria-label="Floating label select current round"
                              className='cursor-pointer'
                              name='currentRound'
                              value={applicant?.currentRound || "undefined"}
                              onChange={handleApplicantChange}
                            >
                              <option disabled value="undefined" className='text-gray-400'>Enter Current Round</option>
                              <option value="Aptitude Test">Aptitude Test</option>
                              <option value="Technical Interview">Technical Interview</option>
                              <option value="HR Interview">HR Interview</option>
                              <option value="Group Discussion">Group Discussion</option>
                            </Form.Select>
                          </FloatingLabel>
                          {/* round status  */}
                          <FloatingLabel controlId="floatingSelectRoundStatus" label="Round Status">
                            <Form.Select
                              aria-label="Floating label select round status"
                              className='cursor-pointer'
                              name='roundStatus'
                              value={applicant?.roundStatus || "undefined"}
                              onChange={handleApplicantChange}
                            >
                              <option disabled value="undefined" className='text-gray-400'>Enter Round Status</option>
                              <option value="pending">Pending</option>
                              <option value="passed">Passed</option>
                              <option value="failed">Failed</option>
                            </Form.Select>
                          </FloatingLabel>
                          {/* selection date */}
                          <FloatingLabel controlId="floatingSelectionDate" label="Selection Date">
                            <Form.Control
                              type="date"
                              placeholder="Selection Date"
                              name='selectionDate'
                              value={formatDate(applicant?.selectionDate)}
                              onChange={handleApplicantChange}
                            />
                          </FloatingLabel>
                          {/* joining date */}
                          <FloatingLabel controlId="floatingJoiningDate" label="Joining Date">
                            <Form.Control
                              type="date"
                              placeholder="Joining Date"
                              name='joiningDate'
                              value={formatDate(applicant?.joiningDate)}
                              onChange={handleApplicantChange}
                            />
                          </FloatingLabel>
                          <div className="flex flex-col items-center justify-center gap-2">

                            {/* offer letter upload */}
                            {/* sending jobId and function update applicant useState  */}
                            <UploadOfferLetter jobId={jobId} fetchJobDetailsOfApplicant={fetchJobDetailsOfApplicant} />
                            {
                              applicant?.offerLetter &&
                              <div className="flex items-center justify-between gap-1 cursor-pointer w-fit">
                                <span
                                  className='px-3 py-1 transition duration-300 ease-in-out bg-blue-500 rounded hover:bg-blue-700'
                                  onMouseEnter={() => setEyeIsHover(true)}
                                  onMouseLeave={() => setEyeIsHover(false)}
                                >
                                  <a
                                    className='flex items-center justify-center text-white no-underline'
                                    target="_blanck"
                                    href={BASE_URL + applicant?.offerLetter}
                                  >
                                    {
                                      eyeIsHover ? (
                                        <PiEyeClosed className='pr-2 text-3xl' />
                                      ) : (
                                        <LiaEye className='pr-2 text-3xl' />
                                      )
                                    }
                                    View Now
                                  </a>
                                </span>
                                {/* delete offer letter  */}
                                <span
                                  className='px-3 py-1 text-white transition-all duration-200 bg-red-500 rounded hover:bg-red-700'
                                  onClick={handleDelete}
                                  onMouseEnter={(e) => {
                                    const icon = e.target.querySelector('i');
                                    icon.classList.remove('fa-regular');
                                    icon.classList.add('fa-solid');
                                  }}
                                  onMouseLeave={(e) => {
                                    const icon = e.target.querySelector('i');
                                    icon.classList.add('fa-regular');
                                    icon.classList.remove('fa-solid');
                                  }}
                                >
                                  <i
                                    className="py-1 pr-2 text-lg fa-regular fa-trash-can"
                                  />
                                  Delete
                                </span>
                              </div>
                            }
                          </div>
                          {/* job status  */}
                          <FloatingLabel controlId="floatingSelectJobStatus" label="Job Status">
                            <Form.Select
                              aria-label="Floating label select job status"
                              className='cursor-pointer'
                              name='status'
                              value={applicant?.status || "undefined"}
                              onChange={handleApplicantChange}
                            >
                              <option disabled value="undefined" className='text-gray-400'>Enter Job Status</option>
                              <option value="applied">Applied</option>
                              <option value="interview">Interview</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Rejected</option>
                            </Form.Select>
                          </FloatingLabel>
                          {
                            isHired === true && (
                              <div className="col-span-2">
                                {/* selection date */}
                                <FloatingLabel controlId="floatingPackage" label={
                                  <>
                                    <span>Enter Package Offered <span className='text-red-500'>*</span></span>
                                  </>
                                }>
                                  <Form.Control
                                    type="number"
                                    step={0.01}
                                    placeholder="Enter Package Offered"
                                    name='package'
                                    value={applicant?.package}
                                    onChange={handleApplicantChange}
                                    required
                                  />
                                </FloatingLabel>
                              </div>
                            )
                          }
                        </div>
                        <div className="mt-3 mb-2">
                          <Button variant="primary" onClick={handleSubmit}>
                            <i className="pr-2 fa-solid fa-floppy-disk" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </>
        )
      }

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to delete offer letter?`}
        btn={"Delete"}
        confirmAction={confirmDelete}
      />
    </>
  )
}

export default UpdateJobStatus
