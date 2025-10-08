import { env } from "#env";
import ck from "chalk";
const isBun = typeof Bun !== "undefined";
env.BASE_VERSION = "1.4.8"; // DO NOT CHANGE THIS VAR
const RUNTIME_VERSION = isBun ? Bun.version : process.versions.node;
const engineName = isBun
    ? `${ck.hex("#F9F1E1")("◌ Bun")}`
    : `${ck.hex("#54A044")("⬢ Node.js")}`;
export const runtimeDisplay = `${engineName} ${ck.reset.dim(RUNTIME_VERSION)}`;
