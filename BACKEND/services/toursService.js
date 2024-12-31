const db = require('../db')

//TOUR SERVICE HERE
module.exports.getAllTours = async () => {
    try {
        const [rows] = await db.query("SELECT DISTINCT * FROM tour");
        return rows;    
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getTourById = async (id) => {
    try {
        const [rows] = await db.query("SELECT * FROM tour WHERE TourID = ?", [id])
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.deleteTour = async (id) => {
    try {
        const result = await db.query("DELETE FROM tour WHERE TourID = ?", [id])
        return result.affectedRows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.createTour = async (tourData) => {
    return new Promise((resolve, reject) => {
        const { name, description, category, price, startDate, hotelId, vehicleId, guideId, image } = tourData;

        // Câu lệnh SQL để thêm tour mới
        const sql = `
            INSERT INTO Tour (Name, Description, Category, Price, StartDate, HotelID, VehicleID, GuideID, Image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Thực hiện câu lệnh SQL với dữ liệu
        db.execute(sql, [name, description, category, price, startDate, hotelId, vehicleId, guideId, image], (err, results) => {
            if (err) {
                return reject(err);
            }

            // Trả về kết quả (tour mới)
            resolve({
                TourID: results.insertId,
                ...tourData
            });
        });
    });
};



//sửa
module.exports.updateTour = async (id, tourData) => {
    const { Name, Description, Category, Price, StartDate, HotelID, GuideID, VehicleID, Image } = tourData;

    try {
        const query = `
            UPDATE tour
            SET Name = ?, Description = ?, Category = ?, Price = ?, StartDate = ?, HotelID = ?, GuideID = ?, VehicleID = ?, Image = ?
            WHERE TourID = ?`;
        const values = [Name, Description, Category, Price, StartDate, HotelID, GuideID, VehicleID, Image, id];

        const result = await db.query(query, values);
        return result.affectedRows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
module.exports.createBooking = async (tourID, userID,BookingDate, totalAmount, status) => {
    try {
        const query = `INSERT INTO Booking (TourID, UserID, BookingDate, TotalAmount, Status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [tourID, userID, BookingDate, totalAmount, status]);
        return result.insertId; // Trả về ID của booking vừa tạo
    } catch (err) {
        console.error('Lỗi trong createBooking:', err);
        throw err; // Ném lỗi để controller xử lý
    }
};

module.exports.getAllBookingsWithTourDetails = async (userID) => {
    try {
        const query = `
            SELECT 
                b.BookingID, 
                b.TourID, 
                b.BookingDate, 
                b.TotalAmount, 
                b.Status,
                t.Name, 
                t.Description,  
                t.Image
            FROM 
                Booking b
            JOIN 
                Tour t ON b.TourID = t.TourID
            WHERE 
                b.UserID = ?
            ORDER BY 
                b.BookingDate DESC
        `;
        const [rows] = await db.query(query, [userID]);
        return rows;
    } catch (err) {
        console.error('Lỗi trong getAllBookingsWithTourDetails:', err);
        throw err;
    }
};  
// Lấy thông tin booking theo ID
module.exports.getBookingById = async (bookingID) => {
    try {
        const query = `
            SELECT * FROM Booking 
            WHERE BookingID = ?
        `;
        const [rows] = await db.query(query, [bookingID]);
        return rows[0]; // Trả về booking đầu tiên (nếu có)
    } catch (err) {
        console.error('Lỗi trong getBookingById:', err);
        throw err;
    }
};

// Xóa booking
module.exports.deleteBooking = async (bookingID) => {
    try {
        const query = `DELETE FROM Booking WHERE BookingID = ?`;
        const [result] = await db.query(query, [bookingID]);
        return result;
    } catch (err) {
        console.error('Lỗi trong deleteBooking:', err);
        throw err;
    }
};