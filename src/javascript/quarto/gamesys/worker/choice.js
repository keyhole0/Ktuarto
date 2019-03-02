onmessage = function(e) {
    let ai = e.data[0];
    let arg1 = e.data[1];
    let arg2 = e.data[2];
    let result = ai.choice(arg1, arg2);
    postMessage(result);
}
  