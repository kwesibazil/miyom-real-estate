import debounce from 'lodash/debounce';
import {useNavigate, NavLink} from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { IoMdSearch, IoMdClose } from "react-icons/io";


import { useAppDispatch, useAppSelector } from '@hooks/useRedux.hook';
import { selectProperty } from "@store/features/property/PropertySlice.store";
import { selectSideNavCollapse, openSideNav, closeSideNav } from "@store/features/display/DisplaySlice.store";

import { selectInvestor } from '@store/features/auth/AuthSlice.store';

import { IoIosArrowForward } from "react-icons/io";
import NoResultImage from "@components/skelton/NoResult";
import { Property } from "@store/features/property/propertyStore.interface";

import defaultHouse from '@assets/images/default-house.jpg'
import './search-input.css';


import { Investor } from '@store/features/auth/authStore.interface';

enum  searchType {
  property = 'property',
  investor = 'investor',                                                                  
}

interface FilteredList {
  data: Property | Investor
  type: searchType
}

function SearchBar():React.JSX.Element{
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSideNavCollapse); 
  const investors = useAppSelector(selectInvestor);
  const properties:Property[] | null = useAppSelector(selectProperty);

  const [isSearching, setIsSearching] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredProperties, setFilteredProperties] = useState<FilteredList[] | null>(null)
  
  useEffect(()=>{
    if(!isOpen)clearSearch()
  },[isOpen])


  const clearSearch = () => {
    setSearchTerm('')
  }

  const handleFocus = useCallback(() => { 
    dispatch(openSideNav());
  }, [dispatch]);

  
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setSearchTerm(event.target.value);
    handleSearch(event.target.value);
  }


  const closeSideNavBar = useCallback(()=>{
    if (isOpen && window.innerWidth < 992) {
      dispatch(closeSideNav())
    }
    clearSearch()
  },[])



  const handleKeyDown = async(event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchTerm('');
      const target = filteredProperties && filteredProperties[0];

      if(target){
        const url = target.type === searchType.property
          ? `property/:${target.data._id}`
          : `/investor/${target.data._id}`
        
          navigate(url);
      }
    }
  };


;


  const handleSearch = useCallback(
    debounce((term: string) => {
      setIsSearching(true);
      const results: FilteredList[] = [];
  
      if (!term) {
        setFilteredProperties(null);
        setIsSearching(false);
        return;
      }
  
      const lowerTerm = term.toLowerCase();
  
      // Search Properties
      properties?.forEach((property: Property) => {
        if (property.title.toLowerCase().includes(lowerTerm)) {
          results.push({
            data: property,
            type: searchType.property
          });
        }
      });
  
      investors?.forEach((investor: Investor) => {
        const match =
          investor.email.toLowerCase().includes(lowerTerm) ||
          investor.firstName?.toLowerCase().includes(lowerTerm) ||
          investor.lastName?.toLowerCase().includes(lowerTerm);
  
        if (match) {
          results.push({
            data: investor, 
            type: searchType.investor
          });
        }
      });
  
      setFilteredProperties(results);
      setIsSearching(false);
    }, 500),
    [properties, investors]
  );
  

  return(
    <div className="search-input-container">
      <IoMdSearch className="search-icon fs-6"/>
      <input 
        name="search" 
        type="search" 
        autoComplete="off"
        value={searchTerm}
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="search by property" 
        className={`${isOpen ? '': 'hide-place-holder'}`}
      />
      {
        (searchTerm && isOpen) &&
        <>
          <IoMdClose onClick={clearSearch} className="search-close-icon" />
          <Feedback closeSideNavBar={closeSideNavBar} isSearching={isSearching} filteredProperties={filteredProperties} />
        </>
      }
    </div>
  )
}




const Feedback = ({isSearching, filteredProperties, closeSideNavBar }: {isSearching:boolean, filteredProperties:FilteredList[] | null, closeSideNavBar: () => void}) => {
  const showSkelton =  (!filteredProperties || filteredProperties.length <= 0) ? true : false
  if (!isSearching && showSkelton) return <ResultSkelton />
  return (
    <div className="search-feedback">
      <div className="search-feedback-results w-100 h-100 d-flex flex-column ">
        {
          filteredProperties?.map((item:FilteredList) => (
            (item.type === searchType.investor) 
              ? <InvestorResult key={item.data._id} investor={item.data as Investor} closeSideNavBar={closeSideNavBar} />
              : <PropertyResult key={item.data._id} property={item.data as Property} closeSideNavBar={closeSideNavBar} />  
          ))
        }
      </div>
    </div>
  );
};

export default SearchBar


const PropertyResult = ({property, closeSideNavBar}: {property:Property, closeSideNavBar: () => void})=>{

  return(
    <NavLink  onClick={closeSideNavBar} to={`/property/${property._id}`}  key={property._id} className="property-search-card ">
      <div className='search-image-container'>
        <img src={property.imagesUrl?.[0]?.secureUrl || defaultHouse} alt="" />
      </div>
      <div className="property-search-card-body d-flex align-items-center">
        <span className="card-text text mx-2">{property.address.street},</span> 
        <span className="card-text me-2">{property.address.city},</span>
        <span className="card-text me-">{property.address.state}</span>
      </div>
      <div className='ms-2'>
        <IoIosArrowForward />
      </div>
    </NavLink>
  )
}


const InvestorResult = ({investor, closeSideNavBar}: {investor:Investor, closeSideNavBar:() => void}) =>{
  return(
    <NavLink to={`/investor/${investor._id}`} onClick={closeSideNavBar}  key={investor._id} className="property-search-card">
      <div className="property-search-card-body d-flex align-items-center">
        <div className='search-image-container'>
          <img src={investor.profileImgUrl.url} alt="" />
        </div>
        <span className="card-text text mx-2">{investor.email}</span> 
      </div>
      <IoIosArrowForward />
    </NavLink>
  )
}



const ResultSkelton = () => {
  return(
    <div className="search-feedback-empty">
      <div className='search-image-container '>
        <div className='image-container'>
          <NoResultImage />
        </div>
      </div>
      <p className="mt-2 mb-0 text-danger">No Result Found</p>
    </div>
  )
} 
