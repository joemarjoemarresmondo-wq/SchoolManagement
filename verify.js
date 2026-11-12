const verificationMessage = document.querySelector("#verification-message");
const confirmationType = new URLSearchParams(window.location.search).get(
  "confirmation",
);

const verifyEmail = async () => {
  if (confirmationType !== "signup") {
    verificationMessage.textContent = "This is not a valid email verification link.";
    return;
  }

  const { data, error } = await window.supabaseClient.auth.getUser();
  if (error) {
    throw error;
  }

  if (!data.user) {
    verificationMessage.textContent =
      "Verification failed or this link has expired. Request a new confirmation email.";
    return;
  }

  if (!data.user.email_confirmed_at && !data.user.confirmed_at) {
    verificationMessage.textContent =
      "Your Gmail is not verified yet. Open the latest confirmation link sent to your inbox.";
    return;
  }

  verificationMessage.textContent = "Successfully Verified";
};

verifyEmail().catch((error) => {
  verificationMessage.textContent = `Unable to verify your email: ${error.message}`;
});
