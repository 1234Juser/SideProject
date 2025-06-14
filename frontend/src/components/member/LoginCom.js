import {LoginContainer} from "../../style/member/StyleLogin";

function LoginCom({ state, isLoading, handleChange, handleSubmit }) {
    const { username, password, message } = state;

    return (
        <LoginContainer>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">아이디:</label>
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </LoginContainer>
    );
}


export default LoginCom