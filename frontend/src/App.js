import './App.css';
import MainPage from "./pages/common/MainPage";
import {Route, Routes} from "react-router-dom";
import MainLayout from "./components/common/Layout";
import MenuListPage from "./pages/menu/MenuListPage";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SignupPage from "./pages/member/SignupPage";
import LoginPage from "./pages/member/LoginPage";
import {AuthProvider} from "./utils/AuthContext";
import InquiryPage from "./pages/inquiry/InquiryPage";
import ChatPage from "./pages/inquiry/ChatPage";
import MenuDetailPage from "./pages/menu/MenuDetailPage";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <div className="main-page-container">
                  <MainLayout>
                    <Routes>

                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route path="/" element={<MainPage/>} />
                        <Route path="/menu/:category" element={<MenuListPage />} />
                        <Route path="/menu/option/:menuId" element={<MenuDetailPage />} />

                        {/* 1:1문의 */}
                        <Route path="/inquiry" element={<InquiryPage />} />
                        <Route path="/chat-inquiry" element={<ChatPage />} />

                    </Routes>
                  </MainLayout>
              </div>
              <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
      </QueryClientProvider>
  );
}

export default App;
