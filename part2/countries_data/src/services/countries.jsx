import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';

const getCountries = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching countries:', error);
      throw error;
    });
};

export default { getCountries };
