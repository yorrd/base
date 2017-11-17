import { onPageLoad } from 'meteor/server-render';

onPageLoad(() => {
    console.log('receiving');
    // TODO should only use this, not the thing that is in mainbody.html at the moment
    // the rehydration by skateJS should get everything to work
    // until then, switch to the rendered version
    // const ssr = document.querySelector('#ssr');
    // ssr.style.position = 'absolute';
    // ssr.style.left = '0';
    // ssr.style.right = '0';
    // ssr.style.bottom = '0';
    // ssr.style.top = '0';
});
