import MenuDetailCom from "../../components/menu/MenuDetailCom";
import {useQuery} from "@tanstack/react-query";
import {fetchMenuById} from "../../service/menuService";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function MenuDetailCon({menuId}) {

    const [temperature, setTemperature] = useState('HOT');
    const [milk, setMilk] = useState('regular');
    const [ice, setIce] = useState('normal');
    const [water, setWater] = useState('normal');
    const [syrup, setSyrup] = useState(false);
    const [stevia, setStevia] = useState(false);
    const [extraShot, setExtraShot] = useState(0);
    // const [pickupTime, setPickupTime] = useState('');

    const navigate = useNavigate();


    const {
        data: menu,     // data라는 값을 menu라는 변수에 "할당" (즉, const menu = data; 와 같음)
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['menu', menuId],
        queryFn: () => fetchMenuById(menuId),
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return <p>메뉴 정보를 불러오는 중...</p>;
    if (isError) return <p>에러 발생: {error.message}</p>;


    // 샷 추가 함수
    const handleExtraShotChange = (change) => {
        setExtraShot(prevShot => {
            const newShot = prevShot + change;
            return Math.max(0, Math.min(newShot, 5));
        });
    };


    // 주문하기 버튼 클릭 핸들러
    const handleOrder = () => {
        const orderOptions = {
            menuId: menu.menuId,
            menuName: menu.menuName,
            menuPrice: menu.menuPrice,
            temperature,
            milk,
            ice,
            water,
            syrup,
            stevia,
            extraShot,
            // pickupTime
        };
        console.log("선택된 옵션:", orderOptions);
        
        navigate('/menu/select-store', { state: { orderOptions } });
    };



    return(
        <>
            <MenuDetailCom menu={menu}
                           temperature={temperature}
                           setTemperature={setTemperature}
                           milk={milk}
                           setMilk={setMilk}
                           ice={ice}
                           setIce={setIce}
                           water={water}
                           setWater={setWater}
                           syrup={syrup}
                           setSyrup={setSyrup}
                           stevia={stevia}
                           setStevia={setStevia}
                           extraShot={extraShot}
                           handleExtraShotChange={handleExtraShotChange}
                           // pickupTime={pickupTime}
                           // setPickupTime={setPickupTime}
                           handleOrder={handleOrder}
                />
        </>
    )
}

export default MenuDetailCon