import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

export default function useKakaoLoader() {
    console.log("Kakao Map API Key from .env:", process.env.REACT_APP_KAKAOMAP_KEY);

    useKakaoLoaderOrigin({
        appkey: process.env.REACT_APP_KAKAOMAP_KEY,
        libraries: ["clusterer", "drawing", "services"],
    })
}