
import { type PropertyState} from "./propertyStore.interface";
// import { Investor, User } from '../auth/authStore.interface';



const resetProperty = (state: PropertyState) => {
  state.properties = null;
  state.status = null;
}





// const setInvestors = (state: PropertyState) => {
//   const properties = state.properties;
//   const investorMap = new Map<string, any>();


//   if (properties){

//     for (const property of properties) {
//       const investor = property.investor;
      
//       if (investor && !investorMap.has(investor._id.toString())) {
//         investorMap.set(investor._id.toString(), {
//           _id: investor._id.toString(),
//           email: investor.email,
//           profileImgUrl: {
//             url: investor.profileImgUrl.url,
//             secureUrl: investor.profileImgUrl.secureUrl,
//             mime: investor.profileImgUrl.mime,
//             _id: investor.profileImgUrl._id,
//             filename: investor.profileImgUrl.filename || 'default-filename'
//           },
//           lastName: investor.lastName,
//           firstName: investor.firstName,
//           passwordMustChange: false,         
//           telephone: investor.telephone  
//         });
//       }
//     }
//     state.investors = Array.from(investorMap.values());
//   }
// };




export default { resetProperty};
// export default { resetProperty, setInvestors};