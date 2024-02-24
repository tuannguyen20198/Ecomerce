export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");

export const fortmatMoney = (number) =>
  Number(number.toFixed(1)).toLocaleString();
