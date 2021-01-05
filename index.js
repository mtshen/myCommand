const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function output(inputText) {
  return new Promise((resolve) => {
    rl.question(inputText, (answer) => {
      resolve(answer);
    });
  })
}

async function load() {
  const intention = await output("提交的");
}

load().then(() => {
  rl.close();
});
