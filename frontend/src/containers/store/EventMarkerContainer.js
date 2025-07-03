// 매장 목록 마커 표시 + 매장명
import {CustomOverlayMap, MapMarker, useMap} from "react-kakao-maps-sdk";
import {memo, useState} from "react";
// import {InfoWindow} from "react-kakao-maps-sdk/dist/components/InfoWindow";

const EventMarkerContainer = memo(({store, isSelected, onSelect}) => {
    const map = useMap();
    const [showInfo, setShowInfo] = useState(false);

    const markerImageSrc = isSelected
        ? "https://t1.daumcdn.net/mapjsapi/images/marker.png"
        : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    const markerContent  = (
        // <div style={{
        //     padding: "5px",
        //     color: "#000",
        //     textAlign: "center",
        //     backgroundColor: "white",
        //     border: "1px solid #ccc",
        //     borderRadius: "5px",
        //     fontSize: "12px",
        //     position: "absolute",
        //     bottom: "40px",
        //     left: "50%",
        //     transform: "translateX(-50%)",
        //     whiteSpace: "nowrap",
        //     zIndex: 10,
        //     boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        // }}>

            <span style={{color: "blue"}}>{store.storeName}</span>
        // </div>
    )


    return (
        <>
            <MapMarker
                position={{ lat: store.latitude, lng: store.longitude }}
                clickable={true} // 마커 클릭 가능하게 설정
                onClick={(marker) => {
                    map.panTo(marker.getPosition()); // 마커 클릭 시 지도를 해당 위치로 이동
                    onSelect(store); // 부모 컴포넌트의 handleStoreSelect 호출 (store 객체 전달)
                }}
                // onClick={() => onSelect(store)}
                image={{
                    src: markerImageSrc,
                    size: { width: 24, height: 35 },
                    options: { offset: { x: 12, y: 35 } },
                }}
                title={store.storeName}
                // content={store.storeName}
            >
                {isSelected  &&  markerContent}
                {/*{isSelected && (*/}
                {/*    <CustomOverlayMap*/}
                {/*        position={{ lat: store.latitude, lng: store.longitude }}*/}
                {/*        yAnchor={1.5}*/}
                {/*    >*/}
                {/*        <div style={{*/}
                {/*            padding: "10px",*/}
                {/*            color: "#000",*/}
                {/*            backgroundColor: "white",*/}
                {/*            border: "1px solid #ccc",*/}
                {/*            borderRadius: "8px",*/}
                {/*            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",*/}
                {/*            whiteSpace: "nowrap", // 줄바꿈 방지*/}
                {/*        }}>*/}
                {/*            {store.storeName}*/}
                {/*        </div>*/}
                {/*    </CustomOverlayMap>*/}
                {/*)}*/}
            </MapMarker>
        </>
    )
});

export default EventMarkerContainer