const express = require('express');
const router = express.Router();
const service = require('../services/userService');

// Lấy tất cả user
router.get('/', async (req, res) => {
    try {
        const users = await service.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Không thể GET /users:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình lấy user' });
    }
});

// Lấy user theo ID
router.get('/:id', async (req, res) => {
    try {
        const user = await service.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Không thể GET /users/:id:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình lấy user' });
    }
});

// Xóa user theo ID

router.delete('/:id', async (req, res) => {
    const userID = req.params.id;

    // Kiểm tra nếu userID là một số hợp lệ
    if (!userID || isNaN(userID)) {
        return res.status(400).send('ID người dùng không hợp lệ');
    }

    try {
        const result = await service.deleteUser(userID); // Gọi service với userID hợp lệ
        if (result > 0) {
            res.send('Xóa người dùng thành công!');
        } else {
            res.status(404).send('Không tìm thấy người dùng để xóa');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi xóa người dùng');
    }
});


router.post('/add', async (req, res) => {
    const { FullName, PhoneNumber, Email, Address, Avatar, Role } = req.body;
    
    console.log(req.body); // Log dữ liệu nhận được từ frontend
    
    // Kiểm tra dữ liệu yêu cầu
    if (!FullName || !Email || !Role) {
        return res.status(400).send('Dữ liệu không hợp lệ, thiếu thông tin cần thiết!');
    }

    // Tạo đối tượng newUser từ dữ liệu nhận được
    const newUser = {
        FullName,
        PhoneNumber,
        Email,
        Address,
        Avatar,
        Role
    };

    // Thực hiện thêm người dùng vào cơ sở dữ liệu
    try {
        const result = await service.addUser(newUser);
        if (result) {
            res.status(201).send('Thêm người dùng thành công!');
        } else {
            res.send('Thành công!');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi thêm người dùng');
    }
});



//Sửa
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { FullName, PhoneNumber, Email, Address, Avatar, Role } = req.body;
    try {
        const updatedUser = { FullName, PhoneNumber, Email, Address, Avatar, Role };
        const result = await service.updateUser(id, updatedUser);
        res.status(200).send(result ? 'Cập nhật thông tin người dùng thành công!' : 'Không tìm thấy người dùng!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật thông tin người dùng');
    }
});


router.post('/register', async (req, res) => {
    const { username, phoneNumber, email, address } = req.body;

    if (!username || !phoneNumber || !email) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    try {
        const result = await service.registerUser({
            fullName: username,
            phoneNumber,
            email,
            address,
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu.' });
    }

    try {
        const result = await service.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Đăng ký tài khoản
router.post('/register', async (req, res) => {
    const { username, phoneNumber, email, address } = req.body;

    // Kiểm tra đầu vào
    if (!username || !phoneNumber || !email) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
    }

    try {
        const result = await service.registerUser({
            username,
            phoneNumber,
            email,
            address,
        });
        res.status(201).json({ message: 'Đăng ký thành công.', user: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống.' });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
        
    }

    try {
        const user = await service.loginUser(email, password);
        if (user) {
            res.status(200).json({ message: 'Đăng nhập thành công.', user });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống.' });
    }
});


router.post('/payments', async (req, res) => {
    const { BookingID, Amount, PaymentMethod } = req.body;

    if (!BookingID || !Amount || !PaymentMethod) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }

    try {
        // Gọi service để tạo payment
        const paymentID = await service.createPayment({
            BookingID,
            Amount,
            PaymentMethod
        });
        res.status(201).json({ message: 'Thanh toán thành công.', paymentID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống.' });
    }
});
router.get('/payment/:BookingId', async (req, res) => {
    try {
        const payment = await service.getPaymentByBookingID(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in GET Payments/:BookingId:', error);
        res.status(500).json({ message: 'Failed to retrieve' });
    }
});
router.get('/payments/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const payments = await service.getPaymentsByUserID(userId);

        if (!payments) {
            return res.status(404).json({ message: 'Không có hóa đơn nào cho bạn' });
        }

        res.status(200).json(payments);
    } catch (error) {
        console.error('Không thể GET /payments/user/:userId:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình xử lý.' });
    }
});



module.exports = router;
