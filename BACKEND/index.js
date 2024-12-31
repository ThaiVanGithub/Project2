    const express = require('express');
    const app = express();
    const db = require('./db.js');
    const tourRoutes = require('./controller/tourController.js');
    const userRoutes = require('./controller/userController.js');
    const cors = require("cors");
    const bodyParser = require('body-parser')
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    app.use(express.json());

    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send("Something went wrong!")
    });
    app.use(cors({
        origin: '*',  // hoặc thay '*' bằng URL của frontend nếu cần
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type, Authorization'
    }));


    app.use('/api/tours', tourRoutes);


    // Thêm route cho user
    app.use('/api/users', userRoutes);



    db.query("SELECT 1")
        .then(() => {
            console.log('Da ket noi voi CSDL');
            app.listen(3000, () => console.log('Server dang chay tai http://localhost:3000'));
        })
        .catch(err => {
            console.error('Error connecting to MySQL:', err);
            process.exit(1);
        });