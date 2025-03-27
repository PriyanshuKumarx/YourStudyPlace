function toggleAnswer(questionHeader) {
  const question = questionHeader.parentElement;
  const answer = question.querySelector(".answer");
  const icon = questionHeader.querySelector("i");

  if (answer.style.display === "block") {
    answer.style.display = "none";
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  } else {
    answer.style.display = "block";
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  }
}

function openFAQ(faqNumber) {
  document.querySelectorAll(".faq-section").forEach((section) => {
    section.classList.remove("active");
  });

  const selectedFAQ = document.getElementById(`faq${faqNumber}`);
  selectedFAQ.classList.add("active");

  document.querySelectorAll(".faq-button").forEach((button) => {
    button.classList.remove("active");
  });
  event.target.classList.add("active");
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const yOffset = -100;
  const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });

  if (sectionId === "rules-section") {
    section.classList.add("visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".faq-button").classList.add("active");
  document.getElementById("faq1").classList.add("active");
});
