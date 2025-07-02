// 매장 목록 마커 표시 + 매장명
import {MapMarker, useMap} from "react-kakao-maps-sdk";
import {memo, useState} from "react";

const EventMarkerContainer = memo(({store, isSelected, onSelect}) => {
    const map = useMap();
    const [showInfo, setShowInfo] = useState(false);

    const markerImageSrc = isSelected
        ? "https://t1.daumcdn.net/mapjsapi/images/marker.png"
        : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    const markerContent  = (
        <strong>{store.storeName}</strong>
    )


    return (
        <MapMarker
            position={{ lat: store.latitude, lng: store.longitude }}
            clickable={true} // 마커 클릭 가능하게 설정
            onClick={(marker) => {
                    map.panTo(marker.getPosition()); // 마커 클릭 시 지도를 해당 위치로 이동
                    onSelect(store); // 부모 컴포넌트의 handleStoreSelect 호출 (store 객체 전달)
            }}// 마커 클릭 시 매장 선택 핸들러 호출
            image={{
                src: markerImageSrc,
                size: { width: 24, height: 35 },
                options: { offset: { x: 12, y: 35 } },
            }}
            title={store.storeName}
            onMouseOver={() => setShowInfo(true)}
            onMouseOut={() => setShowInfo(false)}
            content={store.storeName}
        >
            {showInfo  &&  markerContent}
        </MapMarker>
        )
});

export default EventMarkerContainer