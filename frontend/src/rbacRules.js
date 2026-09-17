export const ROLES = {
  ADMIN: 'Admin (Demo)',
  HR_LEADER: 'HR Leader',
  STAKEHOLDER: 'Business Stakeholder',
  EXECUTIVE: 'Executive',
};

export const ROUTE_PERMISSIONS = {
  '/dashboard': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.STAKEHOLDER, ROLES.EXECUTIVE],
  '/employees': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.STAKEHOLDER, ROLES.EXECUTIVE],
  '/performance': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.STAKEHOLDER, ROLES.EXECUTIVE],
  '/attendance': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.STAKEHOLDER, ROLES.EXECUTIVE],
  '/salary': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.EXECUTIVE],
  '/promotion': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.EXECUTIVE],
  '/attrition': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.STAKEHOLDER, ROLES.EXECUTIVE],
  '/risk': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.EXECUTIVE],
  '/retention': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.EXECUTIVE],
  '/predictive-insights': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.STAKEHOLDER, ROLES.EXECUTIVE],
  '/ai-assistant': [ROLES.ADMIN, ROLES.HR_LEADER, ROLES.STAKEHOLDER, ROLES.EXECUTIVE],
};
export const hasPermission = (userRole, allowedRoles = []) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
