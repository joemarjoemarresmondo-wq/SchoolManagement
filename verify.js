const verificationMessage = document.querySelector("#verification-message");
const confirmationType = new URLSearchParams(window.location.search).get(
  "confirmation",
);

const verifyEmail = async () => {
  if (confirmationType !== "signup") {
    verificationMessage.textContent = "This is not a valid email verification link.";
    return;
  }

  const { data, error } = await window.supabaseClient.auth.getSession();
  if (error) {
    throw error;
  }

  if (!data.session) {
    verificationMessage.textContent =
      "Verification failed or this link has expired. Request a new confirmation email.";
    return;
  }

  verificationMessage.textContent = "Successfully Verified";
};

verifyEmail().catch((error) => {
  verificationMessage.textContent = `Unable to verify your email: ${error.message}`;
});
