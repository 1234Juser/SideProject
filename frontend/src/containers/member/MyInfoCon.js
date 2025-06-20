import React, {useEffect, useReducer, useState} from 'react';
import MyInfoCom from "../../components/member/MyInfoCom";
import {useAuth} from "../../utils/AuthContext";
import {initialState, memberReducer} from "../../modules/memberReducer";
import {fetchMemberInfo} from "../../service/memberService";
import {SectionTitle} from "../../style/member/StyleMyPage";
import {InfoSection} from "../../style/member/StyleMyInfo";

function MyInfoCon() {
    const [memberInfo, setMemberInfo] = useState(null);     // 실제 백엔드에서 가져올 사용자 정보를 저장할 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {auth, isAuthInitialized} = useAuth();
    const [state, dispatch] = useReducer(memberReducer, initialState);


    useEffect(() => {
        const fetchData = async () => {
            console.log("🌀 useEffect 시작");
            if (isAuthInitialized) {
                if (auth.isAuthenticated) {
                    console.log("🔐 로그인됨, fetch 시작");

                    setLoading(true);
                    setError(null);

                    try {
                        const data = await fetchMemberInfo(auth.accessToken);
                        console.log("📦 불러온 회원 정보:", data); // << 이게 뜨는지 확인!
                        setMemberInfo(data);
                        dispatch({type: 'SET_INITIAL_DATA', payload: data});
                    } catch (err) {
                        console.error("Failed to fetch member info:", err);
                        setError("회원 정보를 불러오는데 실패했습니다.");
                    } finally {
                        setLoading(false);
                    }
                } else {
                    console.warn("❗로그인되지 않음");
                    setError("로그인이 필요합니다.");
                    setLoading(false);
                }
            } else {
                console.log("⏳ 인증 상태 초기화 대기 중...");
            }
        };

        fetchData();
    }, [auth.isAuthenticated]);



    return (
        <div>
            {loading && <p>로딩 중...</p>}
            {error && <p>{error}</p>}
            {!loading && isAuthInitialized && memberInfo ? (
            <MyInfoCom memberInfo={memberInfo}/>
                ) :  !loading && isAuthInitialized && <p>회원 정보를 찾을 수 없습니다.</p>}
        </div>
    );
}

export default MyInfoCon;