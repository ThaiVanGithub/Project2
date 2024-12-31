let tours = []; // Mảng lưu trữ danh sách tour

async function fetchTours() {
    try {
        const response = await fetch('http://localhost:3000/api/tours/');
        let fetchedTours = await response.json();

        // Lọc bỏ tours trùng lặp dựa trên TourID
        tours = [...new Map(fetchedTours.map(tour => [tour.TourID, tour])).values()];

        console.log('Unique tours:', tours);
        displayTours(tours);
    } catch (error) {
        console.error('Error fetching tours:', error);
    }
}

// Hàm hiển thị danh sách tour
function displayTours(toursToDisplay) {
    const toursContainer = document.getElementById('tours-container');
    
    if (toursToDisplay.length === 0) {
        toursContainer.innerHTML = '<p>No tours found.</p>';
        return;
    }
    
    // Tạo một mảng chứa tất cả HTML cards
    const tourCards = toursToDisplay.map(tour => `
<article class="tour-card" data-tour-id="${tour.TourID}">
    <img src="${tour.Image || '/api/placeholder/400/320'}" alt="${tour.Name}" class="tour-image">
    <div class="tour-content">
        <h2 class="tour-title">${tour.Name}</h2>
        <p class="tour-description">${tour.Description || 'No description available'}</p>
        <div class="tour-meta">
            <span class="tour-meta-item">
                <i class="fas fa-calendar"></i>
                ${new Date(tour.StartDate).toLocaleDateString()}
            </span>
        </div>
        <span class="tour-status ${tour.Status.toLowerCase() === 'available' ? 'status-available' : 'status-full'}">${tour.Status}</span>
        <p class="tour-price">$${tour.Price}</p>
        <div class="tour-buttons">
            <button class="btn btn-secondary" onclick="viewTourDetails(${tour.TourID})">View Details</button>
            <button class="btn btn-primary" onclick="bookTour(${tour.TourID})" ${tour.Status.toLowerCase() !== 'available' ? 'disabled' : ''}>Book Now</button>
        </div>
    </div>
</article>
`);
    
    // Gán tất cả HTML vào container một lần duy nhất
    toursContainer.innerHTML = tourCards.join('');
}

// Hàm lọc tour dựa trên tìm kiếm
function filterTours() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const filteredTours = tours.filter(tour => 
        tour && tour.Name && tour.Name.toLowerCase().includes(searchInput)
    );
    displayTours(filteredTours);
}

// Hàm sắp xếp tour
function sortTours() {
    const sortOption = document.getElementById('sort-options').value;
    let sortedTours = [...tours]; // Clone mảng tours đã được lọc bỏ trùng lặp

    if (sortOption === 'price-asc') {
        sortedTours.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
    } else if (sortOption === 'price-desc') {
        sortedTours.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
    }

    displayTours(sortedTours);
}

// Xử lý đăng xuất
document.getElementById('logoutButton').addEventListener('click', function (e) {
    e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ `<a>`
    localStorage.removeItem('user'); // Xóa thông tin người dùng
    window.location.href = 'logIn.html'; // Chuyển hướng về trang đăng nhập
});

// Hàm đặt tour
async function bookTour(tourID) {
    // Lấy thông tin người dùng từ localStorage
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Vui lòng đăng nhập trước khi đặt tour.');
        window.location.href = 'logIn.html'; // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
        return;
    }

    const parsedUser = JSON.parse(user); // Giải mã thông tin người dùng
    const userID = parsedUser.userId; // Lấy UserID từ thông tin người dùng

    // Tìm tour có TourID tương ứng
    const selectedTour = tours.find(tour => tour.TourID === tourID);
    if (!selectedTour) {    
        alert('Không tìm thấy thông tin tour này.');
        return;
    }

    // Lấy giá của tour từ dữ liệu
    const totalAmount = selectedTour.Price;

    // Lấy ngày giờ hiện tại từ máy tính (múi giờ hệ thống)
    const bookingDate = new Date().toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).replace(',', ''); // Xóa dấu phẩy giữa ngày và giờ

    const status = 'PENDING'; // Trạng thái mặc định cho booking

    const bookingData = {
        TourID: tourID,
        UserID: userID,
        BookingDate: bookingDate,
        TotalAmount: totalAmount,
        Status: status,
    };

    try {
        // Gửi yêu cầu POST đến server để tạo booking mới
        const response = await fetch(`http://localhost:3000/api/tours/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Đặt tour thành công!');
            window.location.href = 'tourBooked.html'; // Chuyển hướng sang trang tour đã đặt
        } else {
            console.error('Lỗi API:', result);
            console.log('Dữ liệu gửi lên:', bookingData);
            alert(result.message || 'Có lỗi xảy ra khi đặt tour.');
        }
    } catch (error) {
        console.error('Lỗi khi đặt tour:', error);
        console.log('Dữ liệu gửi lên:', bookingData);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
}

// Hàm hủy booking
async function cancelBooking(bookingID) {
    try {
        const response = await fetch(`http://localhost:3000/api/tours/book/${bookingID}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Hủy đặt tour thành công.');
            window.location.reload(); // Tải lại trang để cập nhật danh sách
        } else {
            const result = await response.json();
            alert(result.message || 'Không thể hủy đặt tour.');
        }
    } catch (error) {
        console.error('Lỗi khi hủy đặt tour:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
}

// Tải danh sách tour khi trang được tải
document.addEventListener('DOMContentLoaded', fetchTours);
