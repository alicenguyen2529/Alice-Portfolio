// /*-------preloader page----------*/

//hide all sections except active
// (() => {
//     const sections = document.querySelectorAll(".section");
//     sections.forEach((section) => {
//         if (!section.classList.contains("active")) {
//             section.classList.add("hide");
//         }
//     })
// })();

window.addEventListener("load", () => {
    //preloader
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() => {
        document.querySelector(".preloader").style.display = "none";
    }, 600)
});

/*-------navigation----------*/
(() => {
    const hamburgerBtn = document.querySelector(".hamburger-btn"),
        navMenu = document.querySelector(".nav-menu"),
        closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu() {
        navMenu.classList.add("open");
    }

    function hideNavMenu() {
        navMenu.classList.remove("open");

    }

    function fadeOutEffect() {
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(() => {
            document.querySelector(".fade-out-effect").classList.remove("active");
        }, 300)
    }
    // attach an event handler to document
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains('link-item')) {
            /* make sure event target.hash has a value before overridding default behavior */
            if (event.target.hash !== "") {
                // prevent defaults anchor click behavior
                event.preventDefault();
                const hash = event.target.hash;

                /* deactivate existing active navigation menu 'link-item' */
                navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active", "inner-shadow");
                /* if clicked 'link-item is contained within the navigation menu */
                if (navMenu.classList.contains("open")) {
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");

                    hideNavMenu();
                } else {
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) => {
                        if (hash === item.hash) {
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("outer-shadow", "hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }
                //add hash (#) to url
                window.location.hash = hash;
            }
        }
    })
})();

function bodyScrollingToggle() {
    document.body.classList.toggle("hidden-scrolling");
}

/*-------portfolio filter and popup---------*/
(() => {
    const filterContainer = document.querySelector(".project-filter"),
        projectItemsContainer = document.querySelector(".project-items"),
        projectItems = document.querySelectorAll(".project-item"),
        popup = document.querySelector(".project-popup"),
        prevBtn = popup.querySelector(".pp-prev"),
        nextBtn = popup.querySelector(".pp-next"),
        closeBtn = popup.querySelector(".pp-close"),
        projectDetailsContainer = popup.querySelector(".pp-details"),
        projectDetailsBtn = popup.querySelector(".pp-project-detail-btn");
    let itemIndex, slideIndex, screenshots;

    /*-------filter portfolio items---------*/
    filterContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-item") &&
            !event.target.classList.contains("active")) {
            //deactivate existing active 'filter-item'
            filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            //activate new 'filter item'
            event.target.classList.add("active", "outer-shadow");
            const target = event.target.getAttribute("data-target");
            projectItems.forEach((item) => {
                if (target === item.getAttribute("data-category") || target === 'all') {
                    item.classList.remove("hide");
                    item.classList.add("show");
                } else {
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })

    projectItemsContainer.addEventListener("click", (event) => {
        if (event.target.closest(".project-item-inner")) {
            const projectItem = event.target.closest(".project-item-inner").parentElement;
            //get the projectItem index
            itemIndex = Array.from(projectItem.parentElement.children).indexOf(projectItem);
            screenshots = projectItems[itemIndex].querySelector(".project-item-img img").getAttribute("data-screenshots");
            //convert screenshots into array
            screenshots = screenshots.split(",");
            if (screenshots.length === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none"
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }

            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", () => {
        popupToggle();
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        /*activate loader until the popupImg loaded */
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () => {
            //deactivate loader after the popupImg loaded
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " + screenshots.length;
    }

    //next slide
    nextBtn.addEventListener("click", () => {
        if (slideIndex === screenshots.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        popupSlideshow();

    })

    //prev slide
    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1;
        } else {
            slideIndex--;
        }
        popupSlideshow();
    })

    function popupDetails() {
        // if project-item-detail not exists
        if (!projectItems[itemIndex].querySelector(".project-item-detail")) {
            projectDetailsBtn.style.display = "none";
            return; /*end function execution*/
        }
        projectDetailsBtn.style.display = "block";

        // get the project details
        const details = projectItems[itemIndex].querySelector(".project-item-detail").innerHTML;
        popup.querySelector(".pp-project-details").innerHTML = details;
        const title = projectItems[itemIndex].querySelector(".project-item-title").innerHTML;
        popup.querySelector(".pp-title h2").innerHTML = title;
        const category = projectItems[itemIndex].getAttribute("data-category");
        popup.querySelector(".pp-project-category").innerHTML = category.split("-");

    }

    projectDetailsBtn.addEventListener("click", () => {
        popupDetailsToggle();
    })

    function popupDetailsToggle() {
        if (projectDetailsContainer.classList.contains("active")) {
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        } else {
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    }



})();