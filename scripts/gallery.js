const images = ["/img/gallery/large01.jpg",
                "/img/gallery/large02.jpg",
                "/img/gallery/large03.jpg",
                "/img/gallery/large04.jpg",
                "/img/gallery/large05.jpg",
                "/img/gallery/large06.jpg"
                ];

const gallery = document.querySelector('.gallery');
const image = document.getElementById('image');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentIndex = 0;

function showImage(index) {
    image.src = images[index];
    image.alt = `Imagen ${index + 1}`;
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function startSlideshow() {
    intervalId = setInterval(() => {
      nextImage();
    }, 4000);
  }

/*
    function stopSlideshow() {
        clearInterval(intervalId);
    }
*/

prevButton.addEventListener('click', () => {
    prevImage();
});

nextButton.addEventListener('click', () => {
    nextImage();
});

// Mostrar la primera imagen al cargar la página
showImage(currentIndex);

// Iniciar el pase de diapositivas automáticamente
startSlideshow();