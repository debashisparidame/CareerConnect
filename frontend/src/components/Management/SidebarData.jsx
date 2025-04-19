// Filename - components/SidebarData.js

import React from "react";
import { FaListUl } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine } from "react-icons/ri";
import { PiStudentDuotone } from "react-icons/pi";
import { FaClipboardCheck, FaIndustry, FaEnvelopeOpenText } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { LiaIndustrySolid } from "react-icons/lia";

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
    path: "/management/dashboard",
    icon: <EnhancedIcon icon={<AiFillHome size={18} />} colors="from-blue-500 to-blue-700" />
  },
  {
    title: "Students",
    icon: <EnhancedIcon icon={<PiStudentDuotone size={18} />} colors="from-green-500 to-teal-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    subNav: [
      {
        title: "List All",
        path: "/management/students",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-green-400 to-teal-600" />,
        cName: "sub-nav",
      },
      {
        title: "Approve",
        path: "/management/approve-student",
        icon: <EnhancedIcon icon={<FaClipboardCheck size={16} />} colors="from-green-400 to-teal-600" />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "TPO",
    icon: <EnhancedIcon icon={<GrUserWorker size={18} />} colors="from-purple-500 to-indigo-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,

    subNav: [
      {
        title: "List All",
        path: "/management/tpo-admin",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-purple-400 to-indigo-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/management/add-tpo-admin",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-purple-400 to-indigo-600" />,
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
        path: "/management/companys",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-orange-400 to-amber-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/management/add-company",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-orange-400 to-amber-600" />,
      },
    ],
  },
  {
    title: "Job Listings",
    icon: <EnhancedIcon icon={<FaIndustry size={18} />} colors="from-sky-500 to-blue-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,

    subNav: [
      {
        title: "List All",
        path: "/management/job-listings",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-sky-400 to-blue-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/management/post-job",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-sky-400 to-blue-600" />,
      },
    ],
  },
  {
    title: "Notice",
    icon: <EnhancedIcon icon={<FaEnvelopeOpenText size={18} />} colors="from-rose-500 to-pink-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,

    subNav: [
      {
        title: "List All",
        path: "/management/all-notice",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-rose-400 to-pink-600" />,
        cName: "sub-nav",
      },
      {
        title: "Send",
        path: "/management/send-notice",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-rose-400 to-pink-600" />,
      },
    ],
  },
];
