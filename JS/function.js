
const listMenu = document.querySelector(".listMenu");
const showMenu = document.querySelector("#showMenu");
const closeMenu = document.querySelector("#closedMenu");

showMenu.addEventListener("click", () =>{
    listMenu.classList.remove('hide');
    
})
closeMenu.addEventListener("click", () =>{
    listMenu.classList.add('hide');
    
})

// slide show
document.addEventListener("DOMContentLoaded", function() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
  }
  


  function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    } else if (currentSlide >= slides.length) {
      currentSlide = 0;
    }
    showSlide(currentSlide);
  }

  document.querySelector('#prev').addEventListener('click', () => changeSlide(-1));
  document.querySelector('#next').addEventListener('click', () => changeSlide(1));
  // Show the first slide when the page loads
  showSlide(currentSlide);
}); 



let isLoading = false;

async function fetchTours() {
    if (isLoading) return; // Ngăn fetch trùng lặp
    
    try {
        isLoading = true;
        console.log('Fetching tours...'); // Log để debug
        const response = await fetch('http://localhost:3000/api/tours/');
        tours = await response.json();
        console.log('Tours fetched:', tours); // Log để debug
        displayTours(tours);
    } catch (error) {
        console.error('Error fetching tours:', error);
    } finally {
        isLoading = false;
    }
}

const logIn = document.querySelector('.logIn');

if (localStorage.getItem('user')) {
    logIn.innerHTML = '<a href="#" id= logout">Đăng xuất</a>';

    // Thêm sự kiện click cho liên kết đăng xuất
    document.querySelector('.logIn').onclick = function(event) {
        // Ngăn chặn hành vi mặc định của liên kết
        event.preventDefault();
        
        // Xóa thông tin user trong localStorage
        localStorage.removeItem('user');
        
        // Chuyển hướng về a.html
        window.location.href = 'logIn.html';
    };
} else {
    logIn.innerHTML = ' <a href="logIn.html" id="logout"> Đăng nhập </a>';
}