self.onmessage = () => {
  let result = 0;
  for (let i = 0; i < 500000000; i++) result += Math.random();
  self.postMessage(result);
};