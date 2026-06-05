import React, { useEffect } from 'react';
import { history } from 'umi';
import { supabase } from '@/utils/supabase';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { showCustomerNotification } from '@/utils/notification';
import GlobalNotificationModal from '../Component/GlobalNotificationModal';

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      // Supabase tự động parse token từ hash URL
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data?.session) {
        showCustomerNotification('Đăng nhập Google thất bại', 'Vui lòng thử lại.', 'error');
        history.push('/dang-nhap');
        return;
      }

      const user = data.session.user;
      const email = user.email || '';
      const name = user.user_metadata?.full_name || email.split('@')[0];
      const avatar = user.user_metadata?.avatar_url || '';

      try {
        // Chuyển đổi Supabase Session thành FastAPI JWT
        const res = await axios.post(`${ip3}/auth/social-login`, {
          email,
          name,
          avatar
        });

        if (res.data && res.data.accessToken) {
          localStorage.setItem('loginToken', res.data.accessToken);
          // Hiển thị thông báo kiểu giống đăng nhập thường, rồi chuyển trang
          showCustomerNotification('Đăng nhập thành công!', undefined, 'success');
          setTimeout(() => {
            history.push('/trang-chinh');
          }, 1500);
        } else {
          throw new Error('Lỗi đồng bộ token');
        }
      } catch (err) {
        console.error("Social login error", err);
        showCustomerNotification('Đăng nhập thất bại', 'Hệ thống từ chối xác thực. Vui lòng thử lại.', 'error');
        setTimeout(() => {
          history.push('/dang-nhap');
        }, 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <>
      <GlobalNotificationModal />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '4px solid #dff2e4', borderTopColor: '#2f8f4e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin { 
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h3 style={{ color: '#1f6b39', fontWeight: 600 }}>Đang xử lý đăng nhập...</h3>
      </div>
    </>
  );
}
