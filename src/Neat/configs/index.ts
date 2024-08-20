import { INeatConfig } from "..";
import { default as configDev } from "./config.dev.json";
import { default as config } from "./config.json";
import { default as configProd } from "./config.prod.json";
import { default as configTest } from "./config.test.json";

export const Config: { [key: string]: INeatConfig } = {
    "default": config,
    "dev":     configDev,
    "prod":    configProd,
    "test":    configTest
};
