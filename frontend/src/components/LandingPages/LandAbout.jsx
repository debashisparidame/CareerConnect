import React from 'react';
import Student from '../../assets/student.jpg';
import TPO from '../../assets/tpo.jpg';
import Management from '../../assets/management.jpg';
import Admin from '../../assets/admin.jpg';

function LandAbout() {
  const roles = [
    {
      title: "Student",
      image: Student,
      description:
        "Students can register, explore job opportunities, apply for jobs, and track application status with a personalized dashboard.",
    },
    {
      title: "TPO (Training & Placement Officer)",
      image: TPO,
      description:
        "TPOs manage company data, job postings, application reviews, and generate insightful reports for placement tracking.",
    },
    {
      title: "Management",
      image: Management,
      description:
        "Management can monitor overall placement activities, review analytics, and control system access and quality assurance.",
    },
    {
      title: "Super User (Admin)",
      image: Admin,
      description:
        "Admins handle all roles with super privileges—managing users, system settings, and ensuring smooth operations across modules.",
    },
  ];

  return (
    <div
      id="about"
      className="py-10 bg-gradient-to-tr from-pink-100 via-purple-100 to-pink-100 scroll-mt-24"
    >
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-4xl font-bold md:text-5xl playfair">About CPMS</h2>
        <p className="max-w-3xl px-3 mx-auto text-gray-700 text-md md:text-lg">
          Developed by final year MCA students of KIIT University, College Placement Portal is a powerful web-based platform to streamline and manage campus placements efficiently.
        </p>
      </div>

      <div className="flex flex-wrap items-stretch justify-center gap-10">
        {roles.map((role, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center transition duration-300 transform bg-white border border-gray-200 shadow-lg rounded-xl w-80 max-md:py-3 max-md:px-2 md:p-5 hover:scale-105"
          >
            <img
              src={role.image}
              alt={role.title}
              className="object-cover w-48 h-48 border-4 border-green-300 rounded-full shadow-md"
            />
            <h3 className="mt-4 mb-2 text-xl font-semibold text-center text-green-700 md:text-2xl">{role.title}</h3>
            <p className="text-sm text-center text-gray-600">{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandAbout;
