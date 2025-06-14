import MenuListCom from "../../components/menu/MenuListCom";
import {useParams} from "react-router-dom";
import {fetchMenusByCategory} from "../../service/menuService";
import {useQuery} from "@tanstack/react-query";

function MenuListCon() {
    const { category } = useParams();
    // const [menuList, setMenuList] = useState([]);

    const {data : menuList, isLoading, isError, error} = useQuery({
        queryKey : ['menus', category],
        queryFn : () => fetchMenusByCategory(category),
        staleTime : 1000 * 60 * 5,      // 5분 캐싱
    })

    if (isLoading) return <p>로딩 중...</p>;
    if (isError) return <p>에러 발생: {error.message}</p>;


    return (
        <>
            <MenuListCom menuList={menuList}/>
        </>
    )
}

export default MenuListCon;