import { Config } from "./config";
import Bull from "bull";

export type Queue = {
  name: string;
  queue: Bull.Queue;
};

export function createQueuesFromConfig(config: Config): Queue[] {
  return config.queues.map(({ name, options }) => {
    return {
      name,
      queue: new Bull(options.name, options),
    };
  });
}
