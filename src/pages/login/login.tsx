const LoginPage = () => {
  return (
    <>
      <h1>Sign in </h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <label htmlFor="remeber-me">Remember me</label>
      <input type="checkbox" id="remeber-me" />
      <button>Login</button>
      <a href="">Forgot password</a>
    </>
  );
};

export default LoginPage;
