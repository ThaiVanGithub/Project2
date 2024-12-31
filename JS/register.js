
// Add new user form submission
document.getElementById('addUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const newUser = {
        FullName: document.getElementById('fullName').value,
        PhoneNumber: document.getElementById('phoneNumber').value,
        Email: document.getElementById('email').value,
        Address: document.getElementById('address').value,
        Avatar: document.getElementById('avatar').value,
        Role: document.getElementById('role').value,
    };

    // Kiểm tra dữ liệu trước khi gửi
    if (!newUser.FullName || !newUser.Email || !newUser.Role) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    try {
        // Gửi yêu cầu POST đến backend
        const response = await fetch('http://localhost:3000/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        // Xử lý phản hồi từ server
        if (response.ok) {
            alert('Thêm người dùng thành công!');
             // Load the updated list of users
        } else {
            const errorMessage = await response.text();
            alert(`Có lỗi: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Thêm thành công:', error);
        alert('Thêm thành công');
    
    }
});

const form = document.getElementById('addUserForm');
const saveButton = document.getElementById('saveUserButton');
let editingUserId = null;

// Hàm xử lý khi nhấn nút thêm
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const user = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/api/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            alert('Thêm người dùng thành công!');
            form.reset();
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
});

// Hàm xử lý khi nhấn nút lưu (chỉnh sửa người dùng)




// Modify the save button event listener
