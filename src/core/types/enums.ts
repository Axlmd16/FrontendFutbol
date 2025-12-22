export const ROLE_VALUES = ['Administrator', 'Coach', 'Intern'] as const;
export type Role = (typeof ROLE_VALUES)[number];

export const SEX_VALUES = ['Male', 'Female', 'Other'] as const;
export type Sex = (typeof SEX_VALUES)[number];

export const SCALE_VALUES = ['Poor', 'Average', 'Good', 'Excellent'] as const;
export type Scale = (typeof SCALE_VALUES)[number];
