import client from "prom-client";
import * as http from "http";
import { parseConfig } from "./config";
import { createQueuesFromConfig } from "./queue";
import path from "path";

const PORT = Number(process.env["PORT"] || 9464);
const CONFIG_PATH =
  process.env["CONFIG_PATH"] || path.join(process.cwd(), "config.yaml");

const config = parseConfig(CONFIG_PATH);
const queues = createQueuesFromConfig(config);

new client.Gauge({
  name: "bull_job_count",
  help: "metric_help",
  labelNames: ["name", "type"],
  async collect() {
    for (const { name, queue } of queues) {
      const counts = await queue.getJobCounts();

      for (const [type, count] of Object.entries(counts)) {
        this.set({ name, type }, count);
      }
    }
  },
});

const server = http.createServer(async (req, res) => {
  if (req.url === "/_healthz") {
    res.statusCode = 200;
    res.end("ok");
    return;
  } else if (req.url !== "/metrics") {
    res.statusCode = 404;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(await client.register.metrics());
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/metrics`);
});
