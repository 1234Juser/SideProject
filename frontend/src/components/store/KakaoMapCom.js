import {Map, MapMarker, MapTypeControl, useMap} from "react-kakao-maps-sdk";
import {useRef, useState} from "react";

function KakaoMapCom({userLocation, storeList, handleStoreSelect, selectedStore}) {

    const mapRef = useRef(null)
    const [info, setInfo] = useState("")
    const [showInfo, setShowInfo] = useState(false)

    // userLocation이 없으면 기본 중심 좌표 설정 (예: 서울 시청)
    const defaultCenter = {
        lat: 37.5665,
        lng: 126.9780,
    };

    // 지도의 중심 좌표를 userLocation이 있으면 userLocation으로, 없으면 defaultCenter로 설정
    const mapCenter = userLocation
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : defaultCenter;

    // 지도 정보 얻어오기
    const getInfo = () => {
        const map = mapRef.current
        console.log("map 확인 : ", map);
        if (!map) return

        const center = map.getCenter()

        // 지도의 현재 레벨을 얻어옵니다
        const level = map.getLevel()

        // 지도타입을 얻어옵니다
        const mapTypeId = map.getMapTypeId()

        // 지도의 현재 영역을 얻어옵니다
        const bounds = map.getBounds()

        // 영역의 남서쪽 좌표를 얻어옵니다
        const swLatLng = bounds.getSouthWest()

        // 영역의 북동쪽 좌표를 얻어옵니다
        const neLatLng = bounds.getNorthEast()

        // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
        // const boundsStr = bounds.toString()

        let message = "지도 중심좌표는 위도 " + center.getLat() + ", <br>"
        message += "경도 " + center.getLng() + " 이고 <br>"
        message += "지도 레벨은 " + level + " 입니다 <br> <br>"
        message += "지도 타입은 " + mapTypeId + " 이고 <br> "
        message +=
            "지도의 남서쪽 좌표는 " +
            swLatLng.getLat() +
            ", " +
            swLatLng.getLng() +
            " 이고 <br>"
        message +=
            "북동쪽 좌표는 " +
            neLatLng.getLat() +
            ", " +
            neLatLng.getLng() +
            " 입니다"
        setInfo(message)
    }


    // 매장 목록 마커 표시 + 매장명
    const EventMarkerContainer = ({store, isSelected, onSelect}) => {
        const map = useMap();

        const markerImageSrc = isSelected
            ? "https://t1.daumcdn.net/mapjsapi/images/marker.png"
            : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";


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
            >
                {showInfo  && (
                    <div style={{
                        padding: "5px",
                        color: "#000",
                        textAlign: "center",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "12px",
                        position: "absolute",
                        bottom: "40px", // 마커 위로 띄우기
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap", // 줄바꿈 방지
                        zIndex: 10, // 다른 요소 위에 표시
                    }}>
                        <strong>{store.storeName}</strong><br />
                        {store.storeAddress}
                    </div>
                )}
            </MapMarker>
        )
    }



    return (
        <>
            <Map // 지도를 표시할 Container
                id="map"
                center={mapCenter}
                style={{
                    // 지도의 크기
                    width: "100%",
                    height: "550px",
                    marginBottom : "20px",
                }}
                level={3} // 지도의 확대 레벨
                ref={mapRef}
            >
                {/* 만약 특정 위치에 마커를 표시하고 싶다면 아래와 같이 추가할 수 있습니다. */}
                {userLocation && (
                    <MapMarker
                        position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                        image={{
                            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 사용자 위치 마커 이미지
                            size: { width: 30, height: 30 },
                            options: { offset: { x: 15, y: 30 } },
                        }}
                        title="현재 위치"
                    />
                )}

                {/* 매장 목록 마커 표시 */}
                {storeList && storeList.map(store => (
                    <EventMarkerContainer
                        key={store.storeId}
                        store={store}
                        isSelected={selectedStore && selectedStore.storeId === store.storeId}
                        onSelect={handleStoreSelect}
                    />
                ))}

                <MapTypeControl position={"TOPRIGHT"} />
                <button id="getInfoBtn" onClick={getInfo}>
                    맵정보 가져오기
                </button>
                <p
                    id="info"
                    dangerouslySetInnerHTML={{
                        __html: info,
                    }}
                />
            </Map>
        </>
    )
}

export default KakaoMapCom