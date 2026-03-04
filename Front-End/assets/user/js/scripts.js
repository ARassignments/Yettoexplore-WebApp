

(function ($) {
	"use strict";

	var windowOn = $(window);


	/***************************************************
	================== PreLoader Js=====================
	****************************************************/
	$(window).on('load', function () {
		$(".togo-loader").fadeOut(500, function() {
		});
	});

	/***************************************************
	================== Mobile Menu area =================
	****************************************************/
	if ($('.togo-mobile-menu').length && $('.togo-mobilemenu-content').length) {

		$('.togo-mobilemenu-content').html($('.togo-mobile-menu').prop('outerHTML'));
		let arrow = $('.togo-mobilemenu-content .togo-dropdown > a');

		arrow.each(function () {
			let self = $(this);

			let arrowBtn = $('<button class="dropdown-toggle-btn"><i class="fa-regular fa-angle-right"></i></button>');
			self.append(arrowBtn);

			arrowBtn.on('click', function (e) {
				e.preventDefault();

				let btn = $(this);
				btn.toggleClass("dropdown-opened");
				btn.parent().toggleClass("expanded");

				let li = btn.parent().parent();
				li.toggleClass("dropdown-opened")
				.siblings().removeClass("dropdown-opened");

				li.children(".mobile-slide").slideToggle();
			});
		});
	}

	const menuItems = document.querySelectorAll('.togo-megamenu-nav li');
	const contents = document.querySelectorAll('.togo-megamenu-destination-wrap');

	let activeIndex = 0;
	menuItems.forEach((li, index) => {
		if (li.classList.contains('active')) {
			activeIndex = index;
		}
	});

	$(document).ready(function ($) {
		var currentPage = window.location.pathname.split("/").pop();

		if (currentPage === "") {
			currentPage = "index.html";
		}

		$('.togo-header-menu a[href]').each(function () {
			var linkPage = $(this).attr('href');

			if (linkPage === currentPage) {
				$(this).closest('li').addClass('active');
				$(this).parents('li').addClass('active');
			}
		});
	});

	$(document).ready(function () {
		$('.togo-mobilemenu-content .mobile-slide [class*="col-xl-"]').each(function () {
			this.className = this.className.replace(/col-xl-\d+/g, 'col-12');
		});
	});


	// Show only active content
	contents.forEach((content, i) => {
		if (i === activeIndex) {
			content.classList.remove('d-none');
			setTimeout(() => content.classList.add('show'), 10);
		} else {
			content.classList.add('d-none');
			content.classList.remove('show');
		}
	});

	// ------- Hover events -------
	menuItems.forEach((item, index) => {
		item.addEventListener('mouseover', () => {

			// active class switch
			menuItems.forEach(li => li.classList.remove('active'));
			item.classList.add('active');

			// content switch with animation
			contents.forEach((content, cIndex) => {
				if (cIndex === index) {
					content.classList.remove('d-none');
					setTimeout(() => content.classList.add('show'), 10);

				} else {
					content.classList.add('d-none');
					content.classList.remove('show');
				}
			});
		});
	});


	/***************************************************
	=============== Scroll wrapper ===================
	****************************************************/
	const sm = gsap.matchMedia();
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
	sm.add("(min-width: 768px)", () => {
		if (document.querySelector("#has-smooth") && document.querySelector("#has-smooth-wrap")) {
			ScrollSmoother.create({
				smooth: 1.35,
				effects: true,
				smoothTouch: 0.15,
				wrapper: "#has-smooth",
				ignoreMobileResize: true,
				content: "#has-smooth-wrap",
			});
		}
	});


	/***************************************************
	============== Text slider active ==================
	****************************************************/
	var text_slider = new Swiper(".togo-text-slide-active", {
		loop: true,
		freemode: true,
		slidesPerView: 'auto',
		spaceBetween: 30,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 8000,
		autoplay: {
		delay: 1,
		disableOnInteraction: true,
		},
	});
	var text_slider_2 = new Swiper(".togo-text-slide-2-active", {
		loop: true,
		freemode: true,
		slidesPerView: 'auto',
		spaceBetween: 30,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 30000,
		autoplay: {
		delay: 1,
		disableOnInteraction: true,
		},
	});


	/***************************************************
	================ Destination active =================
	****************************************************/
	let destination = new Swiper('.togo-destination-active', {
		spaceBetween: 24,
		loop: true,
		slidesPerView: 4,
		speed: 500,
		navigation: {
			prevEl: '.togo-destination-prev',
			nextEl: '.togo-destination-next',
		},
		breakpoints: {
			'1400':{
				slidesPerView: 4,
			},
			'1200':{
				slidesPerView: 3,
			},
			'992':{
				slidesPerView: 2.8,
			},
			'768':{
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1.5,
			},
			'0': {
				slidesPerView: 1,
			},
		}
    });
	let destination_2 = new Swiper('.togo-destination-2-active', {
		spaceBetween: 24,
		loop: true,
		slidesPerView: 5,
		speed: 500,
		navigation: {
			prevEl: '.togo-destination-prev',
			nextEl: '.togo-destination-next',
		},
		breakpoints: {
			'1400':{
				slidesPerView: 5,
			},
			'1200':{
				slidesPerView: 3,
			},
			'992':{
				slidesPerView: 2.8,
			},
			'768':{
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		}
    });


	/***************************************************
	============= Testimonial active===================
	****************************************************/
	let testimonial = new Swiper('.togo-testimonial-active', {
		spaceBetween: 24,
		slidesPerView: 1,
		loop: true,
		speed: 500,
		navigation: {
			prevEl: '.togo-testimonial-prev',
			nextEl: '.togo-testimonial-next',
		},
    });


	/***************************************************
	================= Card active ====================
	****************************************************/
	let card = new Swiper('.togo-tour-card-active', {
		spaceBetween: 24,
		slidesPerView: 1,
		loop: true,
		speed: 500,
		pagination: {
			el: '.slider_pagination',
			clickable: true,
		},
    });


	/***************************************************
	================= Marquee animation =================
	****************************************************/
	$(document).ready(function () {
		const $marquee = $('.togo-marquee');
		const $marqueeInner = $('.togo-marquee-inner');

		if ($marquee.length === 0 || $marqueeInner.length === 0) {
			return; 
		}

		let speed = 1;
		let paused = false;
		let x = 0;
		let animationId;

		// Duplicate content
		let totalWidth = $marqueeInner[0].scrollWidth;
		while (totalWidth < $marquee[0].offsetWidth * 2) {
			$marqueeInner.append($marqueeInner.html());
			totalWidth = $marqueeInner[0].scrollWidth;
		}

		function animate() {
			if (!paused) {
				x -= speed;
				if (Math.abs(x) >= totalWidth / 2) x = 0;
				$marqueeInner.css('transform', `translateX(${x}px)`);
			}
			animationId = requestAnimationFrame(animate);
		}

		animate();

		$marqueeInner.on('mouseenter', () => paused = true);
		$marqueeInner.on('mouseleave', () => paused = false);
	});


	/***************************************************
	================ Currence active ==================
	****************************************************/
	$(document).ready(function () {
		$(".currence-work li a").on("click", function (e) {
			e.preventDefault();

			const $this = $(this);

			// Remove previous active + icon
			$(".currence-work li").removeClass("active");
			$(".currence-work li a .active-icon").remove();

			// Add active class to current li
			$this.parent().addClass("active");

			// Add icon after text
			$this.append('<i class="active-icon">✔</i>');
		});
	});


	/***************************************************
	============== Hero 2 slider active =================
	****************************************************/
	var hero_2_slider = new Swiper('.togo-hero-2-active', {
		slidesPerView: 1,
		effect: 'fade',
		loop: true,
		autoplay: {
			delay: 10000,
		},
		// Navigation arrows
		pagination: {
			el: '.hero-pagination-progress',
			type: 'progressbar',
		},
		on: {
			init: function () {
				let swiper = this;
				let fraction = document.querySelector('.swiper-pagination-fraction');
				
				if (fraction) {
					let totalSlides = 3;
					
					fraction.innerHTML = `<span class="current">${swiper.realIndex + 1}</span><span class="total">${totalSlides}</span>`;
				}
			},
			slideChange: function () {
				let swiper = this;
				let fraction = document.querySelector('.swiper-pagination-fraction');
				
				if (fraction) {
					let current = fraction.querySelector('.current');
					if (current) {
						current.textContent = swiper.realIndex + 1;
					}
				}
			}
		}
	});


	/***************************************************
	============== Testimonial 2 slider active =========
	****************************************************/
	var slider_testimonial = new Swiper('.togo-testimonial-2-active', {
		loop: true,
		spaceBetween: 24,
		slidesPerView: 4,
		autoplay: {
			delay: 5000,
		},
		// Navigation arrows
		pagination: {
			el: '.testi-pagination-progress',
			type: 'progressbar',
		},
		navigation: {
			prevEl: '.togo-testimonial-prev',
			nextEl: '.togo-testimonial-next',
		},
		on: {
			init: function () {
				let swiper = this;
				let fraction = document.querySelector('.swiper-pagination-fraction');
				if (fraction) {
					let totalSlides = swiper.slides.length - swiper.loopedSlides * 2; 
					fraction.innerHTML = `<span class="current">${swiper.realIndex + 1}</span><span class="total">${totalSlides}</span>`;
				}
			},
			slideChange: function () {
				let swiper = this;
				let fraction = document.querySelector('.swiper-pagination-fraction');
				if (fraction) {
					let current = fraction.querySelector('.current');
					if (current) {
						current.textContent = swiper.realIndex + 1;
					}
				}
			}
		},
		breakpoints: {
			1400:{ slidesPerView: 4 },
			1200:{ slidesPerView: 3 },
			992:{ slidesPerView: 2.8 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1 },
			0:{ slidesPerView: 1 },
		}
	});
	var slider_testimonial_2 = new Swiper('.togo-testimonial-12-active', {
		loop: true,
		spaceBetween: 24,
		slidesPerView: 2,
		autoplay: {
			delay: 5000,
		},
		// Navigation arrows
		pagination: {
			el: '.testi-pagination-progress',
			type: 'progressbar',
		},
		navigation: {
			prevEl: '.togo-testimonial-prev',
			nextEl: '.togo-testimonial-next',
		},
		on: {
			init: function () {
				let swiper = this;
				let fraction = document.querySelector('.swiper-pagination-fraction');
				if (fraction) {
					let totalSlides = swiper.slides.length - swiper.loopedSlides * 2; 
					fraction.innerHTML = `<span class="current">${swiper.realIndex + 1}</span><span class="total">${totalSlides}</span>`;
				}
			},
			slideChange: function () {
				let swiper = this;
				let fraction = document.querySelector('.swiper-pagination-fraction');
				if (fraction) {
					let current = fraction.querySelector('.current');
					if (current) {
						current.textContent = swiper.realIndex + 1;
					}
				}
			}
		},
		breakpoints: {
			1600:{ slidesPerView: 2.7 },
			1400:{ slidesPerView: 2.5 },
			1200:{ slidesPerView: 2 },
			992:{ slidesPerView: 1.7 },
			768:{ slidesPerView: 1.3 },
			576:{ slidesPerView: 1 },
			0:{ slidesPerView: 0.5 },
		}
	});


	/***************************************************
	============== Tour 2 slider active =================
	****************************************************/
	let tour_2 = new Swiper('.togo-tour-2-active', {
		slidesPerView: 5,
		loop: true,
		speed: 500,
		spaceBetween: 24,
		autoHeight: false,

		navigation: {
			prevEl: '.togo-tour-prev',
			nextEl: '.togo-tour-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 5 },
			1200:{ slidesPerView: 4 },
			992:{ slidesPerView: 3 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1 },
			0:{ slidesPerView: 1 },
		}
	});


	/***************************************************
	============== Tour pin active =================
	****************************************************/
	if ($('.togo-tour-pin-main').length > 0) {
		ScrollTrigger.create({
			trigger: ".togo-tour-pin-main",
			start: "top 0px",
			end: "bottom bottom",
			pinSpacing: false,
			pin: ".togo-tour-map-wrapper",
		});
	}


	/***************************************************
	=============== Date picker active ==================
	****************************************************/
	$(document).ready(function () {
		// Check if the container exists
		var container = $("#input-id");
		
		if (container.length > 0) {
			// Select the actual input inside the container
			var inputElement = container.find("input")[0]; // get DOM element
			
			if (inputElement && !inputElement.dataset.hdp) {
				new HotelDatepicker(inputElement, {
					autoClose: true,
					format: "MMM DD",
					separator: " - ",
					showTopbar: false, // optional
				});

				// Prevent initializing again
				inputElement.dataset.hdp = "true";
			}
		}
	});


	/***************************************************
	================= Explore active ====================
	****************************************************/
	let explor = new Swiper('.togo-explor-active', {
		spaceBetween: 24,
		loop: true,
		slidesPerView: 4,
		speed: 500,
		navigation: {
			prevEl: '.togo-explor-prev',
			nextEl: '.togo-explor-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 4 },
			1200:{ slidesPerView: 4 },
			992:{ slidesPerView: 3 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1.5 },
			0:{ slidesPerView: 1 },
		}
    });


	/***************************************************
	================= Tour active 3 ====================
	****************************************************/
	let tour_3 = new Swiper('.togo-tour-active-3', {
		loop: true,
		speed: 500,
		slidesPerView: 3,
		spaceBetween: 10,
		centeredSlides: true,
		navigation: {
			prevEl: '.togo-tour-prev',
			nextEl: '.togo-tour-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 3 },
			1200:{ slidesPerView: 3 },
			992:{ slidesPerView: 3 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1.5 },
			0:{ slidesPerView: 1 },
		}
    });

	
	/***************************************************
	================ Nice Select Js ===================
	****************************************************/
	$('select').niceSelect();
	
	
	/***************************************************
	=================== Counter Js ======================
	****************************************************/
	new PureCounter();


	/***************************************************
	================= Tour active ====================
	****************************************************/
	let tour = new Swiper('.togo-tour-active', {
		loop: true,
		slidesPerView: 1,
		spaceBetween: 20,
		speed: 500,
		navigation: {
			prevEl: '.togo-tour-prev',
			nextEl: '.togo-tour-next',
		},
    });
	

	/***************************************************
	========== Destination 4 slider active ==============
	****************************************************/
	let destination_4 = new Swiper('.togo-destination-4-active', {
		slidesPerView: 2.5,
		loop: true,
		speed: 500,
		spaceBetween: 24,
		autoHeight: false,

		navigation: {
			prevEl: '.togo-destination-prev',
			nextEl: '.togo-destination-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 2.5 },
			1200:{ slidesPerView: 2 },
			992:{ slidesPerView: 2 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 2 },
			0:{ slidesPerView: 1 },
		}
	});
	

	/***************************************************
	============= Partner slider active ================
	****************************************************/
	let partner = new Swiper('.togo-partner-active', {
		slidesPerView: 3,
		loop: true,
		speed: 500,
		spaceBetween: 10,
		autoHeight: false,

		navigation: {
			prevEl: '.togo-destination-prev',
			nextEl: '.togo-destination-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 3},
			1200:{ slidesPerView: 3 },
			992:{ slidesPerView: 2 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 2 },
			0:{ slidesPerView: 1 },
		}
	});
	

	/***************************************************
	============= Blog 4 slider active =================
	****************************************************/
	let blog_4 = new Swiper('.togo-blog-4-active', {
		slidesPerView: 3,
		loop: true,
		speed: 500,
		spaceBetween: 24,
		navigation: {
			prevEl: '.togo-blog-prev',
			nextEl: '.togo-blog-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 3 },
			1200:{ slidesPerView: 3 },
			992:{ slidesPerView: 2.5 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1 },
			0:{ slidesPerView: 1 },
		}
	});


	/***************************************************
	========== Testimonial 5 slider active ==============
	****************************************************/
	let testi_5 = new Swiper('.togo-testimonial-5-active', {
		slidesPerView: 3,
		loop: true,
		speed: 500,
		spaceBetween: 24,
		navigation: {
			prevEl: '.togo-testimonial-prev',
			nextEl: '.togo-testimonial-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 3 },
			1200:{ slidesPerView: 3 },
			992:{ slidesPerView: 2.5 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1 },
			0:{ slidesPerView: 1 },
		}
	});


	/***************************************************
	========== Destination 8 slider active =============
	****************************************************/
	let des_8 = new Swiper('.togo-destination-8-active', {
		slidesPerView: 3,
		loop: true,
		speed: 500,
		spaceBetween: 24,
		pagination: {
			el: ".togo-des-dot",
			clickable: true,
		},
		breakpoints: {
			1400:{ slidesPerView: 3 },
			1200:{ slidesPerView: 3 },
			992:{ slidesPerView: 2.5 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1 },
			0:{ slidesPerView: 1 },
		}
	});


	/***************************************************
	============== Discounte slider active ==============
	****************************************************/
	let dis = new Swiper('.togo-discount-active', {
		slidesPerView: 3,
		loop: true,
		speed: 500,
		spaceBetween: 24,
		navigation: {
			prevEl: '.togo-discount-prev',
			nextEl: '.togo-discount-next',
		},
		breakpoints: {
			1400:{ slidesPerView: 3 },
			1200:{ slidesPerView: 3 },
			992:{ slidesPerView: 2.5 },
			768:{ slidesPerView: 2 },
			576:{ slidesPerView: 1 },
			0:{ slidesPerView: 1 },
		}
	});
	

	/***************************************************
	============ Destination 6 slider active ============
	****************************************************/
	let destination_6 = new Swiper('.togo-destination-6-active', {
		spaceBetween: 24,
		loop: true,
		slidesPerView: 4.5,
		speed: 500,
		navigation: {
			prevEl: '.togo-destination-prev',
			nextEl: '.togo-destination-next',
		},
		breakpoints: {
			'1400':{
				slidesPerView: 4.5,
			},
			'1200':{
				slidesPerView: 4,
			},
			'992':{
				slidesPerView: 3,
			},
			'768':{
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		}
    });


	/***************************************************
	================ Range slider js ===================
	****************************************************/
	if($('#slider-range').length > 0){
		$("#slider-range").slider({
			range: true,
			min: 0,
			max: 5000,
			values: [0, 2333],
			slide: function(event, ui) {
				$("#min-amount").val("$" + ui.values[0]);
				$("#max-amount").val("$" + ui.values[1]);
			}
		});

		// Default values on load
		$("#min-amount").val("$" + $("#slider-range").slider("values", 0));
		$("#max-amount").val("$" + $("#slider-range").slider("values", 1));
	}


	/***************************************************
	===================== Faq js =======================
	****************************************************/
	$(function () {
		const $items  = $('.togo-tour-widget');
		const $titles = $('.togo-tour-widget-title');

		$titles.addClass('active');
		$items.find('.inner_content')
			.slideDown(0)
			.find('p').addClass('show');

		$titles.on('click', function (e) {
			e.preventDefault();

			const $self    = $(this);
			const $content = $self.next('.inner_content');

			if ($self.hasClass('active')) {
				$self.removeClass('active');
				$content.slideUp(300).find('p').removeClass('show');
				return;
			}

			$self.addClass('active');
			$content.slideDown(300).find('p').addClass('show');
		});

		/////////////////////////////////
		// Show more btn 
		const $content = $('.togo-show-more-content');
		const $moreBtn = $('.togo-show-more');
		const $lessBtn = $('.togo-show-less');

		// Hidden by default
		$content.hide();
		$lessBtn.hide();

		// Show More
		$moreBtn.on('click', function () {
			$content.slideDown(300);
			$moreBtn.hide();
			$lessBtn.show();
		});

		// Show Less
		$lessBtn.on('click', function () {
			$content.slideUp(200);
			$moreBtn.show();
			$lessBtn.hide();
		});

	});


	/***************************************************
	================ Shop item quantity ================
	****************************************************/
	$('.togo-item-minus').on('click', function () {
		const $input = $(this).siblings('input');
		let count = Number($input.val()) - 1;
		$input.val(count < 1 ? 1 : count).change();
	});
	
	$('.togo-item-plus').on('click', function () {
		const $input = $(this).siblings('input');
		$input.val(Number($input.val()) + 1).change();
	});


	/***************************************************
	=============== Dashboard-side-off =================
	****************************************************/
	$(function () {
		const toggleBtns = document.querySelectorAll(".dashboard-nav-close");
		const sidebar = document.querySelector(".togo-dashboard-sidebar");

		toggleBtns.forEach(btn => {
			btn.addEventListener("click", function () {
			sidebar.classList.toggle("sidebar-collapsed");

			toggleBtns.forEach(b => {
				const icon = b.querySelector("svg");
				if (icon) {
				icon.classList.toggle("rotate");
				}
			});
			});
		});
	});


	/***************************************************
	================= Fade animation ===================
	****************************************************/
	if (document.querySelectorAll(".fade-anim").length) {
		gsap.utils.toArray(".fade-anim").forEach((item) => {
			// Read data attributes with defaults
			const fadeOffset   = Number(item.dataset.fadeOffset) || 40;
			const duration     = Number(item.dataset.duration) || 0.75;
			const fadeFrom     = item.dataset.fadeFrom || "bottom";
			const onScroll     = item.dataset.onScroll !== "0";
			const delay        = Number(item.dataset.delay) || 0.15;
			const ease         = item.dataset.ease || "power2.out";
			const animSettings = {
				opacity: 0,
				duration,
				delay,
				ease,
				x: 0,
				y: 0
			};

			switch (fadeFrom) {
			case "left":
				animSettings.x = -fadeOffset;
				break;
			case "right":
				animSettings.x = fadeOffset;
				break;
			case "top":
				animSettings.y = -fadeOffset;
				break;
			case "bottom":
			default:
				animSettings.y = fadeOffset;
			}

			if (onScroll && typeof ScrollTrigger !== "undefined") {
			animSettings.scrollTrigger = {
				trigger: item,
				start: "top 85%",
				once: true
			};
			}

			gsap.from(item, animSettings);
		});
	}


	/***************************************************
	================ Data attribute js==================
	****************************************************/
	$("[data-background]").each(function () {
		const bg = $(this).attr("data-background");
		if (bg) {
			$(this).css("background-image", `url(${bg})`);
		}
	});

	$("[data-width]").each(function () {
		const width = $(this).attr("data-width");
		if (width) {
			$(this).css("width", width);
		}
	});

	$("[data-height]").each(function () {
		const height = $(this).attr("data-height");
		if (height) {
			$(this).css("height", height);
		}
	});

	$("[data-bg-color]").each(function () {
		const bgColor = $(this).attr("data-bg-color");
		if (bgColor) {
			$(this).css("background-color", bgColor);
		}
	});
	

	/***************************************************
	=========== MagnificPopup img/video ================
	****************************************************/
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});
	$(".popup-video").magnificPopup({
		type: "iframe",
	});
	

	/***************************************************
	================== Back to top ===================
	****************************************************/
	function back_to_top() {
		var btn = $('#back-btn-top');
		var btn_wrapper = $('.togo-back-wrapper');
			windowOn.scroll(function () {
				if (windowOn.scrollTop() > 300) {
					btn_wrapper.addClass('togo-back-btn-show');
				} else {
					btn_wrapper.removeClass('togo-back-btn-show');
				}
			});

			btn.on('click', function (e) {
				e.preventDefault();
				$('html, body').animate({ scrollTop: 0 }, '300');
			});
	}
	back_to_top();


	/***************************************************
	================ Overlay area ====================
	****************************************************/
	$(function() {
		const $overlay = $(".body-overlay");

		// Open triggers
		$(".offcanvas-open-btn").on("click", () => $(".offcanvas-area, .body-overlay").addClass("opened"));
		$(".filter-open-btn").on("click", () => $(".filter-area, .body-overlay").addClass("opened"));
		$(".cart-open-btn").on("click", () => $(".cart-area, .body-overlay").addClass("opened"));

		// Close triggers
		$(".offcanvas-close-btn, .body-overlay").on("click", () => {
			$(".offcanvas-area, .cart-area, .filter-area").removeClass("opened");
			$overlay.removeClass("opened");
		});
	});


	/***************************************************
	==================== Chart js ======================
	****************************************************/
	if($('#chart').length > 0){

        var options = {
          series: [{
            name: "Dollar",
			color: '#FD4621',
            data: [800, 456, 35, 300, 400, 280, 290, 700]
		}],
		chart: {
			height: '100%',
			type: 'line',
			zoom: {
				enabled: false
			},
			toolbar: {
				show: false
			}
		},
		dataLabels: {
			enabled: false
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		}
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
	}


	/***************************************************
	============== Trip search input style =============
	****************************************************/
	$(function () {
		const $input = $(".trip-search-form input");
		const $dropdown = $(".trip-search-form .field-location__result");

		// Open dropdown on input focus or click
		$input.on("focus click", function (e) {
			e.stopPropagation();
			$dropdown.removeClass("d-none").addClass("active");
		});

		// Clicking inside dropdown should not close it
		$dropdown.on("click", function (e) {
			e.stopPropagation();
		});

		// Clicking a city or country sets input value
		$dropdown.find(".city, .country").on("click", function () {
			const text = $(this).text();
			$input.val(text);
			$dropdown.addClass("d-none").removeClass("active");
		});

		// Clicking outside closes dropdown
		$(document).on("click", function () {
			$dropdown.addClass("d-none").removeClass("active");
		});
	});


	/***************************************************
	============== Input add Image =============
	****************************************************/
	$(document).ready(function() {
		$('#file-input').on('change', function(event) {
			const file = event.target.files[0];

			if (file) {
				const reader = new FileReader();

				reader.onload = function(e) {
					$('.togo-dashboard-setting-info-thumb img').attr('src', e.target.result);
				};

				reader.readAsDataURL(file);
			}
		});
	});


})(jQuery);
