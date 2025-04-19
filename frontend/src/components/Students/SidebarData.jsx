// Filename - components/SidebarData.js

import React from "react";
import { AiFillHome } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine } from "react-icons/ri";
import { FaIndustry, FaListCheck, FaBuildingColumns, FaListUl, FaRegCalendarCheck } from "react-icons/fa6";

// Enhanced icon wrapper component with gradients
const EnhancedIcon = ({ icon, colors }) => (
  <div className="relative flex items-center justify-center p-1.5 rounded-md transition-all duration-300 group-hover:scale-110">
    <div className={`absolute inset-0 rounded-md opacity-80 bg-gradient-to-br ${colors} blur-[1px]`}></div>
    <div className="relative z-10 text-white">{icon}</div>
  </div>
);

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/student/dashboard",
    icon: <EnhancedIcon icon={<AiFillHome size={18} />} colors="from-blue-500 to-blue-700" />
  },
  {
    title: "Applied Jobs",
    path: "/student/myjob",
    icon: <EnhancedIcon icon={<FaRegCalendarCheck size={18} />} colors="from-green-500 to-emerald-700" />,
  },
  {
    title: "Placements",
    // path: "",
    icon: <EnhancedIcon icon={<FaIndustry size={18} />} colors="from-purple-500 to-indigo-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,

    subNav: [
      {
        title: "Placement Profile",
        path: "/student/placement-profile",
        icon: <EnhancedIcon icon={<ImProfile size={16} />} colors="from-purple-400 to-indigo-600" />,
        cName: "sub-nav",
      },
      {
        title: "Job Listings",
        path: "/student/job-listings",
        icon: <EnhancedIcon icon={<FaListCheck size={16} />} colors="from-purple-400 to-indigo-600" />,
      },
    ],
  },
  {
    title: "My Internship",
    icon: <EnhancedIcon icon={<FaBuildingColumns size={18} />} colors="from-orange-500 to-amber-700" />,
    iconClosed: <EnhancedIcon icon={<RiArrowDownSFill size={18} />} colors="from-gray-500 to-gray-700" />,
    iconOpened: <EnhancedIcon icon={<RiArrowUpSFill size={18} />} colors="from-gray-500 to-gray-700" />,

    subNav: [
      {
        title: "List All",
        path: "/student/internship",
        icon: <EnhancedIcon icon={<FaListUl size={16} />} colors="from-orange-400 to-amber-600" />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/student/add-internship",
        icon: <EnhancedIcon icon={<RiPlayListAddLine size={16} />} colors="from-orange-400 to-amber-600" />,
      },
    ],
  },
];
