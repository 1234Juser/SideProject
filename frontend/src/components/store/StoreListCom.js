import {useEffect, useState} from "react";

const StoreListCom = ({storeList, handleStoreSelect}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const storesPerPage = 10;   // 한 페이지당 보여질 매장 갯수

    useEffect(() => {
        // storeList api 호출
    }, []);


    // 현재 페이지에 보여질 매장 목록 계산
    const indexOfLastStore = currentPage * storesPerPage;
    const indexOfFirstStore = indexOfLastStore - storesPerPage;
    const currentStores = storeList.slice(indexOfFirstStore, indexOfLastStore);
    const totalStores = storeList.length;


    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    // 페이지네이션 UI 컴포넌트
    const Pagination = () => {
        const pageNumbers = [];
        const totalPages = Math.ceil(totalStores / storesPerPage);
        const maxPageButtons = 5; // 한 번에 보여줄 최대 페이지 버튼 수

        if (totalPages <= 1) return null; // 페이지가 1개 이하면 페이지네이션을 보여주지 않음

        // --- 페이지네이션 버튼 5개 표시 로직 ---
        let startPage, endPage;
        if (totalPages <= maxPageButtons) {
            // 전체 페이지 수가 5개 이하일 경우
            startPage = 1;
            endPage = totalPages;
        } else {
            // 전체 페이지 수가 5개를 초과할 경우
            const halfMaxButtons = Math.floor(maxPageButtons / 2);
            if (currentPage <= halfMaxButtons + 1) {
                // 현재 페이지가 시작 부분에 가까울 때 (1, 2, 3)
                startPage = 1;
                endPage = maxPageButtons;
            } else if (currentPage >= totalPages - halfMaxButtons) {
                // 현재 페이지가 끝 부분에 가까울 때
                startPage = totalPages - maxPageButtons + 1;
                endPage = totalPages;
            } else {
                // 중간에 있을 때
                startPage = currentPage - halfMaxButtons;
                endPage = currentPage + halfMaxButtons;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        // --- 로직 끝 ---

        return (
            <nav style={{ marginTop: '20px', position: 'sticky', bottom: 0, backgroundColor: 'white', padding: '10px 0' }}>
                <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: '8px', margin: 0, padding: 0 }}>
                    {pageNumbers.map(number => (
                        <li key={number}>
                            <button
                                onClick={() => handlePageChange(number)}
                                style={{
                                    padding: '5px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: currentPage === number ? '#007bff' : 'white',
                                    color: currentPage === number ? 'white' : 'black',
                                    fontWeight: currentPage === number ? 'bold' : 'normal'
                                }}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        )
    }


    return (
        <div style={{
            border: "2px solid purple",
            width: "20%",
            position: 'absolute', // 이 속성을 추가해야 합니다.
            zIndex: 2,
            backgroundColor: 'white', // 배경색을 추가해야 아래 컴포넌트를 완전히 가립니다.
            // --- 높이 고정 및 스크롤 추가 ---
            maxHeight: '400px', // 원하는 최대 높이로 설정
            overflowY: 'auto'  // 내용이 넘칠 경우에만 세로 스크롤바 표시
        }}>
            <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: '10px', borderBottom: '1px solid #eee' }}>
                <span>가까운 매장 목록</span>
            </div>
            <div style={{ padding: '0 10px' }}>
                {currentStores.map(store => (
                    <div
                        key={store.storeId}
                        onClick={() => handleStoreSelect(store)}
                        style={{ border: '1px solid #eee', padding: '10px', margin: '5px 0', cursor: 'pointer', fontSize : "10px" }}
                    >
                        <div><strong>{store.storeName}</strong></div>
                        <div>{store.storeAddress}</div>
                        {store.storeTel && <div>전화번호: {store.storeTel}</div>}
                    </div>
                ))}
            </div>
            <Pagination/>
        </div>
    )
}

export default StoreListCom;