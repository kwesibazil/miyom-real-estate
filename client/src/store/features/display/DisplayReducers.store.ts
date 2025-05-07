import { type PayloadAction } from '@reduxjs/toolkit';
import { type DisplayState } from "@store/features/display/displayStore.interface";



const toggleSideNav = (state: DisplayState) => {
  state.sideNavCollapse = !state.sideNavCollapse
}


const closeSideNav = (state: DisplayState) => {
  state.sideNavCollapse = false
}


const openSideNav = (state: DisplayState) => {
  state.sideNavCollapse = true
}



const toggleModal = (state: DisplayState, action: PayloadAction<keyof DisplayState['showForm']>) => {
  const modalName = action.payload;
  state.showForm[modalName] = !state.showForm[modalName];
};


const closeForm =(state: DisplayState, action: PayloadAction<keyof DisplayState['showForm']>) => {
  const modalName = action.payload;
  state.showForm[modalName] = false
};


const openForm = (state: DisplayState, action: PayloadAction<keyof DisplayState['showForm']>) => {
  const modalName = action.payload;
  state.showForm[modalName] = true;
};






const updateViewed = (state: DisplayState, action: PayloadAction<string> ) => {
  state.viewed[action.payload] = true  
}




const resetViewed = (state: DisplayState) => {
  state.viewed.dashboard = false
}


const resetDisplayState= (state: DisplayState) => {
  state.sideNavCollapse = false;
  state.viewed.dashboard = false  
}




const initTheme =  (state: DisplayState) => {
  if (state.theme === null) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = systemTheme ? 'dark' : 'light';
    state.theme = currentTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else{
    document.documentElement.setAttribute('data-theme', state.theme);
  }
}



const toggleTheme = (state: DisplayState) => {
  const newTheme = state.theme === 'light' ? 'dark' : 'light';
  state.theme = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
}



export default {openForm, closeForm, resetDisplayState, closeSideNav, openSideNav, toggleSideNav,toggleModal, toggleTheme, initTheme, resetViewed, updateViewed,}