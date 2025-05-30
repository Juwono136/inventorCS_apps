let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// let days = [
//   "sunday",
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
// ];

export const getDay = (timestamp) => {
  let date = new Date(timestamp);

  return `${months[date.getMonth()]} ${date.getDate()} `;
};

export const getFullDay = (timestamp) => {
  let date = new Date(timestamp);

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
