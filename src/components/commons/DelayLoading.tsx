let shouldNotDelay = false;

export const DelayLoading = () => {
  if (shouldNotDelay) {
    return null;
  }
  throw new Promise((resolve) => {
    setTimeout(() => {
      shouldNotDelay = true;
      resolve(1);
    }, 2000);
  });
};