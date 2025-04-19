import React from "react";
import { FaCheckSquare, FaUsers } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { GrUserManager, GrUserWorker } from "react-icons/gr";
import { FaListUl } from "react-icons/fa";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine } from "react-icons/ri";
import { PiStudentDuotone } from "react-icons/pi";
import { FaClipboardCheck, FaIndustry, FaEnvelopeOpenText } from "react-icons/fa";
import { LiaIndustrySolid } from "react-icons/lia";
import { FaUserSecret } from "react-icons/fa";

// Enhanced icon component with gradient background and effects
const EnhancedIcon = ({ icon, colors }) => (
  <div className="relative flex items-center justify-center p-1.5 rounded-md transition-all duration-300 group-hover:scale-110">
    <div className={`absolute inset-0 rounded-md opacity-80 bg-gradient-to-br ${colors} blur-[1px]`}></div>
    <div className="relative z-10 text-white">{icon}</div>
  </div>
);

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <EnhancedIcon icon={<AiFillHome size={18} />} colors="from-blue-500 to-blue-700" />
  },
  {
    title: "Management",
    icon: <EnhancedIcon icon={<FaUserSecret size={18} />} colors="from-purple-500 to-indigo-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    subNav: [
      {
        title: "List All",
        path: "/admin/management",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-purple-400 to-indigo-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/admin/add-management-admin",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-purple-400 to-indigo-600" />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "TPO",
    icon: <EnhancedIcon icon={<GrUserWorker size={18} />} colors="from-cyan-500 to-blue-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    subNav: [
      {
        title: "List All",
        path: "/admin/tpo",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-cyan-400 to-blue-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/admin/add-tpo-admin",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-cyan-400 to-blue-600" />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Student",
    icon: <EnhancedIcon icon={<PiStudentDuotone size={18} />} colors="from-green-500 to-teal-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    subNav: [
      {
        title: "List All",
        path: "/admin/student",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-green-400 to-teal-600" />,
        cName: "sub-nav",
      },
      {
        title: "Approve",
        path: "/admin/approve-student",
        icon: <EnhancedIcon icon={<FaClipboardCheck size={16} />} colors="from-green-400 to-teal-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/admin/add-student",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-green-400 to-teal-600" />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Company",
    icon: <EnhancedIcon icon={<LiaIndustrySolid size={18} />} colors="from-orange-500 to-amber-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    subNav: [
      {
        title: "List All",
        path: "/admin/companys",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-orange-400 to-amber-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/admin/add-company",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-orange-400 to-amber-600" />,
      },
    ],
  },
  {
    title: "Job Listings",
    icon: <EnhancedIcon icon={<FaIndustry size={18} />} colors="from-rose-500 to-pink-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,

    subNav: [
      {
        title: "List All",
        path: "/admin/job-listings",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-rose-400 to-pink-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/admin/post-job",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-rose-400 to-pink-600" />,
      },
    ],
  },
];
