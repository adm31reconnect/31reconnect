document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // 1. TOMBOL MASUK WEBSITE
    // =====================================
    const btnMasuk = document.getElementById('btnMasukWeb');
    const overlay = document.getElementById('videoOverlay');
    const video = document.getElementById('teaserVideo');

    if (btnMasuk) {
        btnMasuk.addEventListener('click', () => {
            if (overlay) {
                overlay.classList.add('overlay-hidden');
                setTimeout(() => overlay.remove(), 900);
            }
            document.body.classList.remove('modal-open');
            if (video) video.pause();
        });
    }

    // =====================================
    // 2. KONFIG GOOGLE SHEET
    // =====================================
    const config = {
        scriptURL: 'https://script.google.com/macros/s/AKfycbxW8vDSSuhEpvwyjIW4F7s3UPiP-Cnxt1cwPlWKN2i6MlZqf-kd_3xCoZ2NRePzM5kK/exec'
    };

    // =====================================
    // 3. LOGIKA PEKERJAAN LAINNYA
    // =====================================
    const inputPekerjaan = document.getElementById('pekerjaan');
    const wrapperLainnya = document.getElementById('wrapperLainnya');
    const inputLainnya = document.getElementById('pekerjaanLainnya');

    if (inputPekerjaan) {
        inputPekerjaan.addEventListener('change', function () {
            if (this.value === 'Lainnya') {
                wrapperLainnya.classList.remove('hidden');
                inputLainnya.value = '';
            } else {
                wrapperLainnya.classList.add('hidden');
                inputLainnya.value = '';
            }
        });
    }

    // =====================================
    // 4. SWIPER GALERI
    // =====================================
    if (typeof Swiper !== "undefined") {
        new Swiper('.mySwiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: { delay: 3000 },
            coverflowEffect: {
                rotate: 20,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });
    }

    // =====================================
    // 5. FORM SUBMIT (ANTI DOBEL)
    // =====================================
    const form = document.getElementById('formReuni');
    const btnSubmit = document.getElementById('tombolSubmit');
    const btnText = document.getElementById('btnText');
    const modal = document.getElementById('modalBerhasil');

    let isSubmitting = false;

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            if (isSubmitting) return;
            isSubmitting = true;

            const nama = document.getElementById('nama');
            const angkatan = document.getElementById('angkatan');
            const whatsapp = document.getElementById('whatsapp');
            const alamat = document.getElementById('alamat');

            let valid = true;

            let fieldsToValidate = [
                nama,
                angkatan,
                whatsapp,
                inputPekerjaan,
                alamat
            ];

            if (inputPekerjaan.value === 'Lainnya') {
                fieldsToValidate.push(inputLainnya);
            }

            fieldsToValidate.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('border-red-400');
                    valid = false;
                } else {
                    field.classList.remove('border-red-400');
                }
            });

            if (!valid) {
                alert('Mohon lengkapi seluruh data Anda.');
                isSubmitting = false;
                return;
            }

            btnSubmit.disabled = true;
            btnText.innerHTML = '<span class="spinner"></span> Mengirim...';

            const formData = new FormData(form);

            if (inputPekerjaan.value === 'Lainnya') {
                formData.set('Pekerjaan', 'Lainnya: ' + inputLainnya.value.trim());
            }

            fetch(config.scriptURL, {
                method: 'POST',
                body: formData
            })
            .then(() => {
                modal.style.display = 'flex';
                form.reset();
                wrapperLainnya.classList.add('hidden');
            })
            .catch(() => {
                alert('Terjadi gangguan koneksi, silakan coba lagi.');
            })
            .finally(() => {
                btnSubmit.disabled = false;
                btnText.innerHTML = 'Saya Alumni SMAN 31 Jakarta';
                isSubmitting = false;
            });
        });
    }

// =====================================
// 6. DASHBOARD (TOP 5 ANGKATAN SAJA)
// =====================================

let chartAngkatanInstance = null;

function loadDashboard() {

    fetch(config.scriptURL + "?action=stats")
        .then(res => res.json())
        .then(data => {

            const totalEl = document.getElementById("totalAlumni");
            if (totalEl) {
                totalEl.innerText = data.totalAlumni || 0;
            }

            const canvasAngkatan = document.getElementById("chartAngkatan");
            if (!canvasAngkatan) return;

            if (chartAngkatanInstance) {
                chartAngkatanInstance.destroy();
            }

            const angkatanFiltered = data.angkatanStats
                .filter(a => a.name.length === 4 && !isNaN(a.name))
                .sort((a, b) => b.total - a.total)
                .slice(0, 5);

            const angkatanLabels = angkatanFiltered.map(a => a.name);
            const angkatanValues = angkatanFiltered.map(a => a.total);

            chartAngkatanInstance = new Chart(canvasAngkatan, {
                type: 'bar',
                data: {
                    labels: angkatanLabels,
                    datasets: [{
                        data: angkatanValues,
                        backgroundColor: '#1e3a8a',
                        borderRadius: 12,
                        barPercentage: 0.6,
                        categoryPercentage: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: { top: 30 }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: '#334155',
                                font: {
                                    size: 12,
                                    weight: '600'
                                }
                            }
                        },
                        y: {
                            display: false,
                            grid: { display: false },
                            beginAtZero: true
                        }
                    },
                    animation: { duration: 1000 }
                },
                plugins: [{
                    id: 'valueLabel',
                    afterDatasetsDraw(chart) {
                        const { ctx } = chart;
                        ctx.save();
                        chart.data.datasets[0].data.forEach((value, index) => {
                            const meta = chart.getDatasetMeta(0);
                            const bar = meta.data[index];
                            ctx.fillStyle = '#0f172a';
                            ctx.font = 'bold 14px Inter';
                            ctx.textAlign = 'center';
                            ctx.fillText(value, bar.x, bar.y - 10);
                        });
                    }
                }]
            });

        })
        .catch(err => {
            console.log("Error dashboard:", err);
        });
}

setTimeout(loadDashboard, 500);

    // =====================================
    // 7. TUTUP MODAL
    // =====================================
    window.tutupModal = function () {
        if (modal) modal.style.display = 'none';
    };

});
