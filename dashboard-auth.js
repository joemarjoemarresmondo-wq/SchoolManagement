const requireSignedInUser = async () => {
  const { data, error } = await window.supabaseClient.auth.getSession();
  if (error) {
    document.body.textContent = `Unable to verify your sign-in: ${error.message}`;
    return;
  }
  if (!data.session) {
    window.location.replace("index.html");
  }
};

requireSignedInUser().catch((error) => {
  document.body.textContent = `Unable to connect to the sign-in service: ${error.message}`;
});
