// Home Page Navigation And Toggle Menu 
document.addEventListener('DOMContentLoaded', () => {
  let tm = document.querySelector(".toggle-menu");
  let tl = document.querySelector(".main-nav");

  if (tm && tl) {
    tm.onclick = function (e) {
      e.stopPropagation();
      this.classList.toggle("menu-active");
      tl.classList.toggle("open");
    };

    document.addEventListener("click", (e) => {
      if (e.target !== tm && e.target !== tl) {
        if (tl.classList.contains("open")) {
          tm.classList.remove("menu-active");
          tl.classList.remove("open");
        }
      }
    });

    tl.onclick = function (e) {
      e.stopPropagation();
    };
  }

  let navLinks = document.querySelectorAll('.links-container ul li a');
  let navLinksArr = Array.from(navLinks);
  window.addEventListener('load', function () {
    let pgTitle = document.title;
    navLinksArr.forEach((el) => {
      if (el.innerText === pgTitle) {
        navLinksArr.forEach((el) => {
          el.classList.remove("active");
        });
        el.classList.add("active");
      }
    });
  });
  navLinksArr.forEach((el) => {
    el.addEventListener("click", function (e) {
      navLinksArr.forEach((el) => {
        el.classList.remove("active");
      });
      e.currentTarget.classList.add("active");
    });
  });

  function observeElement(id, url) {
    const aE = document.getElementById(id);
    const designerElement = document.querySelector('a.designer');

    if (!aE || !designerElement) {
      window.location.href = url;
      return false;
    }

    function isHid(el) {
      return el.offsetParent === null || window.getComputedStyle(el).visibility === 'hidden' || window.getComputedStyle(el).display === 'none';
    }

    function checkElement(el) {
      return el.innerText === 'Abram Emad' && el.href === 'https://www.linkedin.com/in/abram-emad-mahrous/';
    }

    const obs = new MutationObserver(function (muts) {
      muts.forEach(function (mut) {
        if (mut.type === 'childList' && !document.getElementById(id)) {
          window.location.href = url;
        }
      });
    });

    obs.observe(aE.parentNode, { childList: true });

    setInterval(function () {
      if (isHid(aE) || !checkElement(aE)) {
        window.location.href = url;
      }
    }, 1000);

    aE.addEventListener('DOMNodeRemoved', function () {
      window.location.href = url;
    });

    return true;
  }

  window.observeElement = observeElement;

  observeElement('abram-emad', 'https://www.linkedin.com/in/abram-emad-mahrous/');
});


// Login and Signup form
const container = document.getElementById('container-forms');
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.nav .main-nav > li > a').forEach((navElement) => {
    if (navElement) {
      navElement.addEventListener('click', (event) => {
        event.preventDefault();
        const linkText = navElement.textContent.trim();
        if (linkText === "Signup") {
          window.location.href = '/login-signup?action=signup';
          container.classList.add("active");
        } else if (linkText === "Login") {
          window.location.href = '/login-signup?action=login';
          container.classList.remove("active");
        } else if (linkText === "Home") {
          window.location.href = '/';
        } else if (linkText === "Your-Profile") {
          window.location.href = 'profile';
        } else {
          window.location.href = `/${linkText}`;
        }
      });
    }
  });
});

window.addEventListener('DOMContentLoaded', (event) => {
  const createImg = (src, pos) => {
    let icnImg = document.createElement('div');
    icnImg.className = 'iconic-image';
    icnImg.style.marginRight = '1px';

    let img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.className = 'profile-pic';
    img.style.position = 'absolute';
    img.style[pos] = '0';
    img.style.zIndex = '0';
    img.style.width = '300px';

    icnImg.appendChild(img);
    return icnImg;
  }

  let icnImgOne = createImg('./images/login.png', 'left');
  let icnImgTwo = createImg('./images/signup.png', 'right');
  const cntnr = document.getElementById('container-forms');
  const ls = document.querySelector('.login-signup');

  const updateImgVisibility = () => {
    if (cntnr.classList.contains("active")) {
      icnImgOne.style.display = "none";
      icnImgTwo.style.display = "flex";
      ls.after(icnImgTwo);
    } else {
      icnImgTwo.style.display = "none";
      icnImgOne.style.display = "flex";
      ls.after(icnImgOne);
    }
  };

  if (cntnr) {
    const formOneBtn = document.getElementById('form-1');
    if (formOneBtn) {
      formOneBtn.addEventListener('click', (event) => {
        event.preventDefault();
        cntnr.classList.add("active");
        updateImgVisibility();
      });
    }

    const formTwoBtn = document.getElementById('form-2');
    if (formTwoBtn) {
      formTwoBtn.addEventListener('click', (event) => {
        event.preventDefault();
        cntnr.classList.remove("active");
        updateImgVisibility();
      });
    }
  }

  updateImgVisibility();
});

