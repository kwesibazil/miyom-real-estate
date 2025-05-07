
import { OverviewData } from "../types/general.interface";
import { Investor } from "@store/features/auth/authStore.interface";
import { Property } from "../store/features/property/propertyStore.interface";
import { PropertyStatus } from "../store/features/property/propertyStore.interface";

import { IoConstruct } from "react-icons/io5";
import { GiMetalBar } from "react-icons/gi";
import { FaBuilding} from "react-icons/fa";
import { LuConstruction, LuHardHat } from "react-icons/lu";
import { GiTakeMyMoney } from "react-icons/gi";
import { GiClayBrick } from "react-icons/gi";


import { FaPeopleGroup } from "react-icons/fa6";
import { GiGoldBar } from "react-icons/gi";

export const validatePasswordAsync = (pwd:string): Promise<boolean> => {
  return new Promise((resolve, reject)=>{
		const criteria = {
			number: /\d/.test(pwd),
			lowercase: /[a-z]/.test(pwd),
			uppercase: /[A-Z]/.test(pwd),
			length: pwd.length >= 8 && pwd.length <= 30,
      validChars: /^[^<>{}]*$/.test(pwd)
		}

		const strength = Object.values(criteria).filter(Boolean).length
		strength === 5 ? resolve(true) : reject({name:"ValidationError"})
  })
}





export const delay = (ms = 200) => {
  return new Promise(resolve =>{
    return setTimeout(resolve, ms)
  })
}



export const convertToBase64 = (file:File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file)
  })
}





export function getMessageFromISODate(isoDateString:string) {
  const now = new Date();
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    return "Invalid date"; 
  }

  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return " less than a min ago";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} mins ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hrs ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}  days ago`;
  } else {
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `on ${month} ${day}, ${year}`;
  }
}




export const calculateKpiData = ( properties: Property[],investors: Investor[]): OverviewData => {
  
  const investorTotals: Record<string, number> = {};

  const totalUnderConstruction: string[] = [];
  const totalAwaitingInspection: string[] = [];
  const totalCompletedProperty: string[] = [];

  const goldInvestors = new Set<string>();
  const silverInvestors = new Set<string>();

  properties.forEach((property) => {
    const amount = property.amountInvested || 0;
    const status = property.status.toLowerCase();
    const investorId = property.investor._id;

    if (status === PropertyStatus.underConstruction) totalUnderConstruction.push(investorId);
    else if (status === PropertyStatus.awaitingInspection) totalAwaitingInspection.push(investorId);
    else if (status === PropertyStatus.completed) totalCompletedProperty.push(investorId);

    investorTotals[investorId] = (investorTotals[investorId] || 0) + amount;
  });

  // Ensure all investors are represented
  investors.forEach((investor) => {
    if (!(investor._id in investorTotals)) investorTotals[investor._id] = 0;
  });


  // Classify investors by tier
  for (const [id, amount] of Object.entries(investorTotals)) {
    if (amount > 1_000_000) goldInvestors.add(id);
    else if (amount > 500_000) silverInvestors.add(id);
  }


  const allInvestorIds = investors.map((inv) => inv._id);

  const finalCopperInvestors = allInvestorIds.filter(
    (id) => !goldInvestors.has(id) && !silverInvestors.has(id)
  );


  const totalInvestors = allInvestorIds.length;
  const totalAmountInvested = Object.values(investorTotals).reduce((sum, val) => sum + val, 0);

  return {
    overview: [
      {
        admin: false,
        title: 'under construction',
        ids: totalUnderConstruction,
        value: totalUnderConstruction.length,
        icon: <LuConstruction className="me-4 fs-1" />,
      },
      {
        admin: false,
        title: 'awaiting inspection',
        ids: totalAwaitingInspection,
        value: totalAwaitingInspection.length,
        icon: <LuHardHat className="me-4 fs-1" />,
      },
      {
        admin: false,
        title: 'completed',
        ids: totalCompletedProperty,
        value: totalCompletedProperty.length,
        icon: <FaBuilding className="me-4 fs-1" />,
      },
    ],
    fund: [
      {
        admin: true,
        title: 'Total investors',
        ids: allInvestorIds,
        value: totalInvestors,
        icon: <FaPeopleGroup className="me-4 fs-1" />,
      },
      {
        admin: true,
        title: 'Total Amount',
        ids: allInvestorIds,
        value: totalAmountInvested,
        icon: <GiTakeMyMoney className="me-4 fs-1" />,
      },
      {
        admin: true,
        title: 'Total Active Property',
        ids: [...totalAwaitingInspection, ...totalUnderConstruction],
        value: totalAwaitingInspection.length + totalUnderConstruction.length,
        icon: <IoConstruct className="me-4 fs-1" />,
      },
    ],
    investors: [
      {
        admin: true,
        title: 'Gold Investors',
        ids: Array.from(goldInvestors),
        value: goldInvestors.size,
        icon: <GiGoldBar className="me-4 fs-1" />,
      },
      {
        admin: true,
        title: 'Silver Investors',
        ids: Array.from(silverInvestors),
        value: silverInvestors.size,
        icon: <GiMetalBar className="me-4 fs-1" />,
      },
      {
        admin: true,
        title: 'Copper Investors',
        ids: finalCopperInvestors,
        value: finalCopperInvestors.length,
        icon: <GiClayBrick className="me-4 fs-1" />,
      },
    ],
  };
};
