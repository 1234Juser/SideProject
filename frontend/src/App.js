import './App.css';
import MainPage from "./pages/common/MainPage";
import {Route, Routes} from "react-router-dom";
import MainLayout from "./layouts/Layout";
import MenuListPage from "./pages/menu/MenuListPage";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import SignupPage from "./pages/member/SignupPage";
import LoginPage from "./pages/member/LoginPage";
import {AuthProvider} from "./utils/AuthContext";
import InquiryPage from "./pages/inquiry/InquiryPage";
import ChatPage from "./pages/inquiry/ChatPage";
import MenuDetailPage from "./pages/menu/MenuDetailPage";
import AdminMyPagePage from "./pages/admin/AdminMyPagePage";
import AdminMemberListPage from "./pages/admin/AdminMemberListPage";
import MyPagePage from "./pages/member/MyPagePage";
import MyInfoPage from "./pages/member/MyInfoPage";
import MyInfoEditPage from "./pages/member/MyInfoEditPage";
import AdminInquiryPage from "./pages/inquiry/AdminInquiryPage";
import AdminInquiryDetailPage from "./pages/inquiry/AdminInquiryDetailPage";
import MemberInquiryPage from "./pages/inquiry/MemberInquiryPage";
import MemberInquiryDetailPage from "./pages/inquiry/MemberInquiryDetailPage";
import AdminChatPage from "./pages/inquiry/AdminChatPage";
import AdminChatDetailPage from "./pages/inquiry/AdminChatDetailPage";
import MemberChatPage from "./pages/inquiry/MemberChatPage";
import MemberChatDetailPage from "./pages/inquiry/MemberChatDetailPage";
import WishListPage from "./pages/wishlist/WishListPage";
import CartPage from "./pages/cart/CartPage";
import OrderPage from "./pages/order/OrderPage";
import StoreSelectionPage from "./pages/store/StoreSelectionPage";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <div className="main-page-container">
                  <MainLayout>
                    <Routes>

                        {/*멤버 관련*/}
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/mypage" element={<MyPagePage/>}/>
                        <Route path="/mypage/my-info" element={<MyInfoPage/>}/>
                        <Route path="/mypage/my-info-edit" element={<MyInfoEditPage/>}/>

                        {/*관리자 관련*/}
                        <Route path="/admin/mypage" element={<AdminMyPagePage/>}/>
                        <Route path="/admin/member-list" element={<AdminMemberListPage/>}/>

                        {/*네비게이션*/}
                        <Route path="/" element={<MainPage/>} />
                        <Route path="/menu/:category" element={<MenuListPage />} />
                        <Route path="/menu/detail/:menuId" element={<MenuDetailPage />} />
                        <Route path="/menu/select-store" element={<StoreSelectionPage/>}/>

                        {/* 1:1문의 */}
                        <Route path="/inquiry" element={<InquiryPage />} />
                        <Route path="/chat-inquiry" element={<ChatPage />} />
                        <Route path="/admin/inquiries" element={<AdminInquiryPage />} />
                        <Route path="/admin/inquiries/:inquiryId" element={<AdminInquiryDetailPage />} />
                        <Route path="/member/inquiries" element={<MemberInquiryPage />} />
                        <Route path="/member/inquiries/:inquiryId" element={<MemberInquiryDetailPage />} />
                        <Route path="/admin/chat-inquiries" element={<AdminChatPage/>} />
                        <Route path="/admin/chat-inquiries/:sessionId" element={<AdminChatDetailPage/>} />
                        <Route path="/member/chat-inquiries" element={<MemberChatPage/>} />
                        <Route path="/member/chat-inquiries/:sessionId" element={<MemberChatDetailPage/>} />

                        {/*  찜조회*/}
                        <Route path="/mypage/wishlist" element={<WishListPage/>}/>

                        {/* 장바구니   */}
                        <Route path="/mypage/cartItem" element={<CartPage/>}/>
                        {/* 주문   */}
                        <Route path="/order-confirm" element={<OrderPage />} />


                    </Routes>
                  </MainLayout>
              </div>
              <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
      </QueryClientProvider>
  );
}

export default App;
