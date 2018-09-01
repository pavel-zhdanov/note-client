export default function (to, from, next) {
  if (localStorage.getItem('user-token')) {
    next();
  } else {
    next('/login?loginError=true');
  }
}
