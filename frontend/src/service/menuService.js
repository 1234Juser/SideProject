import axios from 'axios';

const path = "http://localhost:8080";

export const fetchMenusByCategory = async (category) => {

    const formattedCategory = category.toUpperCase().replace("-", "_");
    const response = await axios.get(`${path}/api/menu?category=${formattedCategory}`);

    console.log('response 확인 : ', response);

    return response.data;
}