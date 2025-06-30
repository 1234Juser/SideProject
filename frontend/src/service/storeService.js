import axios from 'axios';

const path = "http://localhost:8080";

// 전체 매장 조회
export const getAllStores = async () => {

    const response = await axios.get(`${path}/api/stores/list`);
    console.log('전체 매장 조회 확인 : ', response.data);

    return response.data;
}