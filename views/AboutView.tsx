import React from 'react';

const AboutView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Giới thiệu Sản phẩm (Product Requirements Document - PRD)</h2>
            
            <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">1. Mục tiêu và Phạm vi</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">"EduAI Builder" là một công cụ hỗ trợ thiết kế chương trình đào tạo dựa trên nguyên tắc Instructional Design (Thiết kế Hướng dẫn), tập trung vào mô hình ADDIE (Analysis, Design, Development, Implementation, Evaluation) được đơn giản hóa thành 3 bước cốt lõi.</p>

            <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">2. Đối tượng Người dùng Mục tiêu</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Chuyên gia Đào tạo & Phát triển (L&D Specialists).</li>
                <li>Giảng viên nội bộ (Internal Trainers).</li>
                <li>Quản lý dự án cần lên kế hoạch đào tạo nhanh chóng.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">3. Các Tính năng Chính</h3>
            <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-lg text-blue-800">3.1. Quy trình Thiết kế Từng bước (Stepper)</h4>
                    <p className="text-blue-700 text-sm mt-1">Hướng dẫn người dùng qua 3 giai đoạn chính (Phân tích, Thiết kế, Hoàn thiện) với các prompt chuyên biệt. Cho phép người dùng chỉnh sửa kết quả của AI ở mỗi bước để đảm bảo tính chính xác và phù hợp với bối cảnh thực tế.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-lg text-blue-800">3.2. Trợ lý AI Tích hợp (AI Agent Sidebar)</h4>
                    <p className="text-blue-700 text-sm mt-1">Một không gian hội thoại song song. Trợ lý có thể nhận lệnh để thay đổi nội dung (ví dụ: "Thêm 15 phút cho phần thảo luận"), cung cấp thêm ý tưởng, hoặc trả lời các câu hỏi liên quan đến thiết kế bài giảng (Instructional Design).</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-lg text-blue-800">3.3. Đầu ra Hoàn chỉnh</h4>
                    <p className="text-blue-700 text-sm mt-1">Tổng hợp toàn bộ các kết quả từ các bước thành một bản kế hoạch đào tạo chi tiết, sẵn sàng để sao chép hoặc xuất ra dưới dạng file (mô phỏng: PDF).</p>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
