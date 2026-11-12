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

requireSignedInUser().catch((error) => {
  document.body.textContent = `Unable to connect to the sign-in service: ${error.message}`;
});
