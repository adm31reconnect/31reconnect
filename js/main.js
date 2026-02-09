document.addEventListener('DOMContentLoaded',()=>{
const config={
    scriptURL:'https://script.google.com/macros/s/AKfycbxW8vDSSuhEpvwyjIW4F7s3UPiP-Cnxt1cwPlWKN2i6MlZqf-kd_3xCoZ2NRePzM5kK/exec',
    waPanitia:'6287776669897'
};
new Swiper('.mySwiper',{
    effect:'coverflow',
    grabCursor:true,
    centeredSlides:true,
    slidesPerView:'auto',
    loop:true,
    autoplay:{delay:3000},
    coverflowEffect:{rotate:20,stretch:0,depth:100,modifier:1,slideShadows:true},
    pagination:{el:'.swiper-pagination',clickable:true}
});
const form=document.getElementById('formReuni');
const btnSubmit=document.getElementById('tombolSubmit');
const btnText=document.getElementById('btnText');
const modal=document.getElementById('modalBerhasil');
let cacheData={};
form.addEventListener('submit',e=>{
    e.preventDefault();
    const nama=document.getElementById('nama');
    const angkatan=document.getElementById('angkatan');
    const paket=document.getElementById('paket');
    const whatsapp=document.getElementById('whatsapp');
    let valid=true;
    [nama,angkatan,whatsapp].forEach(i=>{
        if(!i.value.trim()){i.classList.add('border-red-400');valid=false;}
        else{i.classList.remove('border-red-400');}
    });
    if(!paket.value){paket.classList.add('border-red-400');valid=false;}
    else{paket.classList.remove('border-red-400');}
    if(!valid){alert('Mohon lengkapi seluruh data dan pilih paket Anda.');return;}
    btnSubmit.disabled=true;
    btnText.innerHTML='<span class="spinner"></span> Mengirim...';
    cacheData={nama:nama.value,angkatan:angkatan.value,paket:paket.value};
    fetch(config.scriptURL,{method:'POST',body:new FormData(form),mode:'no-cors'})
    .then(()=>{
        modal.style.display='flex';
        form.reset();
        btnSubmit.disabled=false;
        btnText.innerHTML='Daftar & Konfirmasi Sekarang';
    })
    .catch(()=>{
        alert('Gangguan koneksi.');
        btnSubmit.disabled=false;
        btnText.innerHTML='Daftar & Konfirmasi Sekarang';
    });
});
window.lanjutKeWA=function(){
    const msg=`Halo Panitia Reuni,

Saya telah mendaftar melalui website:
*Nama:* ${cacheData.nama}
*Angkatan:* ${cacheData.angkatan}
*Paket:* ${cacheData.paket}

Mohon informasi langkah selanjutnya untuk verifikasi pembayaran. Terima kasih!`;
    window.open(`https://wa.me/${config.waPanitia}?text=${encodeURIComponent(msg)}`,'_blank');
    modal.style.display='none';
};
});
