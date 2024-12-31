const express = require('express'),
  router = express.Router();

//TOUR CONTROLLER HERE

const service = require('../services/toursService');

// http://localhost:3000/api/tours/
router.get('/', async (req, res) => {
  try {
    const tours = await service.getAllTours();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tours' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tour = await service.getTourById(req.params.id);
    if (!tour) {
      res.status(404).json({ message: 'Khong tim thay' });
    } else {
      res.status(200).json(tour);
    }
  } catch (error) {
    res.status(500).json({ message: 'Khong the get duoc' });
  }
});

router.delete('/:id', async (req, res) => {
  const TourID= req.params.id;

  // Kiểm tra nếuTourID là một số hợp lệ
  if (!TourID || isNaN(TourID)) {
      return res.status(400).send('ID Tour không hợp lệ');
  }

  try {
      const result = await service.deleteTour(TourID); // Gọi service với userID hợp lệ
      if (result > 0) {
          res.send('Xóa Tour thành công!');
      } else {
          res.status(404).send('Không Tour để xóa');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Có lỗi xảy ra khi xóa');
  }
});



//thêm
router.post('/add', async (req, res) => {
  console.log(req.body); 
  const { Name, Description, Category, Price, StartDate, HotelID, GuideID, VehicleID, Image } = req.body;

  if (!Name || !Category || !Price || !StartDate || !HotelID || !GuideID || !VehicleID) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
  }

  const query = 'INSERT INTO Tour (Name, Description, Category, Price, StartDate, Status, HotelID, VehicleID, GuideID, Image) VALUES (?, ?, ?, ?, ?, \'AVAILABLE\', ?, ?, ?, ?)';
  const values = [Name, Description, Category, Price, StartDate, HotelID, VehicleID, GuideID, Image];

  try {
    // Lấy kết nối từ pool
    const connection = await mysqlPool.getConnection();

    // Thực hiện truy vấn
    const [result] = await connection.execute(query, values);

    // Giải phóng kết nối sau khi truy vấn xong
    connection.release();

    // Trả kết quả về client
    res.status(201).json({ message: 'Tour added successfully', tourId: result.insertId });
  } catch (err) {
    console.error('Error inserting tour:', err);
    res.status(500).json({ message: 'Lỗi khi thêm tour vào cơ sở dữ liệu.' });
  }
});

router.post('/book', async (req, res) => {
  const { TourID, UserID, BookingDate, TotalAmount, Status } = req.body;
  console.log('Dữ liệu nhận được:', req.body);  // In ra dữ liệu nhận được

  if (!TourID || !UserID || !BookingDate || !TotalAmount || !Status) {
      return res.status(400).json({ message: 'Thông tin đặt tour không đầy đủ.' });
  }

  // Chuyển đổi định dạng ngày từ 'DD/MM/YYYY HH:mm:ss' thành 'YYYY-MM-DD HH:mm:ss'
  const dateParts = BookingDate.split(' ')[0].split('/'); // Tách ngày và giờ
  const timeParts = BookingDate.split(' ')[1];
  
  const formattedBookingDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timeParts}`;

  try {
      const bookingID = await service.createBooking(TourID, UserID, formattedBookingDate, TotalAmount, Status);
      res.status(201).json({ message: 'Đặt tour thành công', bookingID });
  } catch (error) {
      console.error('Lỗi khi tạo booking:', error);
      res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại sau.' });
  }
});




// Lấy tất cả booking của user hiện tại với thông tin tour chi tiết
router.get('/bookings/:userID', async (req, res) => {
  const userID = req.params.userID;

  try {
      const bookings = await service.getAllBookingsWithTourDetails(userID);
      
      if (bookings.length === 0) {
          return res.status(404).json({ message: 'Không có booking nào cho người dùng này.' });
      }

      res.status(200).json(bookings);
  } catch (error) {
      console.error('Lỗi khi lấy danh sách booking:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách booking.' });
  }
});
// Xóa tour đã đặt (hủy tour)
// Xóa tour đã đặt (hủy tour)
router.delete('/book/:bookingID', async (req, res) => {
  const bookingID = req.params.bookingID;

  try {
      // Kiểm tra xem booking có tồn tại không trước khi xóa
      const booking = await service.getBookingById(bookingID);
      
      if (!booking) {
          return res.status(404).json({ message: 'Không tìm thấy booking.' });
      }

      // Thực hiện xóa booking
      const result = await service.deleteBooking(bookingID);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Không tìm thấy tour để xóa.' });
      }

      res.status(200).json({ message: 'Hủy tour thành công.' });
  } catch (error) {
      console.error('Lỗi khi xóa booking:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa booking.' });
  }
});



module.exports = router;







//https://www.youtube.com/watch?v=YkBOkV0s5eQ&t=9s phút 23