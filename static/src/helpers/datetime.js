// src/helpers/datetime.js
export const toDatetimeLocalWithSeconds = (dateStr) => {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset); // Convertir a hora local
  return date.toISOString().slice(0, 19); // YYYY-MM-DDTHH:MM:SS
};

export default toDatetimeLocalWithSeconds;