// utils/departments.js
// List of departments in VVIT University
export const departments = [
  'Computer Science and Engineering (CSE)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Information Technology (IT)',
  'Data Science (DS)',
  'Artificial Intelligence and Machine Learning (AIML)',
  'Cyber Security (CS)',
  'Business Administration (MBA)',
  'Master of Computer Applications (MCA)',
  'Appa',
];

export const getDepartmentCode = (department) => {
  const codes = {
    'Computer Science and Engineering (CSE)': 'CSE',
    'Electronics and Communication Engineering (ECE)': 'ECE',
    'Electrical and Electronics Engineering (EEE)': 'EEE',
    'Mechanical Engineering (ME)': 'ME',
    'Civil Engineering (CE)': 'CE',
    'Information Technology (IT)': 'IT',
    'Data Science (DS)': 'DS',
    'Artificial Intelligence and Machine Learning (AIML)': 'AIML',
    'Cyber Security (CS)': 'CS',
    'Business Administration (MBA)': 'MBA',
    'Master of Computer Applications (MCA)': 'MCA',
    'Appa': 'APPA',
  };
  return codes[department] || department.split('(')[1]?.replace(')', '') || 'GEN';
};
