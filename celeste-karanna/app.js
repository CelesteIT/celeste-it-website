'use strict';
(() => {
  const campaign = window.CELESTE_CAMPAIGN || {};
  const outlets = (Array.isArray(campaign.outlets) ? campaign.outlets : [])
    .filter(outlet => outlet && outlet.id && outlet.name);
  const $ = id => document.getElementById(id);
  const PLATFORM = {
    uberEats: {label:'Uber Eats', host:'www.ubereats.com', tracking:'uber_eats'},
    pickMeMarket: {label:'PickMe Market', host:'pickme-app-sl.onelink.me', tracking:'pickme_market'}
  };
  const chooser = $('outletChooser');
  const chooserMessage = $('outletChooserMessage');
  const outletSelect = $('outletSelect');
  const status = $('routingStatus');
  let activePlatform = '';
  let locating = false;
  let nearestSuggestion = '';
  let toastTimer = 0;

  $('year').textContent = new Date().getFullYear();

  // Storefront URLs came directly from Marketing's /locations HTML.
  // Validate protocol and platform domain to prevent accidental redirects.
  function storeUrl(outlet, platform) {
    try {
      const raw = outlet[platform];
      const parsed = new URL(raw);
      return parsed.protocol === 'https:' && parsed.hostname === PLATFORM[platform].host
        ? parsed.href : '';
    } catch { return ''; }
  }
  function logoAsset(path) {
    if (typeof path !== 'string' || !path.trim()) return '';
    try {
      const url = new URL(path, window.location.href);
      return ['https:','http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  }
  for (const [platform, id, label] of [
    ['uberEats','uberEatsLogo','Uber Eats'],
    ['pickMeMarket','pickMeMarketLogo','PickMe Market']
  ]) {
    const src = logoAsset((campaign.platformLogos || {})[platform]);
    if (!src) continue;
    const img = new Image();
    img.src = src; img.alt = label; img.decoding='async';
    img.onload = () => $(id).replaceChildren(img);
  }
  // Not a preview placeholder any more: all store links are mapped.
  $('previewNote').hidden = true;

  function toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 4000);
  }
  function setStatus(message) {
    status.hidden = !message;
    status.textContent = message || '';
  }
  function setLocating(isLocating) {
    locating = isLocating;
    for (const id of ['uberEatsLink','pickMeMarketLink']) {
      $(id).classList.toggle('is-locating', isLocating);
      $(id).setAttribute('aria-busy', isLocating ? 'true' : 'false');
    }
  }
  function distanceKm(lat1,lon1,lat2,lon2) {
    const rad = Math.PI / 180;
    const p1=lat1*rad, p2=lat2*rad;
    const a = Math.sin((p2-p1)/2)**2
      + Math.cos(p1)*Math.cos(p2)*Math.sin((lon2-lon1)*rad/2)**2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  function candidates(platform) {
    return outlets.filter(o => storeUrl(o,platform) &&
      Number.isFinite(o.latitude) && Number.isFinite(o.longitude));
  }
  function navigateTo(outlet, platform, method) {
    const url=storeUrl(outlet,platform);
    if (!url) {
      setLocating(false);
      toast('No supported shopping link is configured for this outlet.');
      return;
    }
    // Never send a visitor's GPS coordinates to analytics or store them.
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event:'celeste_shop_click',
        campaign:campaign.campaignName || 'celeste_karanna',
        platform:PLATFORM[platform].tracking,
        outlet_id:outlet.id,
        outlet_name:outlet.name,
        routing_method:method
      });
    }
    // Native app / marketplace link opens in the same tab, avoiding popup
    // blockers that affect geolocation-based asynchronous redirects.
    setStatus(`Opening ${outlet.name} on ${PLATFORM[platform].label}…`);
    setLocating(false);
    if (chooser.open) chooser.close();
    window.setTimeout(() => window.location.assign(url), 180);
  }
  function renderOptions(platform, preferredId = '') {
    outletSelect.replaceChildren();
    const configured=outlets.filter(o => storeUrl(o,platform));
    configured.forEach(outlet => {
      const opt=document.createElement('option');
      opt.value=outlet.id;
      opt.textContent=outlet.name;
      outletSelect.appendChild(opt);
    });
    if (configured.some(o=>o.id===preferredId)) outletSelect.value=preferredId;
  }
  function showManualChoice(message, preferredId='') {
    nearestSuggestion=preferredId;
    setLocating(false);
    setStatus('');
    chooserMessage.textContent=message;
    renderOptions(activePlatform, preferredId);
    if (!outletSelect.options.length) {
      toast('No shopping links are available for this platform.');
      return;
    }
    if (!chooser.open) chooser.showModal();
    outletSelect.focus();
  }
  function routeByLocation(platform) {
    if (locating) return;
    activePlatform=platform;
    const matches=candidates(platform);
    if (!matches.length) {
      showManualChoice('There are no configured outlets for this platform.');
      return;
    }
    setLocating(true);
    setStatus('Finding your nearest Celeste outlet…');
    if (!window.isSecureContext || !navigator.geolocation) {
      showManualChoice('To automatically find your location, open this website over HTTPS. Otherwise, choose an outlet below.');
      return;
    }
    navigator.geolocation.getCurrentPosition(position=>{
      if (!locating) return; // browser may resolve after a manual fallback
      const {latitude,longitude,accuracy}=position.coords;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        showManualChoice('We could not determine a reliable location. Choose an outlet below.');
        return;
      }
      const ranked=matches.map(o=>({
        outlet:o,
        km:distanceKm(latitude,longitude,o.latitude,o.longitude)
      })).sort((a,b)=>a.km-b.km);
      const nearest=ranked[0];
      // The source HTML contains NO precise outlet GPS pins, only outlet names.
      // Use region-level estimates, with a conservative fallback for ambiguity.
      if (nearest.km > 25) {
        showManualChoice('No Celeste outlet appears nearby. Choose a location manually; the shopping app will confirm delivery coverage.',nearest.outlet.id);
        return;
      }
      if (accuracy > 2500) {
        showManualChoice('Your browser gave only an approximate location. Please confirm your outlet.',nearest.outlet.id);
        return;
      }
      if (ranked[1] && ranked[1].km-nearest.km < 0.6) {
        showManualChoice('Two Celeste outlets are very close. Please confirm the one you prefer.',nearest.outlet.id);
        return;
      }
      navigateTo(nearest.outlet, platform, 'browser_geolocation');
    }, error=>{
      if (!locating) return;
      const message=error.code===1
        ? 'Location access was declined. Choose your outlet below.'
        : 'Unable to find your current location. Choose your outlet below.';
      showManualChoice(message);
    },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  }
  for (const [id,platform] of [
    ['uberEatsLink','uberEats'],['pickMeMarketLink','pickMeMarket']
  ]) {
    const button=$(id);
    button.href='#shop';
    button.removeAttribute('target');
    button.removeAttribute('aria-description');
    button.addEventListener('click', event=>{
      event.preventDefault();
      routeByLocation(platform);
    });
  }
  $('manualOutletForm').addEventListener('submit', event=>{
    event.preventDefault();
    const selected=outlets.find(o=>o.id===outletSelect.value);
    if (selected && activePlatform) navigateTo(selected,activePlatform,'manual_selection');
  });
  $('retryLocation').addEventListener('click',()=>{
    if (chooser.open) chooser.close();
    setLocating(false);
    if (activePlatform) routeByLocation(activePlatform);
  });
  $('closeOutletChooser').addEventListener('click',()=>chooser.close());
  chooser.addEventListener('close',()=>{setLocating(false);setStatus('');});

  // Keep all three new videos and all three original image advertisements.
  const galleryVideos = Array.from(document.querySelectorAll('.campaign-ad-video'));
  galleryVideos.forEach(video => {
    const frame=video.closest('.campaign-video-frame');
    video.addEventListener('play',()=>{
      galleryVideos.forEach(other=>{if(other!==video)other.pause();});
      frame.classList.add('is-playing');
    });
    video.addEventListener('pause',()=>frame.classList.remove('is-playing'));
    video.addEventListener('ended',()=>frame.classList.remove('is-playing'));
  });
  document.querySelectorAll('[data-video-target]').forEach(button=>{
    button.addEventListener('click',()=>{
      const video=$(button.dataset.videoTarget);
      if(video) video.play().catch(()=>toast('Please use the video controls to play.'));
    });
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)galleryVideos.forEach(v=>v.pause());
  });
})();
