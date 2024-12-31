    const db = require('../db');

    // Lấy tất cả user
    module.exports.getAllUsers = async () => {
        try {
            const [rows] = await db.query("SELECT * FROM user");
            return rows;
        } catch (err) {
            console.error('Error in getAllUsers:', err);
            throw err;
        }
    };

    // Lấy user theo ID
    module.exports.getUserById = async (id) => {
        try {
            const [rows] = await db.query("SELECT * FROM user WHERE UserID = ?", [id]);
            return rows.length > 0 ? rows[0] : null; // Trả về null nếu không tìm thấy user
        } catch (err) {
            console.error('Error in getUserById:', err);
            throw err;
        }
    };

    // Xóa user theo ID
 // userService.js

module.exports.deleteUser = async (id) => {
    try {
        // Kiểm tra nếu id là số hợp lệ
        if (!id || isNaN(id)) {
            throw new Error('ID không hợp lệ');
        }

        const result = await db.query("DELETE FROM User WHERE UserID = ?", [id]);
        return result.affectedRows; // Trả về số dòng bị ảnh hưởng
    } catch (err) {
        console.error(err);
        throw err;
    }
};



module.exports.addUser = async (newUser) => {
    try {
        // Kiểm tra nếu dữ liệu người dùng hợp lệ
        if (!newUser.FullName || !newUser.Email || !newUser.Role) {
            throw new Error('Dữ liệu người dùng không hợp lệ');
        }

        // Chạy câu lệnh SQL để thêm người dùng vào cơ sở dữ liệu
        const result = await db.query(
            "INSERT INTO User (FullName, PhoneNumber, Email, Address, Avatar, Role) VALUES (?, ?, ?, ?, ?, ?)",
            [newUser.FullName, newUser.PhoneNumber, newUser.Email, newUser.Address, newUser.Avatar, newUser.Role]
        );

        // Kiểm tra nếu có dòng bị ảnh hưởng (người dùng đã được thêm vào)
        console.log(result);  // Debug output
        if (result.affectedRows > 0) {
            return true; // Trả về true nếu thêm thành công
        } else {
            return false; // Trả về false nếu không thêm được
        }
    } catch (err) {
        console.error(err);
        throw err; // Ném lỗi nếu có lỗi trong quá trình thực thi
    }
};

//SỬA
module.exports.updateUser = async (id, updatedUser) => {
    try {
        // Kiểm tra nếu ID và dữ liệu người dùng hợp lệ
        if (!id || !updatedUser.FullName || !updatedUser.Email || !updatedUser.Role) {
            throw new Error('ID hoặc dữ liệu người dùng không hợp lệ');
        }

        // Chạy câu lệnh SQL để cập nhật người dùng
        const result = await db.query(
            "UPDATE User SET FullName = ?, PhoneNumber = ?, Email = ?, Address = ?, Avatar = ?, Role = ? WHERE UserID = ?",
            [
                updatedUser.FullName,
                updatedUser.PhoneNumber || null,
                updatedUser.Email,
                updatedUser.Address || null,
                updatedUser.Avatar || null,
                updatedUser.Role,
                id,
            ]
        );

        // Debug kết quả
        console.log(result); // Debug output

        // Kiểm tra nếu có dòng bị ảnh hưởng
        if (result.affectedRows > 0) {
            return true; // Cập nhật thành công
        } else {
            return false; // Không tìm thấy người dùng để cập nhật
        }
    } catch (err) {
        console.error(err);
        throw err; // Ném lỗi nếu có lỗi trong quá trình thực thi
    }
};


module.exports.login = async (email, phoneNumber) => {
    try {
        if (!email || !phoneNumber) {
            throw new Error('Email và số điện thoại là bắt buộc');
        }

        // Truy vấn thông tin người dùng từ cơ sở dữ liệu
        const query = `
            SELECT UserID, Email, PhoneNumber, Username, Role 
            FROM User 
            WHERE Email = ? AND PhoneNumber = ?
            LIMIT 1
        `;
        const [user] = await db.query(query, [email, phoneNumber]);

        if (!user) {
            throw new Error('Email hoặc mật khẩu (số điện thoại) không chính xác');
        }

        // Trả về thông tin người dùng nếu xác thực thành công
        return {
            success: true,
            data: {
                userId: user.UserID,
                username: user.Username,
                role: user.Role
            }
        };
    } catch (err) {
        console.error(err);
        return { success: false, message: err.message };
    }
};

module.exports.registerUser = async ({ username, phoneNumber, email, address }) => {
    const defaultAvatar = 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg';
    const defaultRole = 'Customer';

    if (!username || !phoneNumber || !email) {
        throw new Error('Username, phone number, and email are required');
    }

    const sql = `
        INSERT INTO User (FullName, PhoneNumber, Email, Address, Avatar, Role)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [username, phoneNumber, email, address || '', defaultAvatar, defaultRole];

    try {
        const [result] = await db.execute(sql, values);
        return { userId: result.insertId, username, phoneNumber, email, address, avatar: defaultAvatar, role: defaultRole };
    } catch (err) {
        console.error('Error in registerUser:', err);
        throw err;
    }
};

// Service: Đăng nhập người dùng
module.exports.loginUser = async (email, password) => {
    try {
        const sql = `
            SELECT * FROM User WHERE Email = ? AND PhoneNumber = ?
        `;
        const [rows] = await db.execute(sql, [email, password]);
       

       
        if (rows.length > 0) {
            const user = rows[0];
            return {
                userId: user.UserID,
                username: user.FullName,
                password: user.PhoneNumber,
                email: user.Email,
                role: user.Role,
                avatar: user.Avatar,
            };
            
            
        }

        return null; // Không tìm thấy người dùng
    } catch (err) {
        console.error('Error in loginUser:', err);
        throw err;
    }
};


module.exports.createPayment = async (paymentData) => {
    try {
        const { BookingID, Amount, PaymentMethod } = paymentData;

        // Kiểm tra BookingID tồn tại
        const [bookingRows] = await db.query(`SELECT * FROM Booking WHERE BookingID = ?`, [BookingID]);
        if (bookingRows.length === 0) {
            throw new Error('Booking không tồn tại!');
        }

        // Tạo Payment
        const [result] = await db.query(
            `INSERT INTO Payment (BookingID, Amount, PaymentMethod) VALUES (?, ?, ?)`,
            [BookingID, Amount, PaymentMethod]
        );

        return result.insertId; // Trả về PaymentID
    } catch (err) {
        console.error('Error in createPayment:', err);
        throw err;
    }
};

module.exports.getPaymentByBookingID = async (bookingId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM Payment WHERE BookingID = ?`,
            [bookingId]
        );
        return rows.length > 0 ? rows : null;
    } catch (err) {
        console.error('Error in getPaymentByBookingID:', err);
        throw err;
    }
};

module.exports.getPaymentsByUserID = async (userId) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                p.PaymentID,
                p.Amount,
                p.PaymentMethod,
                p.PaymentDate,
                p.Status,
                b.BookingID,
                t.Name AS TourName,
                t.Price AS TourPrice
            FROM 
                Payment p
            JOIN 
                Booking b ON p.BookingID = b.BookingID
            JOIN 
                Tour t ON b.TourID = t.TourID
            WHERE 
                b.UserID = ?`,
            [userId]
        );
        return rows.length > 0 ? rows : null;
    } catch (err) {
        console.error('Error in getPaymentsByUserID:', err);
        throw err;
    }
};

