import axios from "axios"


const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {'X-Custom-Header': 'foobar'}
});



export default AxiosInstance;