import { onPageLoad } from 'meteor/server-render';

onPageLoad(() => {
    console.log('receiving');
    // TODO should only use this, not the thing that is in mainbody.html at the moment
    // the rehydration by skateJS should get everything to work
    // until then, switch to the rendered version
});
