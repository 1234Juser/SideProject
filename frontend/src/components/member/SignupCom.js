import {SignupContainer} from "../../style/member/StyleMember";

function SignupCom({state, isLoading, handleSubmit, handleChange}) {

    const { username, password, email, nickname, phoneNumber, message } = state;

    return (
        <SignupContainer>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">사용자 이름:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">이메일:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nickname">닉네임:</label>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => handleChange('nickname', e.target.value)}
                        required // 닉네임 필수 여부는 백엔드 DTO에 따라 조절
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">전화번호:</label>
                    <input
                        id="phoneNumber"
                        type="tel" // 'tel' 타입은 모바일에서 숫자 키패드 제공에 유리
                        value={phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        required // 전화번호 필수 여부는 백엔드 DTO에 따라 조절
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '회원가입 중...' : '회원가입'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </SignupContainer>
    )
}

export default SignupCom