import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Constatic } from "./app.js";
import { env } from "#env";
export function setupCreators(options = {}) {
    const app = Constatic.getInstance();
    app.config.commands = { ...options.commands };
    if (env.GUILD_ID) {
        (app.config.commands.guilds ??= []).push(env.GUILD_ID);
    }
    app.config.responders = { ...options.responders };
    app.config.events = { ...options.events };
    const defaultPerms = options.commands?.defaultMemberPermissions;
    return {
        createCommand: function (data) {
            if (defaultPerms) {
                data.defaultMemberPermissions ??= defaultPerms;
            }
            const resolved = app.commands.set(data);
            app.commands.addLog(resolved);
            if (resolved.type !== ApplicationCommandType.ChatInput) {
                return resolved;
            }
            const commandName = resolved.name;
            const createSubcommand = (group) => {
                return function (data) {
                    app.commands.addModule(commandName, {
                        ...data, group,
                        type: ApplicationCommandOptionType.Subcommand,
                    });
                };
            };
            return Object.assign(data, { ...resolved,
                group(data) {
                    app.commands.addModule(commandName, { ...data,
                        type: ApplicationCommandOptionType.SubcommandGroup,
                    });
                    return { subcommand: createSubcommand(data.name) };
                },
                subcommand: createSubcommand()
            });
        },
        createEvent: function (data) {
            const resolved = { ...data,
                once: data.event === "ready"
                    ? true : data.once
            };
            app.events.addLogs(resolved);
            return app.events.add(resolved);
        },
        createResponder: function (data) {
            app.responders.addLogs(data);
            return app.responders.add(data);
        },
    };
}
