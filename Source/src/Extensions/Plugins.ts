import { WolfClient } from './../WOLFClient';
import { Group, User, ExtendedMessage } from '../Models/Models';
import { Dictionary } from './../Polyfill/Dictionary';

export interface iPluginOptions{
    aliases?: string[];
    authCheck?: (user: User, group?: Group) => boolean;
    groupOnly?: boolean;
    pmOnly?: boolean;
    description?: string;
    cmdParser?: (msg: string) => any;
}

export class PluginInstance{
    public command: string;
    public options: iPluginOptions;
    public oncmdex: Function;
    static plugins: Dictionary<string, PluginInstance>;

    constructor(options: iPluginOptions) {
        options.aliases = [];
        options.authCheck = (u, g) => true;
        options.pmOnly = false;
        options.groupOnly = false;
        options.description = 'PluginInstance';
        options.cmdParser = (text) => text;
    }

    static register(command: string, options: iPluginOptions, fn: Function){

        if(!PluginInstance.plugins)
            PluginInstance.plugins = new Dictionary<string, PluginInstance>();
        
        if (!options)
            options = <iPluginOptions>{};

        var item = new PluginInstance(options);
        item.command = command;
        item.options = options;
        item.oncmdex = fn;
        
        PluginInstance.plugins.add(command, item);
        
    }

    static attach(client: WolfClient) {
        client.On.GroupMessage = (msg) => {
            PluginInstance.onMessage(client, msg);
        };
        
        client.On.PrivateMessage = (msg) => {
            PluginInstance.onMessage(client, msg);
        };

        client.On.Trigger('log', 'Plugin Trigger Registered.');
    }

    private static onMessage(client: WolfClient, msg: ExtendedMessage) {
        
        if (!msg.isText) {
            return;
        }

        if (msg.text.indexOf(client.commandCharacter) != 0) {
            return;
        }

        var ps = PluginInstance.plugins;

        var msgText = msg.text.slice(client.commandCharacter.length, msg.text.length).trim().toLowerCase();

        var val = ps.getBy((k, v) => {
            if (msgText.indexOf(k) === 0)
                return true;
            for(let c of v.options.aliases) {
                if (msgText.indexOf(c) === 0)
                    return true;
            }
            return false;
        });

        if (!val) {
            console.log('No plugin matching text');
            return;
        }
        
        msgText = msgText.slice(val.command.length, msgText.length).trim();

        if (!val.options.authCheck(msg.userProfile, msg.group)) {
            return;
        }

        if (val.options.pmOnly && msg.isGroup) {
            return;
        }

        if (val.options.groupOnly && !msg.isGroup) {
            return;
        }

        val.oncmdex.call(this, client, msg);
    }
}