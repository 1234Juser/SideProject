import MenuDetailCon from "../../containers/menu/MenuDetailCon";
import {useParams} from "react-router-dom";

function MenuDetailPage() {

    const { menuId } = useParams();


    return(
        <>
            <MenuDetailCon menuId={menuId}/>
        </>
    )
}

export default MenuDetailPage