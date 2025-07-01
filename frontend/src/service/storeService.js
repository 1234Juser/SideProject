import axios from 'axios';

const path = "http://localhost:8080";

// 전체 매장 조회
export const getAllStores = async (latitude, longitude) => {

    try {
        const response = await axios.get(`${path}/api/stores/list`, {
            params : {
                latitude : latitude,
                longitude : longitude,
            }
        });
        console.log('전체 매장 조회 확인 : ', response.data);
        return response.data;

    } catch (error) {
        console.error("전체 매장 조회 실패 : ", error);
        throw error;
    }
}