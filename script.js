/**
 * Archivo principal de JS
 * Funciones: menú móvil, filtros de galería, carrusel, lightbox y animaciones con IntersectionObserver.
 */

(function () {
    "use strict";

    // ---------------------- CONST ----------------------
    // Declaración de elementos del DOM y variables constantes globales utilizadas en el script

    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("menu__nav-dropdown");
    const allFilter = document.createElement("button");
    const filterLine = document.querySelector(".photography-section__gallery-filters-line");

    // Definición de filtros y sus respectivas galerías asociadas
    const filters = {
        all: [
            ".photography-section__outdoor-gallery",
            ".photography-section__architecture-gallery",
            ".photography-section__travel-gallery",
            ".photography-section__product-gallery",
        ].map(sel => document.querySelector(sel)),
        outdoor: [document.querySelector(".photography-section__outdoor-gallery")],
        architecture: [document.querySelector(".photography-section__architecture-gallery")],
        travel: [document.querySelector(".photography-section__travel-gallery")],
        product: [document.querySelector(".photography-section__product-gallery")],
    };

    const filterButtons = document.querySelectorAll(".photography-filter");

    // Elementos del carrusel audiovisual
    const track = document.querySelector(".media-section__carousel-track");
    const items = document.querySelectorAll(".media-section__carousel-item");
    const prevBtn = document.querySelector(".media-section__carousel-btn.prev");
    const nextBtn = document.querySelector(".media-section__carousel-btn.next");

    // ---------------------- VAR ----------------------
    // Variables que pueden cambiar de valor en el tiempo, como la cantidad visible y el índice actual

    let visibleItems = window.innerWidth > 768 ? 3 : 1;
    let index = visibleItems;
    let isTransitioning = false;

    // ---------------------- FUNCIONES ----------------------

    // ---------------------- MENU

    // Cierra el menú móvil si se hace clic fuera de él
    const closeMenuOnClickOutsideHandler = (e) => {
        if (!mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target) &&
            !mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.add("hidden");
        }
    };

    // Cierra el menú móvil al hacer clic en un enlace del mismo
    const closeMenuOnLinkClickHandler = () => {
        mobileMenu.classList.add("hidden");
    }

    // ---------------------- GALLERIA

    // Muestra una galería específica según el filtro seleccionado

    const showGalleryHandler = (key) => {
        Object.values(filters).flat().forEach(section => {
            section.style.display = "none";
        });

        filters[key].forEach(section => {
            section.style.display = "grid";

            // Animación progresiva de las imágenes visibles
            const images = section.querySelectorAll(".photography-section__picture");
            images.forEach((img, i) => {
                img.classList.remove("visible"); //Reset si ya tiene animación
                setTimeout(() => {
                    img.classList.add("visible");

                }, i * 80); //efecto cascada
            });
        });
    };

    // Establece visualmente qué filtro está activo

    const setActiveFilterHandler = (filterButton) => {
        document.querySelectorAll(".photography-filter").forEach(f => f.classList.remove("active"));
        filterButton.classList.add("active");
    };

    // Detecta qué botón fue presionado y muestra la galería correspondiente

    const galleryFilterClickHandler = (filterButton) => {
        setActiveFilterHandler(filterButton);
        if (filterButton.classList.contains("photography-section__all-filter")) {
            showGalleryHandler("all");
        } else if (filterButton.classList.contains("photography-section__outdoor-filter")) {
            showGalleryHandler("outdoor");
        } else if (filterButton.classList.contains("photography-section__architecture-filter")) {
            showGalleryHandler("architecture");
        } else if (filterButton.classList.contains("photography-section__travel-filter")) {
            showGalleryHandler("travel");
        } else if (filterButton.classList.contains("photography-section__product-filter")) {
            showGalleryHandler("product");
        }
    };

    // ---------------------- CAROUSEL

    // Actualiza la cantidad de elementos visibles en el carrusel, según el tamaño de pantalla

    const updateVisibleItemsHandler = () => {
        visibleItems = window.innerWidth > 768 ? 3 : 1;
    };

    // Actualiza la posición del carrusel
    const updateCarouselPositionHandler = (animate = true) => {
        const slideWidth = items[0].offsetWidth;
        track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
        track.style.transform = `translateX(-${slideWidth * index}px)`;
    };

    // Muestra el siguiente grupo de ítems en el carrusel
    const goToNextHandler = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        const remainingItems = items.length - index - visibleItems;
        if (remainingItems === 0) {
            index = visibleItems;
            updateCarouselPositionHandler(false);
            isTransitioning = false;
            return;
        }
        index++;
        updateCarouselPositionHandler();

        // Una vez termina la transición, valida si se debe reiniciar la posición

        track.addEventListener("transitionend", function handler() {
            track.removeEventListener("transitionend", handler);
            if (index >= items.length - visibleItems) {
                index = visibleItems;
                updateCarouselPositionHandler(false);
            }
            isTransitioning = false;
        });
    };

    // Muestra el grupo anterior en el carrusel
    const goToPrevHandler = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        index--;
        updateCarouselPositionHandler();
        track.addEventListener("transitionend", function handler() {
            track.removeEventListener("transitionend", handler);
            if (index < visibleItems) {
                index = items.length - visibleItems * 2;
                updateCarouselPositionHandler(false);
            }
            isTransitioning = false;
        });
    };

    // ---------------------- EVENTOS ----------------------

    // Evento para abrir/cerrar el menú móvil
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

    // Evento para cerrar el menú móvil al hacer clic fuera
    document.addEventListener("click", closeMenuOnClickOutsideHandler);

    // Cierre del menú al hacer clic en un enlace
    mobileMenu.querySelectorAll(".menu__link").forEach(link =>
        link.addEventListener("click", closeMenuOnLinkClickHandler)
    );

    // Agrega dinámicamente el botón "ALL" al inicio de los filtros
    allFilter.textContent = "ALL";
    allFilter.classList.add("photography-filter", "photography-section__all-filter", "active");
    filterLine.prepend(allFilter);

    // Muestra todas las galerías al cargar la página
    showGalleryHandler("all");

    // Asigna el evento de filtrado a cada botón
    document.querySelectorAll(".photography-filter").forEach(filter =>
        filter.addEventListener("click", () => galleryFilterClickHandler(filter))
    );

    // Controladores del carrusel
    nextBtn.addEventListener("click", goToNextHandler);
    prevBtn.addEventListener("click", goToPrevHandler);

    // Al cargar la página, establece los valores iniciales del carrusel
    window.addEventListener("load", () => {
        updateVisibleItemsHandler();
        index = visibleItems;
        updateCarouselPositionHandler(false);
    });

    // Al redimensionar la ventana, actualiza los ítems visibles y su posición
    window.addEventListener("resize", () => {
        updateVisibleItemsHandler();
        index = visibleItems;
        updateCarouselPositionHandler(false);
    });

    // ---------------------- LIGHTBOX GALLERY ----------------------

    // Variables y elementos base para el lightbox
    let currentIndex = -1;
    let filteredImages = [];

    // Crear e insertar la estructura del lightbox en el DOM
    const lightboxOverlay = document.createElement("div");
    lightboxOverlay.classList.add("lightbox__overlay");

    const lightboxContent = document.createElement("div");
    lightboxContent.classList.add("lightbox__content");

    const lightboxTrack = document.createElement("div");
    lightboxTrack.classList.add("lightbox__track");

    const closeButton = document.createElement("button");
    closeButton.classList.add("lightbox__close");
    closeButton.textContent = "✖";

    const lightboxPrevBtn = document.createElement("button");
    lightboxPrevBtn.classList.add("lightbox__prev");
    lightboxPrevBtn.textContent = "❮"

    const lightboxNextBtn = document.createElement("button");
    lightboxNextBtn.classList.add("lightbox__next");
    lightboxNextBtn.textContent = "❯"

    // Insertar todo en el DOM
    lightboxContent.appendChild(closeButton);
    lightboxContent.appendChild(lightboxPrevBtn);
    lightboxContent.appendChild(lightboxTrack);
    lightboxContent.appendChild(lightboxNextBtn);
    lightboxOverlay.appendChild(lightboxContent);
    document.body.appendChild(lightboxOverlay);

    // Actualiza la posición de la imagen mostrada en el lightbox
    const updateTrackPositionHandler = () => {
        const slideWidth = lightboxContent.offsetWidth;
        lightboxTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    // Actualiza los puntos activos del lightbox
    const updateDotsHandler = () => {
        const dots = document.querySelectorAll(".lightbox__dot");
        dots.forEach((dot, index) => {
            dot.style.opacity = index === currentIndex ? "1" : "0.4";
        });
    };

    // Actualiza visibilidad de botones next/prev en el lightbox
    const updateNavButtonsHandler = () => {
        lightboxPrevBtn.style.display = currentIndex > 0 ? "block" : "none";
        lightboxNextBtn.style.display = currentIndex < filteredImages.length - 1 ? "block" : "none";
    };

    // Crea puntos de navegación (dots) para el lightbox y los asocia a su índice
    const createDotsHandler = () => {
        let dotContainer = document.querySelector(".lightbox__dots");
        if (!dotContainer) {
            dotContainer = document.createElement("div");
            dotContainer.classList.add("lightbox__dots");
            lightboxContent.appendChild(dotContainer);
        } else {
            dotContainer.innerHTML = "";
        }
        filteredImages.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.classList.add("lightbox__dot");
            dot.style.opacity = i === currentIndex ? "1" : "0.4";
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateTrackPositionHandler();
                updateDotsHandler();
                updateNavButtonsHandler();
            });
            dotContainer.appendChild(dot);
        });
    };
    // Muestra el lightbox con las imágenes visibles actuales, comenzando por la imagen seleccionada
    const openLightboxHandler = (index, images) => {
        filteredImages = images;
        currentIndex = index;
        lightboxTrack.innerHTML = "";
        filteredImages.forEach(img => {
            const slide = document.createElement("div");
            slide.classList.add("lightbox__slide");
            const image = document.createElement("img");
            image.src = img.currentSrc;
            slide.appendChild(image);
            lightboxTrack.appendChild(slide);
        });
        lightboxOverlay.classList.add("open");
        createDotsHandler();
        setTimeout(() => {
            updateTrackPositionHandler();
            updateDotsHandler();
            updateNavButtonsHandler();
        }, 50);
    };

    // Cierra el lightbox
    const closeLightboxHandler = () => {
        lightboxOverlay.classList.remove("open");
    };

    // Navega a la siguiente imagen del lightbox
    const goNextHandler = () => {
        if (currentIndex < filteredImages.length - 1) {
            currentIndex++;
            updateTrackPositionHandler();
            updateDotsHandler();
            updateNavButtonsHandler();
        }
    };

    // Navega a la imagen anterior del lightbox
    const goPrevHandler = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateTrackPositionHandler();
            updateDotsHandler();
            updateNavButtonsHandler();
        }
    };

    // Asocia el evento de apertura del lightbox
    const setupLightboxForVisibleImagesHandler = () => {
        const allImages = Array.from(document.querySelectorAll(".photography-section__picture img"));
        const visibleImages = allImages.filter(img => img.offsetParent !== null);
        allImages.forEach(img => {
            if (img._lightboxHandler) {
                img.removeEventListener("click", img._lightboxHandler);
                delete img._lightboxHandler;
            }
        });
        visibleImages.forEach((img, index) => {
            const handler = () => openLightboxHandler(index, visibleImages);
            img._lightboxHandler = handler;
            img.addEventListener("click", handler);
        });
    };

    // Eventos para el lightbox (clic, botones, swipe)
    lightboxOverlay.addEventListener("click", (e) => {
        if (e.target === lightboxOverlay) closeLightboxHandler();
    });
    closeButton.addEventListener("click", closeLightboxHandler);
    lightboxNextBtn.addEventListener("click", goNextHandler);
    lightboxPrevBtn.addEventListener("click", goPrevHandler);

    // Swipe para mobile
    let startX = 0;
    lightboxTrack.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    lightboxTrack.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) goNextHandler();
        else if (endX - startX > 50) goPrevHandler();
    });

    // Inicializa eventos del lightbox para imágenes visibles
    setupLightboxForVisibleImagesHandler();
    document.querySelectorAll(".photography-filter").forEach(filter =>
        filter.addEventListener("click", () => {
            setTimeout(setupLightboxForVisibleImagesHandler, 50);
        })
    );

    // ---------------------- INTERSECTION OBSERVER ----------------------

    // Aplica la clase 'visible' a los elementos cuando entran en pantalla para mejorar la first load 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".scroll-reveal").forEach(el => {
        observer.observe(el);
    });
})();