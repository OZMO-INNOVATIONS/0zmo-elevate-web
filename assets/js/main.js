document.addEventListener("DOMContentLoaded", () => {
  // Guarantee visibility for all animated elements
  const revealElements = () => {
    document.querySelectorAll(".fade-in-up, .reveal-up").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        el.classList.add("visible");
      }
    });
  };

  revealElements();
  window.addEventListener("scroll", revealElements, { passive: true });

  // Safety fallback timer to make sure nothing stays hidden
  setTimeout(() => {
    document.querySelectorAll(".fade-in-up, .reveal-up").forEach((el) => {
      el.classList.add("visible");
    });
  }, 200);

  // FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const parent = question.parentElement;
      const isOpen = parent.classList.contains("active");

      // Close all active items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
        const btn = item.querySelector(".faq-question");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      // Toggle current item
      if (!isOpen) {
        parent.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Custom Select Dropdown logic for application form
  const customSelectTrigger = document.querySelector(".custom-select-trigger");
  const customSelectWrapper = document.querySelector(".custom-select-wrapper");
  const customSelect = document.querySelector(".custom-select");
  const customOptions = document.querySelectorAll(".custom-option");
  const nativeSelect = document.getElementById("course");

  if (customSelectWrapper) {
    const toggleDropdown = (e) => {
      e.stopPropagation();
      customSelectWrapper.classList.toggle("open");
      if (customSelect) customSelect.classList.toggle("open");
    };

    if (customSelectTrigger) {
      customSelectTrigger.addEventListener("click", toggleDropdown);
    } else {
      customSelectWrapper.addEventListener("click", toggleDropdown);
    }

    customOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        const val = option.getAttribute("data-value");
        const text = option.textContent.trim();

        if (nativeSelect) nativeSelect.value = val;

        const textSpan = customSelectWrapper.querySelector(
          ".custom-select-text",
        );
        if (textSpan) {
          textSpan.textContent = text;
          textSpan.style.color = "#ffffff";
        }

        // Highlight active option
        customOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        customSelectWrapper.classList.remove("open");
        if (customSelect) customSelect.classList.remove("open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!customSelectWrapper.contains(e.target)) {
        customSelectWrapper.classList.remove("open");
        if (customSelect) customSelect.classList.remove("open");
      }
    });
  }

  // Application Form WhatsApp Submission
  const applyForm = document.getElementById("applyForm");
  if (applyForm) {
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fname = document.getElementById("fname")?.value.trim() || "";
      const lname = document.getElementById("lname")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const nativeSelect = document.getElementById("course");
      const customSelectText = document.querySelector(".custom-select-text");

      let selectedCourse = "";
      if (nativeSelect && nativeSelect.value && nativeSelect.selectedIndex >= 0) {
        selectedCourse = nativeSelect.options[nativeSelect.selectedIndex].text.trim();
      } else if (
        customSelectText &&
        customSelectText.textContent &&
        customSelectText.textContent.trim() !== "Select Academy Program"
      ) {
        selectedCourse = customSelectText.textContent.trim();
      }

      if (!fname || !lname || !email || !selectedCourse) {
        alert("Please fill out all fields and select an Academy Program.");
        return;
      }

      const phoneNumber = "918590353253";
      const message = `Hello OZMO Elevate!\nI would like to submit an application.\n\n*First Name:* ${fname}\n*Last Name:* ${lname}\n*Email:* ${email}\n*Program:* ${selectedCourse}`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
    });
  }
});

