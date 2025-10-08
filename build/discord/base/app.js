import { brBuilder } from "@magicyan/discord";
import { CommandManager } from "./commands/manager.js";
import { ResponderManager } from "./responders/manager.js";
import { EventManager } from "./events/manager.js";
export class Constatic {
    static instance = null;
    commands;
    events;
    responders;
    config;
    constructor() {
        this.events = new EventManager();
        this.commands = new CommandManager();
        this.responders = new ResponderManager();
        this.config = {
            commands: {},
            events: {},
            responders: {},
        };
    }
    static getInstance() {
        if (!Constatic.instance) {
            Constatic.instance = new Constatic();
        }
        return Constatic.instance;
    }
    printLoadLogs() {
        console.log(brBuilder(...this.commands.logs, ...this.responders.logs, ...this.events.logs));
    }
}
