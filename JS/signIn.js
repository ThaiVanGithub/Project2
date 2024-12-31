// const { log } = require("console");

// // Định nghĩa API URL
// const loginAPI = 'http://localhost:3000/api/users/login';

// // Hàm gửi yêu cầu đăng nhập
// async function loginUser() {
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;

//     if (!email || !password) {
//         alert('Vui lòng điền đầy đủ email và mật khẩu!');
//         return;
//     }

//     try {
//         // Gửi yêu cầu POST đến server
//         const response = await fetch(loginAPI, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ email, password })
//         });

//         const result = await response.json();

//         if (response.ok) {
//             // Đăng nhập thành công, lưu thông tin vào localStorage
//             localStorage.setItem('user', JSON.stringify(result));
//             // Chuyển hướng tới trang allTours.html
         
//         } else {
//             // Đăng nhập thất bại
//             alert(result.message || 'Đăng nhập thất bại!');
//         }
//     } catch (error) {
//         console.error('Lỗi khi đăng nhập:', error);
//         alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
//     }
// }
// if(localStorage.getItem(role) == "Admin"){
//     console.log("Hi");
    
//    } else {
//     window.location.href = 'allTours.html';
//    }
    

// // Gắn sự kiện cho nút "Đăng nhập"
// document.querySelector('.form__button--login').addEventListener('click', loginUser);

// // Kiểm tra tự động chuyển hướng nếu đã đăng nhập trước đó
// window.onload = function () {
//     const user = localStorage.getItem('user');
//     if (user) {
//         window.location.href = 'allTours.html';
//     }
// };


// const registerBtn = document.querySelector("#btnRegister");
// registerBtn.addEventListener('click', ()=>{
//     window.location.href = "register.html";
// })



const loginAPI = 'http://localhost:3000/api/users/login';

// Hàm gửi yêu cầu đăng nhập
async function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Vui lòng điền đầy đủ email và mật khẩu!');
        return;
    }

    try {
        // Gửi yêu cầu POST đến server
        const response = await fetch(loginAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Đăng nhập thành công, lưu thông tin vào localStorage
            localStorage.setItem('user', JSON.stringify(result));
            
            // Kiểm tra role và chuyển hướng
            const role = result.role; // Đảm bảo server trả về thông tin role
            if (role === 'Admin') {
                window.location.href = 'Adminstrator.html';
            } else {
                window.location.href = 'allTours.html';
            }
        } else {
            // Đăng nhập thất bại
            alert(result.message || 'Đăng nhập thất bại!');
        }
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
}

// Gắn sự kiện cho nút "Đăng nhập"
document.querySelector('.form__button--login').addEventListener('click', loginUser);

// Kiểm tra tự động chuyển hướng nếu đã đăng nhập trước đó
window.onload = function () {
    const user = localStorage.getItem('user');
    if (user) {
        const parsedUser = JSON.parse(user);
        const role = parsedUser.role;
        if (role === 'Admin') {
            window.location.href = 'adminstrator.html';
        } else {
            window.location.href = 'allTours.html';
        }
    }
};

// Gắn sự kiện cho nút "Đăng ký"
const registerBtn = document.querySelector("#btnRegister");
registerBtn.addEventListener('click', () => {
    window.location.href = "register.html";
});
