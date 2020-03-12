import { Client } from './Network/Client';
import { PluginInstance } from './Extensions';
import { Information } from './Information/Information';
import { Actions } from './Actions/Actions';
import { Messaging } from './Communication/Messaging';
import { Delegates } from './Network/Delegates';
import { DeviceType } from './Types/Types';

export class WolfClient{
    public _client: Client;
    public commandCharacter: string;

    //If there's a new v3 link and the api is not updated yet, this will
    //allow the user to overload the current link.
    constructor(url?: string){
        this._client = new Client(url);
    }

    public get Info() {
        return this._client.info;
    }

    public get Action(){
        return this._client.actions;
    }

    public get Messaging(){
        return this._client.messaging;
    }

    public get Stages(){
        return this._client.stages;
    }

    async registerPlugins(cmdChar?: string) {
        this.commandCharacter = cmdChar || '!';
        PluginInstance.attach(this);
    }

    //current disabled until I recode the writepacket logic.
    //debug(){
    //    this._client.Debug = true;
    //}

    async login(Email: string, Password: string, Devicetype?: DeviceType){
        this._client.login(Email, Password, Devicetype);
    }
    public get On(){
        return this._client.On;
    }
}