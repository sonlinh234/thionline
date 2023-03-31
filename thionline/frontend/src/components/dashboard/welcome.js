import React from 'react';
import './welcome.css';
import { Button } from 'antd';



export default function welcome() {  
  return (
    <div>
        <h2><b>Hướng dẫn cho admin</b></h2>
        <h3>1. Tất cả giáo viên</h3>
        <h4>   Liệt kê danh sách các giáo viên trên hệ thống</h4>
        <ul>
          <li>Thêm mới - Thêm tài khoản giáo viên mới.</li>
          <li>Hành động - <br/> <p style={{marginBottom:'2px'}}><Button size = 'small' type="primary" shape="circle" icon="edit" /> Sửa thông tin giáo viên.</p><Button size = 'small' type="primary" shape="circle" icon="delete" /> Xoá tài khoản giáo viên.</li>
        </ul>
        <h3>2. Tất cả các môn</h3>
        <h4>   Liệt kê các môn có trên hệ thống.</h4>
        <ul>
          <li>Thêm mới - Thêm một môn học mới </li>
          <li>Hành động - <br/><Button size = 'small' type="primary" shape="circle" icon="edit" /> Chỉnh sửa tên môn.</li>
        </ul>
        <br/>
        <h2><b>Hướng dẫn cho giáo viên</b></h2>
        <h3>1. Tất cả câu hỏi</h3>
        <h4>   Liệt kê ra tất cả các câu hỏi.</h4>
        <ul>
          <li>Thêm mới - Tạo câu hỏi mới.</li>
          <li>Hành động - <br/> <p style={{marginBottom:'2px'}}><Button size = 'small' type="primary" shape="circle" icon="info" />  Chi tiết câu hỏi.</p><Button size = 'small' type="primary" shape="circle" icon="delete" /> Xoá câu hỏi.</li>
        </ul>
        <h3>2. Tất cả bài kiểm tra</h3>
        <h4>   Liệt kê các bài kiểm tra</h4>
        <ul>
          <li>Hành động - <Button size = 'small' type="primary" shape="circle" icon="info" /> <ul>
            <li>Chi tiết bài kiểm tra</li>
            <li>Các câu hỏi trong bài kiểm tra</li>
            <li>Học sinh - Danh sách học sinh đăng ký</li>
            <li>Thống kê - <ul>
              <li>Tải về bảng điểm dạng Excel</li>
              <li>Hiển thị trực quan kết quả kiểm tra</li>
              </ul></li>
            </ul></li>
        </ul>
        <h3>3. Bài kiểm tra mới</h3>
        <ul>
          <li>Tạo một bài kiểm tra mới</li>
          <ol>
            <li>Nhập vào các thông tin cơ bản cho bài kiểm tra</li>
            <li>Chọn câu hỏi</li><ul>
              <li>Các câu  hỏi - Ngẫu nhiên &gt; Nhập số lượng câu hỏi để được chọn ngẫu nhiên và click vào Tạo đề bài kiểm tra. Nhấn Tiếp tục để tiếp tục.</li>
              <li>Các câu hỏi - Chọn &gt; Tự chọn câu hỏi theo ý mình. Click Tiếp tục để tiếp tục.</li>
            </ul>
          </ol>
          <li>Thông tin cơ bản của một bài kiểm tra</li>
          <ul>
            <li>Link đăng ký - Link để cho học sinh đăng ký kiểm tra.</li>
            <li>Đóng đăng ký - Click để đóng link đăng k.</li>
            <li>Tải lại - Click để xem danh sách học sinh đã đăng ký.</li>
            <li>Bắt đầu kiểm tra - Click để bắt đầu bài kiểm tra.</li>
            <li>Kết thúc kiểm tra - Click để kết thúc kiểm tra.</li>
          </ul>
          <p><b>Lưu ý-</b>Link bài kiểm tra đã được gửi đến địa chỉ email của học sinh đã đăng ký. Học sinh sẽ bấm vào link đó để bắt đầu kiểm tra.</p>
        </ul>

    </div>
  );  
}


   