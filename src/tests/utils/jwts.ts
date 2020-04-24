// import { login } from '../utils/utils';
// import { testConstants } from './testConstants';
// import { generateJWTToken } from '../../services/Utils';

// const password = '123456';

// const jwts = {};

// export async function setJwts () {
//   const roles = [...Object.keys(testConstants.USERS)];
//   jwts['address_user'] = generateJWTToken({
//     pn: testConstants.ADDRESS_USER.mobile_number,
//     auu: testConstants.ADDRESS_USER.address_user_uuid,
//     s: 'address',
//   });
//   for (let role of roles) {
//     const j = await login(testConstants.USERS[role].mobile_number, password);
//     jwts[role] = j.access_token;
//   }

// }

// export function getJWT (role: string) {
//   return jwts[role];
// }
