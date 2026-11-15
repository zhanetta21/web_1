
// Shared theme across every page.
const themeButton = document.getElementById('themeToggle');
function applyTheme() {
  const dark = localStorage.getItem('bloom-theme') === 'dark';
  document.body.classList.toggle('night-mode', dark);
  if (themeButton) { themeButton.textContent = dark ? 'Light mode' : 'Dark mode'; themeButton.setAttribute('aria-pressed', String(dark)); }
}
applyTheme();
if (themeButton) themeButton.addEventListener('click', () => { localStorage.setItem('bloom-theme', document.body.classList.contains('night-mode') ? 'light' : 'dark'); applyTheme(); });

// The Bloom is a front-end-only school demo. Local storage is not secure for real passwords.
const emailOK = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOK = v => /^\+?[\d\s()-]{10,20}$/.test(v) && (v.match(/\d/g)||[]).length >= 10;
const passwordOK = v => v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
function validate(form, names) {
  let valid = true;
  for (const name of names) {
    const input = form.querySelector('#' + name);
    const error = form.querySelector('#' + name + '-error');
    if (!input || !error) continue;
    const value = input.value.trim();
    let message = !value ? 'This field is required.' : '';
    if (!message && name === 'email' && !emailOK(value)) message = 'Please enter a valid email.';
    if (!message && name === 'phone' && !phoneOK(value)) message = 'Enter a valid phone number with at least 10 digits.';
    if (!message && name === 'password' && form.id !== 'loginForm' && !passwordOK(value)) message = 'Use 8+ characters with uppercase, lowercase and a number.';
    if (!message && name === 'message' && value.length < 5) message = 'Please write at least 5 characters.';
    if (!message && name === 'name' && value.length < 2) message = 'Please enter at least 2 characters.';
    if (!message && name === 'time' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) message = 'Choose a valid time.';
    if (!message && name === 'guests' && (!Number.isInteger(Number(value)) || Number(value)<1 || Number(value)>20)) message = 'Choose between 1 and 20 guests.';
    if (!message && name === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10))) message = 'Please choose today or a future date.';
    error.textContent = message; input.setAttribute('aria-invalid',String(Boolean(message)));
    if (message) valid = false;
  }
  return valid;
}
const signup = document.getElementById('signupForm');
if (signup) signup.addEventListener('submit', e => {
  e.preventDefault(); if (!validate(signup,['name','email','phone','password'])) return;
  const user = {name:signup.querySelector('#name').value.trim(),email:signup.querySelector('#email').value.trim().toLowerCase(),phone:signup.querySelector('#phone').value.trim(),password:signup.querySelector('#password').value};
  const existing = JSON.parse(localStorage.getItem('bloom-user') || 'null');
  if (existing && existing.email === user.email) { document.getElementById('formMessage').textContent = 'This email is already registered. Please log in.'; return; }
  localStorage.setItem('bloom-user',JSON.stringify(user));
  localStorage.setItem('bloom-session',user.email); location.href='profile.html';
});
const login = document.getElementById('loginForm');
if (login) login.addEventListener('submit', e => {
  e.preventDefault(); if (!validate(login,['email','password'])) return;
  let user=null; try { user=JSON.parse(localStorage.getItem('bloom-user')||'null'); } catch (_) { user=null; }
  if (user && user.email===login.querySelector('#email').value.trim().toLowerCase() && user.password===login.querySelector('#password').value) {
    localStorage.setItem('bloom-session',user.email);location.href='profile.html';
  } else document.getElementById('formMessage').textContent='Incorrect email or password. Please try again.';
});
const profile=document.getElementById('profileDetails');
if (profile) {
  let user=null; try { user=JSON.parse(localStorage.getItem('bloom-user')||'null'); } catch (_) { user=null; }
  const session=localStorage.getItem('bloom-session');
  if (!user || session!==user.email) {profile.textContent='Please log in to view your profile.';document.getElementById('logoutButton').hidden=true;}
  else {for(const [label,value] of [['Name',user.name],['Email',user.email],['Phone',user.phone]]) {const p=document.createElement('p');p.textContent=label+': '+value;profile.append(p);}}
  document.getElementById('logoutButton').addEventListener('click',()=>{localStorage.removeItem('bloom-session');location.href='login.html';});
}
for (const [id,names,success] of [
  ['contactForm',['name','email','phone','message'],'Thank you! Your message was saved in this browser.'],
  ['reserveForm',['name','email','phone','date','time','guests'],'Your reservation request was saved locally. This is not a confirmed booking.']
]) {
  const form=document.getElementById(id);
  if (form) form.addEventListener('submit',e=>{
    e.preventDefault();if(!validate(form,names))return;
    const data=Object.fromEntries(names.map(n=>[n,form.querySelector('#'+n).value.trim()]));
    localStorage.setItem('bloom-'+id,JSON.stringify(data));
    form.querySelector('#formMessage').textContent=success;form.reset();
  });
}
// Menu filtering and live search.
const categories=[...document.querySelectorAll('.menu-category')];
const search=document.getElementById('menuSearch');
const filterButtons=[...document.querySelectorAll('#menuFilters button')];
if(categories.length) {
  let selected=localStorage.getItem('bloom-category')||'all';
  function updateMenu() {
    const query=(search?.value||'').trim().toLowerCase();let count=0;
    for(const category of categories) {
      const match=selected==='all'||category.dataset.category===selected;
      let visible=0;
      for(const card of category.querySelectorAll('.bloom-bootstrap-card')) {
        const show=match && card.textContent.toLowerCase().includes(query);card.hidden=!show;if(show)visible++;
      }
      category.hidden=visible===0;count+=visible;
    }
    const label=document.getElementById('menuCount');if(label)label.textContent='Showing '+count+' menu items';
    for(const button of filterButtons) {const active=button.dataset.category===selected;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));}
  }
  for(const button of filterButtons)button.addEventListener('click',()=>{selected=button.dataset.category;localStorage.setItem('bloom-category',selected);updateMenu();});
  if(search){search.value=localStorage.getItem('bloom-search')||'';search.addEventListener('input',()=>{localStorage.setItem('bloom-search',search.value);updateMenu();});}
  updateMenu();
}
// Live weather via the public Open-Meteo API (no key required).
const weatherButton=document.getElementById('weatherButton');
if(weatherButton) weatherButton.addEventListener('click',async()=>{
  const result=document.getElementById('weatherResult');result.textContent='Loading weather...';weatherButton.disabled=true;
  try {
    const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FAlmaty');
    if(!response.ok)throw new Error('Weather service unavailable');
    const data=await response.json();if(!data.current)throw new Error('Missing weather data');
    result.textContent=`Astana now: ${data.current.temperature_2m}°C, humidity ${data.current.relative_humidity_2m}%, wind ${data.current.wind_speed_10m} km/h.`;
  } catch(err) {result.textContent='Could not load weather. Please try again later.';}
  finally {weatherButton.disabled=false;}
});
// Small existing content interactions retained where they work.
const readMore=document.getElementById('readMoreButton');
if(readMore)readMore.addEventListener('click',()=>{const extra=document.getElementById('extraStory');if(!extra)return;extra.hidden=!extra.hidden;readMore.textContent=extra.hidden?'Read More':'Read Less';});
for(const question of document.querySelectorAll('.faq-question'))question.addEventListener('click',()=>{const answer=question.nextElementSibling;if(answer){const expanded=answer.classList.toggle('active');question.setAttribute('aria-expanded',String(expanded));}});

