/* eslint-disable no-console */
import { register } from 'register-service-worker';
import Vue from 'vue';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n'
        + 'For more details, visit https://goo.gl/AFskqB',
      );
    },
    registered() {
      console.log('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated() {
      Vue.toasted.show('New Version Available!', {
        theme: 'bubble',
        position: 'bottom-center',
        duration: 5000,
        action: {
          text: 'RELOAD',
          onClick: () => {
            window.location.reload(true);
          },
        },
      });
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
