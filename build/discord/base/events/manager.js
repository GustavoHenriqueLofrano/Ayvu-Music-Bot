import { Collection } from "discord.js";
import { spaceBuilder } from "@magicyan/discord";
import chalk from "chalk";
export class EventManager {
    collection = new Collection();
    logs = [];
    getEvents(key) {
        if (!this.collection.has(key)) {
            this.collection.set(key, new Collection());
        }
        return this.collection.get(key);
    }
    add(data) {
        const events = this.getEvents(data.event);
        events.set(data.name, data);
        return data;
    }
    addLogs(data) {
        this.logs.push(chalk.green(spaceBuilder(chalk.yellow(`☉ ${data.name}`), chalk.gray(">"), chalk.underline.yellowBright(data.event), "event ✓")));
    }
}
