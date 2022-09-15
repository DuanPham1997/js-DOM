'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click',function(e){
  section1.scrollIntoView({behavior:'smooth'});
});

// btnScrollTo.addEventListener('click',function(e){
//   // lay vi tri va kich thuoc cua section1 trong trag web
//  const s1coords = section1.getBoundingClientRect();
//  //c1: scroll toi vi tri element section1
// //  window.scrollTo({
// //   left:s1coords.left + window.pageXOffset,
// //   top:s1coords.top + window.pageYOffset,
// //   behavior:'smooth'
// //  });
// //c2
// section1.scrollIntoView({behavior:'smooth'});
// });

// section2.addEventListener('click',function(e){
//   section1.scrollIntoView({behavior:'smooth'});
// });

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//      e.preventDefault();
//      const id = this.getAttribute('href');
//      document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   })
// });
//use propagation 
//b1:add event listener to common parent element
//b2:xd yeu to tao ra su kien

document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  //ktra click vao link 
  if(e.target.classList.contains('nav__link')){
   const id = e.target.getAttribute('href');
   document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});

//tab component 


tabsContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return ;
  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //active tab
  clicked.classList.add('operations__tab--active');

  //active content area 
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

//function handleHover 

const handleHover = function(e,opacity){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
     if(el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
   }
}

//menu fade animation 
nav.addEventListener('mouseover',function(e){
  handleHover(e,0.5);
  
});

nav.addEventListener('mouseout',function(e){
 handleHover(e,1);
})

//sticky navigation 
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll',function(){
//   //window.scrollY tra ve vi tri khi cuon
// if(this.window.scrollY > initialCoords.top)  nav.classList.add('sticky');

// else nav.classList.remove('sticky');

// });

// intersection observer API

// const obsCallback = function(entries,observer){
//   entries.forEach(entry =>{
//     console.log(entry);
//   });
// }

// const obsOptions = {
//   root:null,
//   threshold:0.1 // giao nhau 10%   example [0,0.2] giao nhau tu 0 -> 20%
// }

// const observer = new IntersectionObserver(obsCallback,obsOptions);

// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries){
  const [entry] = entries; // entries is array [entry] <=> entries[0]
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(
  stickyNav,{
    root:null,// phan tu parent cua element dc lang nghe null <=> document
    threshold:0,
    rootMargin:`${navHeight}px`
  }
);

headerObserver.observe(header);

//reveal section 
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  
  // sectionObserver.unobserver(entry.target);
}
const sectionObserver = new IntersectionObserver(
  revealSection,{
    root: null,
    threshold: 0.15,
  }
);

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})
//lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });

  // imgObserver.unobserver(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg,{
  root:null,
  threshold:0,
  rootMargin:'200px'
});

imgTargets.forEach(img => imgObserver.observe(img));