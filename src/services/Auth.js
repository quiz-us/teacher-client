import localforage from 'localforage';

const isAuthenticated = async () => {
  const token = await localforage.getItem('__QUIZUS__');
  if (!token) {
    return false;
  }
  return true;
};

export default {
  isAuthenticated
};
