/* ============================================
   STOCKPRO — sidebar.js
   Gestion du burger / overlay / fermeture
   ============================================ */
 
(function () {
  "use strict";
 
  function initSidebar() {
    const sidebar  = document.getElementById("spSidebar");
    const overlay  = document.getElementById("spOverlay");
    const burger   = document.getElementById("spBurger");
 
    if (!sidebar || !overlay || !burger) return;
 
    function open() {
      sidebar.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
 
    function close() {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
 
    burger.addEventListener("click", () => {
      sidebar.classList.contains("open") ? close() : open();
    });
 
    overlay.addEventListener("click", close);
 
    // Fermer si on clique un lien nav (mobile)
    sidebar.querySelectorAll(".sp-nav a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) close();
      });
    });
 
    // Fermer automatiquement si on passe en desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) close();
    });
  }
 
  // Auth guard commun
  function authGuard() {
    if (!localStorage.getItem("token")) {
      window.location.replace("login.html");
    }
  }
 
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
 
  // Exposer logout globalement
  window.logout = logout;
 
  document.addEventListener("DOMContentLoaded", () => {
    authGuard();
    initSidebar();
  });
})();
 
