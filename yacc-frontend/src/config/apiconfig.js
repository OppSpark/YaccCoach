const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL,
    endpoints: {
      drugInfo: '/drugInfo'
    },
    defaultParams: {
      type: 'json'
    }
  };
  
  export default API_CONFIG;
  
