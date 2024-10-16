export default class Slider {
    constructor() {
        this.btnPrevious = document.querySelector('.btn-previous');
        this.btnNext = document.querySelector('.btn-next');
        this.slides = document.querySelectorAll('.avatar-choice');
        this.slidesContainer = document.querySelector('.avatar-choices');
        this.currentSlideIndex = 0;

        this.updateSlidePosition();

        this.btnPrevious.addEventListener('click', () => this.changeSlide(-1));
        this.btnNext.addEventListener('click', () => this.changeSlide(1));

        window.addEventListener('resize', () => this.updateSlidePosition());

        // Appel de la méthode qui gère le clic sur un avatar
        this.handleAvatarClick();
    }

    // Méthode pour compter le nombre d'avatars visibles
    getVisibleSlidesCount() {
        const containerWidth = this.slidesContainer.offsetWidth;
        const slideWidth = this.slides[0].offsetWidth;
        return Math.floor(containerWidth / slideWidth);
    }

    // Mise à jour de la position du slider
    updateSlidePosition() {
        const slideWidth = this.slides[0].offsetWidth;
        this.slidesContainer.scrollTo({
            left: slideWidth * this.currentSlideIndex,
            behavior: 'smooth'
        });
    }

    // Changement de slide
    changeSlide(direction) {
        const totalSlides = this.slides.length;
        const visibleSlidesCount = this.getVisibleSlidesCount();
        const maxSlideIndex = totalSlides - visibleSlidesCount;

        this.currentSlideIndex = (this.currentSlideIndex + direction + totalSlides) % totalSlides;

        if (this.currentSlideIndex > maxSlideIndex) {
            this.currentSlideIndex = 0;
        }

        this.updateSlidePosition();
    }

    // Méthode pour gérer le clic sur un avatar
    handleAvatarClick() {
        this.slides.forEach(slide => {
            slide.addEventListener('click', () => this.changeAvatar(slide));
        });
    }

    // Méthode qui change l'avatar principal
    changeAvatar(slide) {
        const choosenAvatar = document.querySelector('.img-avatar'); // L'élément de l'avatar principal
        const newAvatarSrc = slide.getAttribute('src');

        // Mise à jour de la source de l'avatar principal
        if (choosenAvatar) {
            choosenAvatar.setAttribute('src', newAvatarSrc);

            // Appliquer la classe 'opacity-50' à tous les avatars
            this.slides.forEach(s => {
                s.classList.add('opacity-50');
            });

            // Retirer la classe 'opacity-50' de l'avatar sélectionné
            slide.classList.remove('opacity-50');
        }
    }
}
