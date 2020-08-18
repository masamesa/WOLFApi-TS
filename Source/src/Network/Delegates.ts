//this class is pretty much stolen all from calico-crusade's old palringoapi-ts, I don't see a better way to do it.
//https://github.com/calico-crusade/palringoapi-ts/blob/75fd0626566d4c3db0cbb60d40b5192e815f1fec/library/src/Networking/Delegates.ts
import {Dictionary} from './../Polyfill/Dictionary'
import {ExtendedMessage, AdminAction, ExtendedClient} from '../Models/Models';
import { OnlineState } from '../Types/Types';

export class Delegates {

    private _events: Dictionary<string, Function[]>;

    constructor() {
        this._events = new Dictionary<string, Function[]>();
    }

    public set LoginSuccess(value: (t: [ExtendedClient, OnlineState?]) => void) {
        this.es('ls', value);
    }
    public set LoginFailed(value: (item: { code: number }) => void) {
        this.es('lf', value);
    }
    public set GroupMessage(value: (item: ExtendedMessage) => void) {
        this.es('gm', value);
    }
    public set PrivateMessage(value: (item: ExtendedMessage) => void) {
        this.es('pm', value);
    }
    public set Connected(value: () => void) {
        this.es('cn', value);
    }
    public set Disconnected(value: () => void) {
        this.es('dc', value);
    }
    public set GroupJoined(value: (item: any) => void) {
        this.es('gj', value);
    }
    public set GroupLeft(value: (item: any) => void) {
        this.es('gl', value);
    }
    public set Log(value: (item: any) => void) {
        this.es('log', value);
    }
    public set GroupUpdate(value: (item: any) => void) {
        this.es('gu', value);
    }
    public set AdminAction(value: (item: AdminAction) => void) {
        this.es('aa', value);
    }

    public Trigger(event: string, data: any) {
        this.event(event, data);
    }

    private es(name: string, fn: (item: any, item2?: any) => void) {
        if (!this._events)
            this._events = new Dictionary<string, Function[]>();
        if (!this._events.contains(name))
            this._events.add(name, []);
        this._events.get(name).push(fn);
    }

    private event(name: string, data: any) {
        if (this._events.contains(name)) {
            for (let ev of this._events.get(name)) {
                ev(data);
            }
        }
    }
}