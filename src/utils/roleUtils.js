import { roles } from '../constants/roles.js';

export const isAdmin = user => user.role === roles.ADMIN;
