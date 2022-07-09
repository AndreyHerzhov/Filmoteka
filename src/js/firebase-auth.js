import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut  } from "firebase/auth";
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const firebaseConfig = {
  apiKey: "AIzaSyC5kyNHcD6sVFejBN9Z00vsOl4bmbW5BXk",
  authDomain: "filmoteka-teamprojectjs-team6.firebaseapp.com",
  projectId: "filmoteka-teamprojectjs-team6",
  storageBucket: "filmoteka-teamprojectjs-team6.appspot.com",
  messagingSenderId: "421066568411",
  appId: "1:421066568411:web:c3a2298e24d20ece64d2fe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const modal = document.querySelector('#openModal-auth');
const form = document.querySelector('[name="modal-auth"]');
const emailForm = document.querySelector('.modal-auth__email');
const passwordForm = document.querySelector('.modal-auth__password');
const btnLogin = document.querySelector('.modal-auth__btn--login');
const btnLogout = document.querySelector('.modal-auth__btn--logout');
const title = document.querySelector('.modal-auth__title');
const btnOpenModal = document.querySelector('.modal-auth__btn-open');
const btnCloseModal = document.querySelector('.modal-auth__close');
let uid = null;

form.addEventListener('submit', onSubmitLogin);
btnLogout.addEventListener('click', onLogoutBtn);
btnOpenModal.addEventListener('click', onModalOpen);
btnCloseModal.addEventListener('click', onModalClose);
modal.addEventListener('click', onBackdropClickCloseForm);

function onModalOpen (e) {
  e.preventDefault();
  modal.classList.add('modal-open');
  window.addEventListener('keydown', onEscCloseForm);
}

function onModalClose (e) {
  e.preventDefault();
  modal.classList.remove('modal-open');
  window.removeEventListener('keydown', onEscCloseForm);
}

function onSubmitLogin (event) {
  event.preventDefault();
  const email = event.target.elements.email.value;
  const password = event.target.elements.password.value;
  
  if(email.length < 5 || password.length < 6) {
    Notify.warning('Please, enter your email and password (at least 6 characters)')
    return
  }
  
  loginUserFirebase (auth, email, password);
  
}

function loginUserFirebase (auth, email, password) {createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    uid = user.uid;
    const userName = user.email.split('@')[0];
    Notify.success(`Hello ${userName}, have a nice journy`)
    form.reset();
    setTimeout(onModalHide, 2000);   
})
  .catch((error) => {
    const errorMessage = error.message;
    const errorUserExist = "Firebase: Error (auth/email-already-in-use).";
    const errorShortPassword = "Firebase: Password should be at least 6 characters (auth/weak-password)."
    if (errorMessage === errorShortPassword) {
      Notify.warning("Password should be at least 6 characters")
    }
    
    if (errorUserExist === errorMessage) {
        singinUserFirebase (auth, email, password);
        }});
    } 

function singinUserFirebase (auth, email, password) { signInWithEmailAndPassword(auth, email, password)    
  .then((userCredential) => {
    const user = userCredential.user;
    uid = user.uid;
    const userName = user.email.split('@')[0];
    Notify.success(`Welcome back ${userName}, have a nice journy`)
    form.reset();
    setTimeout(onModalHide, 2000);

  })
  .catch((error) => {
    const errorMessage = error.message;
    const invalidPassword = 'Firebase: Error (auth/wrong-password).'
    if (errorMessage === invalidPassword) {
      Notify.failure("Password wrong. Please enter valid password")
    }
  });
    }

function onLogoutBtn () {     
    const auth = getAuth();
    signOut(auth);
    Notify.warning("Good luck, come back soon");
    setTimeout(onModalHide, 2000);
    };

onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      emailForm.classList.add('is-hidden-auth');
      passwordForm.classList.add('is-hidden-auth');
      btnLogin.classList.add('is-hidden-auth');
      btnLogout.classList.remove('is-hidden-auth');
      title.textContent = `Hello, ${user.email.split('@')[0]}`;
      btnOpenModal.textContent = "LogOut";
      btnOpenModal.style.borderRight = "3px solid #69ff00";
    } else {
      uid = null;
      emailForm.classList.remove('is-hidden-auth');
      passwordForm.classList.remove('is-hidden-auth');
      btnLogin.classList.remove('is-hidden-auth');
      btnLogout.classList.add('is-hidden-auth');
      title.textContent = "Login form";
      btnOpenModal.textContent = "Login";
      btnOpenModal.style.borderRight = "3px solid #ff001b";

    }
  });

function onEscCloseForm(e) {
  if (e.code === 'Escape') {
    onModalHide ();
  }
}

function onBackdropClickCloseForm(e) {
  if (e.target === e.currentTarget) {
    onModalHide ();
  }
}

function onModalHide () {
  modal.classList.remove('modal-open');
  window.removeEventListener('keydown', onEscCloseForm);
}