

export interface DisplayState {
  sideNavCollapse: boolean;
  theme: 'light' | 'dark' | null;
  viewed:{[key: string]: boolean; },
  showForm: { [key in ModalForms]?: boolean };
}




export enum  ModalForms {
  CreateNewInvestorForm = 'CreateNewInvestorForm',
  CreateNewPropertyForm = 'CreateNewPropertyForm',
  UpdatePropertyForm = 'UpdatePropertyForm',
  UpdateInvestorForm = 'UpdateInvestorForm',
  UpdatePasswordForm = 'UpdatePasswordForm'
}


