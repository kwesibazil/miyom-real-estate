import { useState, useEffect} from "react";
import { useAppSelector} from "@hooks/useRedux.hook";

import { calculateKpiData } from "@helpers/utils.helpers";
import { selectUser } from "@store/features/auth/AuthSlice.store";
import { selectInvestor } from "@store/features/auth/AuthSlice.store";
import { selectProperty } from "@store/features/property/PropertySlice.store";

import {OverviewData, TabData, Tabs} from "../../../types/general.interface";
// import './Dashboard.css'


export default function OverviewGrid() {
  const user = useAppSelector(selectUser);
  const investors = useAppSelector(selectInvestor)
  const properties = useAppSelector(selectProperty)

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.overview);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  
  useEffect(()=>{
    const kpiData:OverviewData = calculateKpiData(properties || [], investors || []);
    setOverviewData(kpiData);
  },[investors, properties])



  const handleTabClick = (tabName: Tabs) => {
    setActiveTab(tabName);
  };


  const admin = user?.userRole === 'admin'
  const showOverview =  (activeTab === Tabs.overview && overviewData)
  const showFundsTab =  (activeTab === Tabs.Funds && admin && overviewData)
  const showInvestorTab =  (activeTab === Tabs.investors && admin && overviewData)

  return(
    <div className="overview-grid">
      {
        admin &&  <TabButtons activeTab={activeTab} handleTabClick={handleTabClick} admin={admin}/>
      }
      <div className="overview-cards-container shadow ">
        {showOverview && <TabSection Tabs={overviewData.overview} />}
        {(showFundsTab) && <TabSection Tabs={overviewData.fund}/>}
        {showInvestorTab  && <TabSection Tabs={overviewData.investors} />}
      </div> 
    </div>
  )
}



const TabSection = ({ Tabs }: { Tabs: TabData[] }) => {
  return(
    <>{
      Tabs.map((tab:TabData) =>(
        <article key={tab.title} className="overview-card col-8 col-sm-7 col-md">
          <p className="fs-9 mb-0 text-capitalize">{tab.title}</p>
          <div className="d-flex gap-4 mt-3">
            <p className="fs-3 mb-0 fw-bold">{tab.value}</p>
          <div className="col-3 card-icon mb-1 ">{tab.icon}</div>
          </div>
        </article>
      ))
    }</>
  )
}



interface TabButtonsProps{
  admin: boolean
  activeTab: string;
  handleTabClick: (tabName: Tabs) => void
}


const TabButtons = ({activeTab, handleTabClick, admin}:TabButtonsProps) => {
  return(
    <div className="overview-tabs-container">
      {<button 
          className={`btn tabs-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabClick(Tabs.overview)}>
          {Tabs.overview}
        </button>}
      { admin &&
        <button 
          className={`btn tabs-btn ${activeTab === 'Funds' ? 'active' : ''}`}
          onClick={() => handleTabClick(Tabs.Funds)} >
          {Tabs.Funds}
        </button>} 
      {admin && 
        <button 
          className={`btn tabs-btn ${activeTab === 'Investors' ? 'active' : ''}`}
          onClick={() => handleTabClick(Tabs.investors)}>
          {Tabs.investors}
        </button>}
    </div>
  )
}