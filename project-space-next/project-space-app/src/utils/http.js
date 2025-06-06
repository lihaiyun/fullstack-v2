import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

// Response interceptor to handle errors globally
instance.interceptors.response.use(
    response => response,
    error => {
        // Handle specific error cases here
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error("Error response:", error.response.data);
            // Check status code for specific error handling
            if (error.response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                console.error("Unauthorized access - redirecting to login");
                // You can add your redirection logic here
                
            } else if (error.response.status === 403) {
                // Handle forbidden access
                console.error("Forbidden access - you do not have permission");
            } else if (error.response.status >= 500) {
                // Handle server errors
                console.error("Server error - please try again later");
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;