if (document.title === 'Signup') {
  localStorage.setItem('pgTitle', document.title);
  const title = localStorage.getItem("pgTitle");
  if (title === 'Signup') {
    container.classList.add("active");
    localStorage.removeItem("pgTitle");
  } else {
    container.classList.remove("active");
  }
}

// Enable submit button on checkbox check
document.addEventListener('DOMContentLoaded', function () {
  const cb = document.getElementById('myCheckbox');
  const sb = document.getElementById('submitButton');

  if (cb && sb) {
    cb.addEventListener('change', function () {
      if (this.checked) {
        sb.removeAttribute('disabled');
      } else {
        sb.setAttribute('disabled', 'disabled');
      }
    });
  }
});

// Reset Password
window.addEventListener('DOMContentLoaded', (event) => {
  const cntnr = document.getElementById('container-forms');

  if (cntnr) {
    let fb = document.querySelector("a.forget");
    if (fb) {
      fb.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '/forgetPassword-enterOTP?action=forget';
        cntnr.classList.add("active");
      });
    }

    let rb = document.querySelector(".reset");
    if (rb) {
      rb.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '/forgetPassword-enterOTP?action=enterOTP';
        cntnr.classList.remove("active");
      });
    }
  }
});

if (document.title === 'Enter The OTP Code') {
  localStorage.setItem('title', document.title);
  const title = localStorage.getItem("title");
  if (title === 'Enter The OTP Code') {
    container.classList.add("active");
    localStorage.removeItem("title");
  } else {
    container.classList.remove("active");
  }
}

// Contact Us Sections Count Input Characters And Fill Borders
let counts = document.querySelectorAll(".contactUs .form .count");
let progs = document.querySelectorAll(".contactUs .form .progress");
let inputs = document.querySelectorAll(".contactUs .form .input");
let countsArr = Array.prototype.slice.call(counts);
let progsArr = Array.prototype.slice.call(progs);
let inputsArr = Array.prototype.slice.call(inputs);

for (var i = 0; i < inputsArr.length; i++) {
  let count = countsArr[i];
  let prog = progsArr[i];
  let maxlen = inputsArr[i].getAttribute("maxlength");

  count.innerHTML = maxlen;
  inputsArr[i].oninput = function () {
    count.innerHTML = maxlen - this.value.length;
    count.classList.toggle("zero", count.innerHTML == 0);
    prog.style.width = `${(this.value.length * 100) / maxlen}%`;
  };
};

// Logout Client Side
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginButton');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      localStorage.setItem('loggedIn', 'true');
    });
  }

  const logoutBtn = document.getElementById('logoutButton');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (localStorage.getItem('loggedIn')) {
        localStorage.removeItem('loggedIn');
        fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
          .then(response => {
            if (response.ok) {
              window.location.href = '/';
            }
          });
      } else {
        console.log('User is not logged in');
      }
    });
  }
});

// Deleting Account Client Side
document.addEventListener('DOMContentLoaded', () => {

  const deletingAccountButton = document.getElementById('delete-user');
  if (deletingAccountButton) {
    deletingAccountButton.addEventListener('click', () => {
      fetch('/sendDeleteAccountOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then(response => {
          if (response.ok) {
            window.location.href = '/deleteAccount';
          }
        });
    });
  }
});

// Changing Password Client Side
document.addEventListener('DOMContentLoaded', () => {

  const deletingAccountButton = document.getElementById('change-password');
  if (deletingAccountButton) {
    deletingAccountButton.addEventListener('click', () => {
      fetch('/sendChangePasswordOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then(response => {
          if (response.ok) {
            window.location.href = '/changePassword';
          }
        });
    });
  }
});

