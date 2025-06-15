import axios from 'axios';

const path = "http://localhost:8080";

// 카테고리별 메뉴 조회하는 함수
export const fetchMenusByCategory = async (category) => {

    const formattedCategory = category.toUpperCase().replace("-", "_");
    const response = await axios.get(`${path}/api/menu?category=${formattedCategory}`);

    console.log('response 확인 : ', response);

    return response.data;
}


// 단일 메뉴 조회해서 옵션 선택에 사용될 함수
export const fetchMenuById = async (menuId) => {

    const response = await axios.get(`${path}/api/menu/option/${menuId}`);
    console.log('단일 메뉴 조회 데이터 확인 : ', response.data);

    return response.data;
};
