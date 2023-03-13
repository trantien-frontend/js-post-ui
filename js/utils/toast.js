import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#2196f3',
      },
    }).showToast();
  },

  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#4caf50',
      },
    }).showToast();
  },

  erorr(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#f44336',
      },
    }).showToast();
  },
};
