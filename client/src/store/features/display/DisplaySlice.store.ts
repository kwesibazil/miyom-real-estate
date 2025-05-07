import { createSlice} from "@reduxjs/toolkit";
import { type RootState} from "@store/store";

import { DisplayState } from "@store/features/display/displayStore.interface";
import reducer from './DisplayReducers.store';


const initialState: DisplayState = {
  theme: null,
  showForm: {
    CreateNewInvestorForm: false,
    CreateNewPropertyForm: false,
    UpdatePropertyForm: false,
    UpdateInvestorForm: false,
    UpdatePasswordForm: false,
  },
  sideNavCollapse: false,
  viewed:{
    dashboard: false
  },
}


const displaySlice = createSlice({
  name: 'display', 
  initialState,
  reducers: {
    openForm: reducer.openForm,
    closeForm: reducer.closeForm,
    openSideNav: reducer.openSideNav,
    closeSideNav: reducer.closeSideNav,
    initTheme: reducer.initTheme,
    toggleModal: reducer.toggleModal,
    resetViewed: reducer.resetViewed,
    toggleTheme: reducer.toggleTheme,
    updateViewed: reducer.updateViewed,
    toggleSideNav: reducer.toggleSideNav,
    resetDisplayState: reducer.resetDisplayState,
  },
})


export default displaySlice.reducer;

//selectors
export const selectTheme = (state:RootState) => state.display?.theme ?? null
export const selectAllForms = (state: RootState) => state.display?.showForm
export const selectSideNavCollapse = (state:RootState) => state.display?.sideNavCollapse ?? false;
export const selectDashboardViewed = (state:RootState) => state.display?.viewed?.dashboard ?? false;
export const selectForm = (name: keyof DisplayState['showForm']) => (state: RootState) => state.display?.showForm?.[name] ?? false;




//actions
export const { 
  initTheme,
  closeForm,
  toggleTheme,
  resetViewed, 
  updateViewed,
  toggleSideNav, 
  toggleModal,
  openSideNav,
  closeSideNav,
  openForm,
  resetDisplayState

} = displaySlice.actions;
