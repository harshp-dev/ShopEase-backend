import { roles } from '../constants/roles';

export const isAdmin = user => user.role === roles.ADMIN;
