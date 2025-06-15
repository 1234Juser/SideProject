import {
    MenuDescription,
    MenuDetailContainer,
    MenuImage,
    MenuInfo, MenuLabel,
    MenuName, MenuOptionGroup,
    MenuPrice, MenuRadioGroup, MenuSelect, OrderButton
} from "../../style/menu/StyleMenuDetail";
import {useState} from "react";

function MenuDetailCom({ menu }) {
    const [temperature, setTemperature] = useState('HOT');
    const [milk, setMilk] = useState('regular');
    const [ice, setIce] = useState('normal');
    const [water, setWater] = useState('normal');
    const [syrup, setSyrup] = useState(false);
    const [stevia, setStevia] = useState(false);
    const [extraShot, setExtraShot] = useState(0);
    const [pickupTime, setPickupTime] = useState('');

    return (
        <MenuDetailContainer>
            <MenuImage src={`http://localhost:8080${menu.menuImageUrl}`} alt={menu.menuName} />
            <MenuInfo>
                <MenuName>{menu.menuName}</MenuName>
                <MenuDescription>{menu.menuDescription}</MenuDescription>
                <MenuPrice>{menu.menuPrice.toLocaleString()}원</MenuPrice>

                <MenuOptionGroup>
                    <MenuLabel>온도</MenuLabel>
                    <MenuRadioGroup>
                        <label><input type="radio" name="temp" value="HOT" checked={temperature === 'HOT'} onChange={() => setTemperature('HOT')} /> HOT</label>
                        {menu.menuIsIceAvailable && (
                            <label><input type="radio" name="temp" value="ICE" checked={temperature === 'ICE'} onChange={() => setTemperature('ICE')} /> ICE</label>
                        )}
                    </MenuRadioGroup>

                    <MenuLabel>우유 선택</MenuLabel>
                    <MenuSelect value={milk} onChange={(e) => setMilk(e.target.value)}>
                        <option value="regular">일반우유</option>
                        <option value="lowfat">무지방우유</option>
                        <option value="oat">오트밀크</option>
                    </MenuSelect>

                    <MenuLabel>얼음량</MenuLabel>
                    <MenuSelect value={ice} onChange={(e) => setIce(e.target.value)}>
                        <option value="less">적게</option>
                        <option value="normal">보통</option>
                        <option value="more">많이</option>
                    </MenuSelect>

                    <MenuLabel>물양</MenuLabel>
                    <MenuSelect value={water} onChange={(e) => setWater(e.target.value)}>
                        <option value="less">적게</option>
                        <option value="normal">많이</option>
                    </MenuSelect>

                    <MenuLabel><input type="checkbox" checked={syrup} onChange={() => setSyrup(!syrup)} /> 시럽 추가</MenuLabel>
                    <MenuLabel><input type="checkbox" checked={stevia} onChange={() => setStevia(!stevia)} /> 스테비아로 변경</MenuLabel>

                    <MenuLabel>샷 추가</MenuLabel>
                    <input type="number" min="0" max="5" value={extraShot} onChange={(e) => setExtraShot(Number(e.target.value))} />

                    <MenuLabel>픽업 시간 선택</MenuLabel>
                    <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                </MenuOptionGroup>

                <OrderButton>담기</OrderButton>
            </MenuInfo>
        </MenuDetailContainer>
    );
}

export default MenuDetailCom