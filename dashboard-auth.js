const requireSignedInUser = async () => {
  const { data, error } = await window.supabaseClient.auth.getUser();
  if (error) {
    document.body.textContent = `Unable to verify your sign-in: ${error.message}`;
    return;
  }

  if (!data.user) {
    window.location.replace("index.html");
    return;
  }

  if (!data.user.email_confirmed_at && !data.user.confirmed_at) {
    await window.supabaseClient.auth.signOut();
    window.location.replace("index.html?verification=required");
  }
};

const logoutButton = document.querySelector("#logout-button");
const logoutStatus = document.querySelector("#logout-status");

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  logoutStatus.hidden = true;

  try {
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) {
      logoutStatus.textContent = `Unable to log out: ${error.message}`;
      logoutStatus.hidden = false;
      return;
    }

    window.location.replace("index.html");
  } catch (error) {
    logoutStatus.textContent = `Unable to log out: ${error.message}`;
    logoutStatus.hidden = false;
  } finally {
    logoutButton.disabled = false;
  }
});

requireSignedInUser().catch((error) => {
  document.body.textContent = `Unable to connect to the sign-in service: ${error.message}`;
});
