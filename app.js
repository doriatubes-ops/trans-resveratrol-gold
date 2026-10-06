const params = new URLSearchParams(location.search);
const phone = (params.get('fone') || '').replace(/\D/g, '');
const contact = document.querySelector('.whatsapp');
if (contact) contact.addEventListener('click', () => {
 if (phone.length >= 10 && phone.length <= 15) { window.location.href = 'https://wa.me/' + phone; }
 else { document.querySelector('.contact-note').hidden = false; }
});
