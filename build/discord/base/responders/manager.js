import { addRoute, createRouter, findRoute } from "rou3";
import chalk from "chalk";
import { spaceBuilder } from "@magicyan/discord";
export class ResponderManager {
    router = createRouter();
    logs = [];
    withLeadingSlash(path) {
        return path.startsWith("/") ? path : `/${path}`;
    }
    ;
    add(data) {
        const customId = this.withLeadingSlash(data.customId);
        for (const type of new Set(data.types)) {
            addRoute(this.router, type, customId, { ...data, customId });
        }
        ;
        return data;
    }
    addLogs(data) {
        for (const type of new Set(data.types)) {
            this.logs.push(chalk.green(spaceBuilder(chalk.greenBright(`▸ ${type}`), chalk.gray(">"), chalk.underline.blue(data.customId), "✓")));
        }
        ;
    }
    getHandler(type, customId) {
        return findRoute(this.router, type, this.withLeadingSlash(customId));
    }
}
