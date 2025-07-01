import {
    ExtraShotControl,
    MenuDescription,
    MenuDetailContainer,
    MenuImage,
    MenuInfo, MenuLabel,
    MenuName, MenuOptionGroup,
    MenuPrice, MenuRadioGroup, MenuSelect, OptionButton, OrderButton, ShotCount
} from "../../style/menu/StyleMenuDetail";
import {useEffect, useState} from "react";

function MenuDetailCom({
                           menu,
                           temperature,
                           setTemperature,
                           milk,
                           setMilk,
                           ice,
                           setIce,
                           water,
                           setWater,
                           syrup,
                           setSyrup,
                           stevia,
                           setStevia,
                           extraShot,
                           handleExtraShotChange,
                           // pickupTime,
                           // setPickupTime,
                           handleOrder,
                       }) {

    const showMilkOptions = menu.menuCategory === "COFFEE" && menu.menuName !== "아메리카노" && menu.menuName !== "콜드브루";
    const onlyIce = menu.menuName === "아포가토";


    // onlyIce가 true일 때 temperature를 'ICE'로 설정
    useEffect(() => {
        if (onlyIce) {
            setTemperature('ICE');
        }
    }, [onlyIce, menu.menuIsIceAvailable]); // onlyIce 또는 menu.menuIsIceAvailable이 변경될 때마다 실행




    return (
        <MenuDetailContainer>
            <MenuImage src={`http://localhost:8080${menu.menuImageUrl}`} alt={menu.menuName} />
            <MenuInfo>
                <MenuName>{menu.menuName}</MenuName>
                <MenuDescription>{menu.menuDescription}</MenuDescription>
                <MenuPrice>{menu.menuPrice.toLocaleString()}원</MenuPrice>

                <MenuOptionGroup>
                    <MenuRadioGroup>
                        {!onlyIce && ( <>
                        <label><input type="radio" name="temp" value="HOT" checked={temperature === 'HOT'} onChange={() => setTemperature('HOT')} /> HOT</label>
                        </> )}
                        {(onlyIce || menu.menuIsIceAvailable) && (
                            <label><input type="radio" name="temp" value="ICE" checked={temperature === 'ICE'} onChange={() => setTemperature('ICE')} /> ICE</label>
                        )}
                    </MenuRadioGroup>

                    {showMilkOptions && ( <>
                    <MenuLabel>우유 선택</MenuLabel>
                    <label><input type="radio" name="milk" value="regular" checked={milk === 'regular'} onChange={() => setMilk('regular')} /> 일반우유</label>
                    <label><input type="radio" name="milk" value="lowfat" checked={milk === 'lowfat'} onChange={() => setMilk('lowfat')} /> 무지방우유</label>
                    <label><input type="radio" name="milk" value="regular" checked={milk === 'oat'} onChange={() => setMilk('oat')} /> 오트밀크</label>
                    </> )}

                    { temperature === 'ICE' && ( <>
                    <MenuLabel>얼음량</MenuLabel>
                    <label><input type="radio" name="ice" value="less" checked={ice === 'less'} onChange={() => setIce('less')} /> 적게</label>
                    <label><input type="radio" name="ice" value="normal" checked={ice === 'normal'} onChange={() => setIce('normal')} /> 보통</label>
                    <label><input type="radio" name="ice" value="more" checked={ice === 'more'} onChange={() => setIce('more')} /> 많이</label>
                    </>
                    )}

                    <MenuLabel>물양</MenuLabel>
                    <label><input type="radio" name="water" value="less" checked={water === 'less'} onChange={() => setWater('less')} /> 적게</label>
                    <label><input type="radio" name="water" value="normal" checked={water === 'normal'} onChange={() => setWater('normal')} /> 보통</label>
                    <label><input type="radio" name="water" value="more" checked={water === 'more'} onChange={() => setWater('more')} /> 많이</label>

                    <MenuLabel>시럽</MenuLabel>
                    <MenuLabel><input type="checkbox" checked={syrup} onChange={() => setSyrup(!syrup)} /> 시럽 추가</MenuLabel>
                    <MenuLabel><input type="checkbox" checked={stevia} onChange={() => setStevia(!stevia)} /> 스테비아로 변경</MenuLabel>

                    <MenuLabel>샷 추가</MenuLabel>
                    <ExtraShotControl>
                        <OptionButton onClick={() => handleExtraShotChange(-1)}>-</OptionButton>
                        <ShotCount>{extraShot}</ShotCount>
                        <OptionButton onClick={() => handleExtraShotChange(1)}>+</OptionButton>
                    </ExtraShotControl>

                    {/*<MenuLabel>픽업 시간 선택</MenuLabel>
                    <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />*/}
                </MenuOptionGroup>

                <OrderButton onClick={handleOrder}>주문하기</OrderButton>
            </MenuInfo>
        </MenuDetailContainer>
    );
}

export default MenuDetailCom