// Show the correct navigation options for the current local demo session.
function updateAuthNavigation() {
  let loggedIn = false;
  try {
    const user = JSON.parse(localStorage.getItem('bloom-user') || 'null');
    loggedIn = Boolean(user && localStorage.getItem('bloom-session') === user.email);
  } catch (_) { loggedIn = false; }
  document.querySelectorAll('.auth-guest').forEach(el => { el.hidden = loggedIn; });
  document.querySelectorAll('.auth-user').forEach(el => { el.hidden = !loggedIn; });
}
updateAuthNavigation();
document.getElementById('navLogout')?.addEventListener('click', () => {
  localStorage.removeItem('bloom-session');
  location.href = 'index.html';
});

// Star rating with accessible labels and saved selection.
const ratingStars = [...document.querySelectorAll('.rating-star')];
if (ratingStars.length) {
  let rating = Number(localStorage.getItem('bloom-rating')) || 0;
  function drawRating() {
    ratingStars.forEach(star => {
      const selected = Number(star.dataset.rating) <= rating;
      star.classList.toggle('selected', selected);
      star.setAttribute('aria-pressed', String(Number(star.dataset.rating) === rating));
    });
    document.getElementById('ratingMessage').textContent = rating
      ? `Thank you for rating us ${rating} out of 5 stars!` : 'Select a star to rate us.';
  }
  ratingStars.forEach(star => star.addEventListener('click', () => {
    rating = Number(star.dataset.rating);
    localStorage.setItem('bloom-rating', String(rating));
    drawRating();
  }));
  drawRating();
}

// Copy the live URL, or the home-page URL when testing locally.
const copyButton = document.getElementById('copyButton');
if (copyButton) {
  const copyInput = document.getElementById('copyText');
  const websiteUrl = new URL('index.html', window.location.href).href;
  copyInput.value = websiteUrl;
  copyButton.addEventListener('click', async () => {
    const message = document.getElementById('copyMessage');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(websiteUrl);
      } else {
        copyInput.focus(); copyInput.select();
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
      }
      message.textContent = 'Website link copied!';
    } catch (_) {
      copyInput.focus(); copyInput.select();
      message.textContent = 'Select the link and press Cmd+C (Mac) or Ctrl+C (Windows).';
    }
  });
}
