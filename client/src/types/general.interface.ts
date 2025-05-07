export interface ToggleSideNavProp {
  isOpen?: boolean;
  handleToggle: (event: React.MouseEvent<Element>) => void
}


export enum  Tabs {
  overview = 'overview',
  Funds = 'Funds',                                     
  investors= 'Investors',                              
}

export interface TabSectionProps {
  Tabs:TabData[];
  show?: boolean;
}


export interface TabData {
  ids: string[]
  admin: boolean;
  title: string;
  value: number;
  icon: React.JSX.Element;
}


export interface OverviewData {
  fund: [TabData, TabData, TabData],
  overview: [TabData, TabData, TabData],
  investors:  [TabData, TabData, TabData],
}



export interface TableRowCount {
  end:number;
  start:number;
}

export interface TableIndexes {
  end:number;
  start:number;
}



export interface TablePagination {
  rows: number;
  tableLength: number;
  setIndexes: React.Dispatch<React.SetStateAction<TableIndexes>>;
}





export interface KPIs {
  totalGoldInvestor: string[];
  totalSilverInvestor: string[];
  totalCopperInvestor: string[];
  totalSoldProperty: string[];
  totalCompletedProperty: string[];
  totalUnderConstruction: string[]; 
  totalAwaitingInspection: string[];
  investorTotals: Record<string, number>;
}
