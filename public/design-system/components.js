// Small, framework-independent behaviors for the Phase 2 component showcase.
// No data leaves this page; commerce integration belongs to later phases.
let toastTimer;
export function announce(message) {
  const region = document.querySelector('#toast');
  clearTimeout(toastTimer);
  region.textContent = message;
  toastTimer = setTimeout(() => { region.textContent = ''; }, 4000);
}
export function setupDialogs(root = document) {
  root.querySelectorAll('[data-open]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const dialog = document.getElementById(trigger.dataset.open);
      if (dialog instanceof HTMLDialogElement) dialog.showModal();
    });
  });
  root.querySelectorAll('[data-close]').forEach(control => {
    control.addEventListener('click', () => control.closest('dialog')?.close());
  });
  root.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  });
}
export function setupSizeOptions(root = document) {
  root.querySelectorAll('.size-option:not(:disabled)').forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.size-options').querySelectorAll('button:not(:disabled)').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.querySelector('#size-status').textContent = `Selected size: ${button.textContent}`;
    });
  });
}
export function setupWishlist(root = document) {
  root.querySelectorAll('[data-wishlist]').forEach(button => {
    button.addEventListener('click', () => {
      const saved = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', saved ? 'Remove piece from wishlist' : 'Save piece to wishlist');
      announce(saved ? 'Piece saved.' : 'Piece removed.');
    });
  });
}
export function setupValidation() {
  const form = document.querySelector('#sample-form');
  const email = document.querySelector('#sample-email');
  const error = document.querySelector('#email-error');
  const success = document.querySelector('#form-success');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = email.validity.valid;
    email.setAttribute('aria-invalid', String(!valid));
    error.hidden = valid;
    error.textContent = valid ? '' : 'Enter a valid email address, such as name@example.com.';
    success.hidden = !valid;
    if (!valid) email.focus();
  });
  email.addEventListener('input', () => {
    success.hidden = true;
    email.removeAttribute('aria-invalid');
    error.hidden = true;
  });
}
setupDialogs();
setupSizeOptions();
setupWishlist();
setupValidation();
