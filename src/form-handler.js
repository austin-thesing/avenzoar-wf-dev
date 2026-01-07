/**
 * Contact Form Handler
 *
 * Handles form validation and submission tracking for the contact form.
 *
 * Usage in Webflow:
 * 1. Add this script to the contact page
 * 2. The form must have id="wf-form-Contact-Form"
 * 3. The email input must have name="Email" or id containing "email"
 */

(function () {
  "use strict";

  function attachFormHandler() {
    const form = document.getElementById("wf-form-Contact-Form");

    if (!form) {
      return false;
    }

    // Check if handler is already attached
    if (form.dataset.formHandlerAttached === "true") {
      return true;
    }

    // Find the email input field
    function getEmailInput() {
      // Try by name attribute first
      let emailInput = form.querySelector('input[name="Email"]');
      if (emailInput) return emailInput;

      // Try by name="email" (lowercase)
      emailInput = form.querySelector('input[name="email"]');
      if (emailInput) return emailInput;

      // Try by type="email"
      emailInput = form.querySelector('input[type="email"]');
      if (emailInput) return emailInput;

      // Try by id containing "email"
      emailInput = form.querySelector('input[id*="email" i]');
      if (emailInput) return emailInput;

      return null;
    }

    const emailInput = getEmailInput();

    if (!emailInput) {
      console.warn(
        "[Form Handler] Email input not found in form."
      );
      return true; // Return true to prevent infinite retries
    }

    // Attach submit handler
    form.addEventListener(
      "submit",
      function (e) {
        const email = emailInput.value.trim();

        if (!email) {
          return;
        }

        // Track form submission
        if (typeof window.posthog !== "undefined") {
          try {
            window.posthog.identify(email, {
              email: email,
            });

            const formData = new FormData(form);
            const properties = {
              email: email,
              form_id: "wf-form-Contact-Form",
              page_url: window.location.href,
            };

            // Add other form fields as properties (excluding sensitive data)
            formData.forEach((value, key) => {
              // Skip password fields or any sensitive data
              if (
                key.toLowerCase().includes("password") ||
                key.toLowerCase().includes("ssn") ||
                key.toLowerCase().includes("credit")
              ) {
                return;
              }
              properties[key] = value;
            });

            window.posthog.capture("contact_form_submitted", properties);
          } catch (error) {
            // Silently fail
          }
        }
      },
      { capture: false }
    );

    // Mark as attached to prevent duplicate handlers
    form.dataset.formHandlerAttached = "true";
    return true;
  }

  function init() {
    // Try to attach immediately
    if (attachFormHandler()) {
      return;
    }

    // If form not found, wait for it with MutationObserver
    const observer = new MutationObserver(function () {
      if (attachFormHandler()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Fallback: retry periodically
    let attempts = 0;
    const maxAttempts = 50;
    const retryInterval = setInterval(function () {
      attempts++;
      if (attachFormHandler() || attempts >= maxAttempts) {
        clearInterval(retryInterval);
        observer.disconnect();
      }
    }, 100);
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 0);
  }
})();
