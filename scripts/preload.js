document.querySelector('.btn').addEventListener('click', (evt) => {
  evt.target.classList.add('loading');
  setTimeout(() => {
    $('body').addClass('loaded');
    evt.target.classList.add('loaded');
    setTimeout(() => {
      evt.target.classList.remove('loading');
    }, 1000);
  }, 2000);
});
