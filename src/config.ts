import { parse } from "yaml";
import * as fs from "fs";

export interface Config {
  queues: {
    name: string;
    options: {
      name: string;
      redis: {
        host: string;
        port: number;
        db: number;
      };
    };
  }[];
}

export function parseConfig(configPath: string): Config {
  const config = parse(fs.readFileSync(configPath, "utf-8"));

  return config as Config;
}
