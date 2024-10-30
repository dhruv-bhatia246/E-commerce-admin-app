const baseURL = "https://e-commerce-backend-umber-iota.vercel.app";
  
export const api = `${baseURL}/api`;

export const generatePublicUrl = (fileName) => {
  return `${baseURL}/public/${fileName}`
}