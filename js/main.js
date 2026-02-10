// Pindahkan fungsi ini ke luar DOMContentLoaded agar terbaca secara global
window.masukWeb = function() {
    const overlay = document.getElementById('videoOverlay');
    const video = document.getElementById('teaserVideo');
    
    if (overlay) {
        overlay.classList.add('overlay-hidden');
    }
    
    // Aktifkan scroll kembali
    document.body.classList.remove('modal-open');
    
    // Pause video landing setelah fade out untuk hemat resource
    if (video) {
        setTimeout(() => {
            video.pause();
        }, 800);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const config = {
        scriptURL: 'https://script.google.com/macros/s/AKfycbxW8vDSSuhEpvwyjIW4F7s3UPiP-Cnxt1cwPlWKN2i6MlZqf-kd_3xCoZ2NRePzM5kK/exec'
    };

    // --- Inisialisasi Galeri (Swiper) ---
    new Swiper('.mySwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        autoplay: { delay: 3000 },
        coverflowEffect: { rotate: 20, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
        pagination: { el: '.swiper-pagination', clickable: true }
    });

    // --- Handle Form Submission ---
    const form = document.getElementById('formReuni');
    const btnSubmit = document.getElementById('tombolSubmit');
    const btnText = document.getElementById('btnText');
    const modal = document.getElementById('modalBerhasil');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const nama = document.getElementById('nama');
            const angkatan = document.getElementById('angkatan');
            const whatsapp = document.getElementById('whatsapp');
            let valid = true;

            [nama, angkatan, whatsapp].forEach(i => {
                if (!i.value.trim()) {
                    i.classList.add('border-red-400');
                    valid = false;
                } else {
                    i.classList.remove('border-red-400');
                }
            });

            if (!valid) {
                alert('Mohon lengkapi seluruh data Anda.');
                return;
            }

            btnSubmit.disabled = true;
            btnText.innerHTML = '<span class="spinner"></span> Mengirim...';

            fetch(config.scriptURL, {
                method: 'POST',
                body: new FormData(form),
                mode: 'no-cors'
            })
            .then(() => {
                modal.style.display = 'flex';
                form.reset();
                btnSubmit.disabled = false;
                btnText.innerHTML = 'Saya Alumni SMAN 31 Jakarta';
            })
            .catch(() => {
                alert('Terjadi gangguan koneksi, silakan coba lagi.');
                btnSubmit.disabled = false;
                btnText.innerHTML = 'Saya Alumni SMAN 31 Jakarta';
            });
        });
    }

    window.tutupModal = function() {
        if (modal) modal.style.display = 'none';
    };
});
