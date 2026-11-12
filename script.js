const passwordInput = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");
const loginStatus = document.querySelector("#login-status");
const loginView = document.querySelector("#login-view");
const registerView = document.querySelector("#register-view");
const registerForm = document.querySelector("#register-form");
const registerStatus = document.querySelector("#register-status");

const showView = (view) => {
  const isRegisterView = view === "register";
  loginView.hidden = isRegisterView;
  registerView.hidden = !isRegisterView;
  (isRegisterView
    ? document.querySelector("#register-name")
    : document.querySelector("#email")
  ).focus();
};

const setFormLoading = (form, isLoading, label) => {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = isLoading;
  button.textContent = isLoading ? label : button.dataset.defaultLabel;
};

for (const form of [loginForm, registerForm]) {
  const button = form.querySelector('button[type="submit"]');
  button.dataset.defaultLabel = button.textContent;
}

document
  .querySelector("#show-register")
  .addEventListener("click", () => showView("register"));
document
  .querySelector("#switch-to-register")
  .addEventListener("click", () => showView("register"));
document
  .querySelector("#switch-to-login")
  .addEventListener("click", () => showView("login"));

document.querySelectorAll(".show-password").forEach((button) => {
  const input = document.getElementById(button.getAttribute("aria-controls"));
  if (!input) {
    throw new Error(`Password toggle target not found: ${button.getAttribute("aria-controls")}`);
  }

  button.addEventListener("click", () => {
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    button.textContent = isVisible ? "Show" : "Hide";
    button.setAttribute("aria-pressed", String(!isVisible));
  });
});

const redirectIfSignedIn = async () => {
  const { data, error } = await window.supabaseClient.auth.getSession();
  if (error) {
    loginStatus.textContent = `Unable to check your sign-in status: ${error.message}`;
    loginStatus.hidden = false;
    return;
  }
  if (data.session) {
    window.location.replace("dashboard.html");
  }
};

redirectIfSignedIn().catch((error) => {
  loginStatus.textContent = `Unable to connect to the sign-in service: ${error.message}`;
  loginStatus.hidden = false;
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginStatus.hidden = true;
  setFormLoading(loginForm, true, "Signing in…");

  try {
    const { error } = await window.supabaseClient.auth.signInWithPassword({
      email: loginForm.elements.email.value.trim(),
      password: loginForm.elements.password.value,
    });

    if (error) {
      loginStatus.textContent = error.message;
      loginStatus.hidden = false;
      return;
    }

    window.location.assign("dashboard.html");
  } catch (error) {
    loginStatus.textContent = `Unable to connect to the sign-in service: ${error.message}`;
    loginStatus.hidden = false;
  } finally {
    setFormLoading(loginForm, false);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registerStatus.hidden = true;

  const password = registerForm.elements.password.value;
  const confirmPassword = registerForm.elements.confirmPassword.value;
  if (password !== confirmPassword) {
    registerStatus.textContent =
      "The passwords do not match. Please check and try again.";
    registerStatus.hidden = false;
    registerForm.elements.confirmPassword.focus();
    return;
  }

  const signupOptions = {
    data: {
      full_name: registerForm.elements.name.value.trim(),
    },
  };
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    signupOptions.emailRedirectTo = new URL(
      "verify.html?confirmation=signup",
      window.location.href,
    ).href;
  }

  setFormLoading(registerForm, true, "Registering…");
  try {
    const { data, error } = await window.supabaseClient.auth.signUp({
      email: registerForm.elements.email.value.trim(),
      password,
      options: signupOptions,
    });

    if (error) {
      registerStatus.textContent = error.message;
      registerStatus.hidden = false;
      return;
    }

    if (data.session) {
      window.location.assign("dashboard.html");
      return;
    }

    registerStatus.textContent =
      "Successfully Registered. Check Gmail For Verification.";
    registerStatus.hidden = false;
    registerForm.reset();
  } catch (error) {
    registerStatus.textContent = `Unable to connect to the registration service: ${error.message}`;
    registerStatus.hidden = false;
  } finally {
    setFormLoading(registerForm, false);
  }
});