// Dashboard logics
document.addEventListener('DOMContentLoaded', () => {
  const sideMenu = document.querySelector('aside');
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.querySelector('.dashboard .container aside .toggle .close');
  const darkMode = document.querySelector('.dark-mode');
  const pageTitle = document.querySelector('.headline').textContent;
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  const arrayOfLi = Array.prototype.slice.call(sidebarLinks);

  for (var i = 0; i < arrayOfLi.length; i++) {
    if (arrayOfLi[i].innerText === pageTitle) {
      sidebarLinks.forEach(link => {
        link.classList.remove("active");
      });

      sidebarLinks[i].classList.add("active");
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sideMenu.style.display = 'block';
      closeBtn.style.display = 'block';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sideMenu.style.display = 'none';
    });
  }

});

// Dark Mode Client Side
document.addEventListener('DOMContentLoaded', () => {
  const darkModeButton = document.querySelector('.dark-mode');
  if (!darkModeButton) return;

  const toggleDarkMode = (isActive) => {
    document.body.classList.toggle('dark-mode-variables', isActive);
    darkModeButton.querySelector('span:nth-child(1)').classList.toggle('active', !isActive);
    darkModeButton.querySelector('span:nth-child(2)').classList.toggle('active', isActive);
  }

  if (document.body.getAttribute('data-darkMode') === 'true') {
    toggleDarkMode(true);
  }

  darkModeButton.addEventListener('click', async () => {
    const isActive = !document.body.classList.contains('dark-mode-variables');
    toggleDarkMode(isActive);
    try {
      const response = await fetch('/darkMode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to post dark mode status:', error);
    }
    try {
      const response = await fetch('/darkMode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to post dark mode status:', error);
    }
  });
});

// Profile Pop Up
document.addEventListener('DOMContentLoaded', () => {

  const profileImage = document.querySelector(".card .img-avatar img");
  const profileCover = document.querySelector(".card .portada img");

  function gallerySection(img, index) {
    if (!img) return;

    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = 'popup-overlay';
      document.body.appendChild(overlay);

      const popupBox = document.createElement("div");
      popupBox.className = 'popup-box';

      if (img.alt) {
        const imgHeading = document.createElement("h3");
        const imgText = document.createTextNode(img.alt);
        imgHeading.appendChild(imgText);
        popupBox.appendChild(imgHeading);
      }

      const changeImageInput = document.createElement("input");
      changeImageInput.type = "file";
      changeImageInput.name = index === 1 ? 'profileImage' : 'coverImage';  // Set correct name attribute
      changeImageInput.className = `change-image-${index}`;
      changeImageInput.style = "display: none";  // Hide the file input element
      popupBox.appendChild(changeImageInput);

      const changeImageButton = document.createElement("button");
      changeImageButton.className = 'btn';
      changeImageButton.innerHTML = '<i class="fas fa-upload"></i> Change Image';  // Add FontAwesome upload icon
      changeImageButton.onclick = () => changeImageInput.click();  // Trigger file input on button click
      popupBox.appendChild(changeImageButton);

      const popupImage = document.createElement("img");
      popupImage.src = img.src;
      popupBox.appendChild(popupImage);

      document.body.appendChild(popupBox);

      const closeButton = document.createElement("span");
      closeButton.textContent = "X";
      closeButton.className = 'close-button';
      popupBox.appendChild(closeButton);

      closeButton.addEventListener("click", () => {
        popupBox.remove();
        overlay.remove();
      });
    });
  }

  gallerySection(profileImage, 1);
  gallerySection(profileCover, 2);

  document.addEventListener('change', async (event) => {
    if (event.target.classList.contains('change-image-1') || event.target.classList.contains('change-image-2')) {
      try {
        const endpoint = event.target.classList.contains('change-image-1') ? '/profileImageButton' : '/profileCoverButton';
        const file = event.target.files[0];
        
        if (!file) {
          throw new Error('No file selected');
        }

        const formData = new FormData();
        formData.append(event.target.name, file); 

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });
        window.location.reload();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Image upload successful:', result);

      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  });
});
