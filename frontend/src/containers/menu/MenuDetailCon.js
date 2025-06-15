import MenuDetailCom from "../../components/menu/MenuDetailCom";
import {useQuery} from "@tanstack/react-query";
import {fetchMenuById} from "../../service/menuService";

function MenuDetailCon({menuId}) {

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

    return(
        <>
            <MenuDetailCom menu={menu}/>
        </>
    )
}

export default MenuDetailCon