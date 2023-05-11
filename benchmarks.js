// Copyright 2021 Roy T. Hashimoto. All Rights Reserved.
import * as Comlink from 'comlink';

const benchmarksReady = Promise.all(Array.from(new Array(16), (_, i) => {
  const filename = `./benchmark${i + 1}.sql`;
  return fetch(filename).then(response => response.text());
}));
  
document.getElementById('start').addEventListener('click', async event => {
  event.target.disabled = true;
  document.getElementById('error').textContent = '';

  const worker = new Worker('./worker.js', { type: 'module' });
  const workerProxy = Comlink.wrap(worker);
  try {
    await workerProxy.prepare();

    // @ts-ignore
    const preamble = document.getElementById('preamble').value;
    await workerProxy.query(preamble.split(';').filter(s => s.trim()));

    const output = Array.from(document.getElementsByTagName('tr'));
    const th = document.createElement('th');
    th.textContent = 'OPFS';
    output.shift().appendChild(th);

    const benchmarks = await benchmarksReady;
    for (const benchmark of benchmarks) {
      const statements = benchmark.split(';').filter(s => s.trim());

      const startTime = Date.now();
      await workerProxy.query(statements);
      const elapsed = (Date.now() - startTime) / 1000;

      const td = document.createElement('td');
      td.textContent = elapsed.toString();
      output.shift().appendChild(td);
    }
  } catch (e) {
    document.getElementById('error').textContent = e.stack.includes(e.message) ? e.stack : `${e.stack}\n${e.message}`;
  } finally {
    // @ts-ignore
    event.target.disabled = false;
    worker.terminate();
  }
});
