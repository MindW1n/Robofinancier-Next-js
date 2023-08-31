import axios from "axios"
const customAxios = globalThis.customAxios || axios.create({ baseURL: "http://localhost:3000" })

if(process.env.NODE_ENV === "production") globalThis.customAxios = customAxios

export default { axios: customAxios }