import React, { createContext, useState, useContext } from 'react';

// 1. AuthContext 생성: 애플리케이션의 인증 상태를 관리합니다.
export const AuthContext = createContext(null);

// 2. AuthProvider 컴포넌트: AuthContext의 값을 제공합니다.
export const AuthProvider = ({ children }) => {
    // 로컬 스토리지에서 초기 인증 정보를 로드합니다.
    const [auth, setAuth] = useState(() => {
        try {
            // localStorage에서 값을 읽어올 때, 값이 없거나 빈 문자열이면 null로 처리
            const accessToken = localStorage.getItem('accessToken') || null;
            const memberUsername = localStorage.getItem('memberUsername') || null;
            const memberRole = localStorage.getItem('memberRole') || null;
            const memberNickname = localStorage.getItem('memberNickname') || null;

            // accessToken이 유효하면 로그인 상태로 간주합니다.
            if (accessToken) {
                return { isAuthenticated: true, accessToken, memberUsername, memberRole, memberNickname };
            }
        } catch (error) {
            console.error("Failed to load auth from localStorage:", error);
        }
        return { isAuthenticated: false, accessToken: null, memberUsername: null, memberRole: null, memberNickname: null};
    });


    // 로그인 처리 함수
    const login = (accessToken, memberUsername, memberRole, memberNickname) => {
        try {
            // localStorage에 값을 저장할 때 null/undefined가 "null" 또는 "undefined" 문자열로 저장되지 않도록 빈 문자열로 대체
            localStorage.setItem('accessToken', accessToken || '');
            localStorage.setItem('memberUsername', memberUsername || '');
            localStorage.setItem('memberRole', memberRole || '');
            localStorage.setItem('memberNickname', memberNickname || '');

            setAuth({ isAuthenticated: true,
                accessToken: accessToken || null,
                memberUsername: memberUsername || null,
                memberRole: memberRole || null,
                memberNickname: memberNickname || null,
            });
            console.log('AuthContext: Login successful, auth state updated:', {
                isAuthenticated: true,
                accessToken: accessToken || null,
                memberUsername: memberUsername || null,
                memberRole: memberRole || null,
                memberNickname: memberNickname || null
            }); // 상태 업데이트 로그 추가

        } catch (error) {
            console.error("Failed to save auth to localStorage during login:", error);
            // 로컬 스토리지 저장 실패 시에도 메모리 상태는 업데이트
            setAuth({
                isAuthenticated: true,
                accessToken: accessToken || null,
                memberUsername: memberUsername || null,
                memberRole: memberRole || null,
                memberNickname: memberNickname || null
            });
        }
    };


    // 로그아웃 처리 함수
    const logout = () => {
        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('memberUsername');
            localStorage.removeItem('memberRole');
            localStorage.removeItem('memberNickname')

            setAuth({ isAuthenticated: false, accessToken: null, memberUsername: null, memberRole: null, memberNickname: null });
            console.log('AuthContext: User logged out, auth state reset.');
        } catch (error) {
            console.error("Failed to remove auth from localStorage during logout:", error);
            // 로컬 스토리지 제거 실패 시에도 메모리 상태는 업데이트
            setAuth({ isAuthenticated: false, accessToken: null, memberUsername: null, memberRole: null, memberNickname: null });
        }
    };

    // Context가 제공할 값
    const value = {
        auth,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. 커스텀 훅: 컴포넌트에서 AuthContext를 쉽게 사용할 수 있도록 합니다.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
    }
    return context;
};
