
import * as socket from 'socket.io-client';
//import * as RToken from 'rand-token';
import { TokenGenerator, TokenBase } from 'ts-token-generator';
import {Packets} from './../Network/Packets'
import { Delegates } from './Delegates';
import { ExtendedUser, IMessage, ExtendedMessage, AdminAction, Welcome, ClientModel, ExtendedClient} from '../Models/Models';
import { Information } from '../Information/Information';
import { Extensions } from '../Extensions/Extensions';
import {DeviceType, OnlineState} from '.././Types/index'
import {Actions} from '../Actions/Actions'
import { Messaging, Stages } from '../Communication';
import { Packet } from './Packet';
import {HttpsProxyAgent} from 'https-proxy-agent';
import * as urll from 'url'
import { connect } from 'http2';
import { stringify } from 'querystring';
import { timeStamp } from 'console';

export class Client{
    public Server: string = 'https://v3.palringo.com:3051';
    public Connection: SocketIOClient.Socket;
    public Packet = new Packets();
    public Extensions = new Extensions();
    public On: Delegates;
    public info: Information;
    public actions: Actions;
    public messaging: Messaging;
    public stages: Stages;
    private _id: number;
    private _email: string;
    private _password: string;
    private _devicetype: DeviceType;
    public Debug: boolean;

    constructor(url?: string){
        if(url){
            this.Server = url;
        }
        this.On = new Delegates();
        this.On.LoginSuccess = (data) => this._loginsuccess(data[0], data[1])
    }

    logout(){
        this.writePacket(this.Packet.logout(), true, true);
    }

    login(Username: string, Password: string, device?: DeviceType, state?: OnlineState, type?: any){
        if(!type)
            type = 'email'
        if(!device)
            device = DeviceType.Web;
        if(!state)
            state = OnlineState.Online

        //workaround for enums not being compiled at runtime and const enums removing enum key.
        let deviceTypeArray: string[] = ['unkown', 'bot', 'pc', 'genericmobile', 'mac', 'iphone', 'ipad', 'android', 'web', 'windowsphone7']
        var url = `${this.Server}?token=WE${new TokenGenerator().generate()}&device=${deviceTypeArray[device]}`;
        this.Connection = socket(url,{
            transports: ['websocket'],
            reconnection: false,
            forceNew: true
        });
        
        this.Connection.on('welcome', (data: Welcome) =>{
            this.writePacket(this.Packet.loginPacket(Username, Password, 'email', device), false, false, (data) =>{
                if(data.code != 200)
                {
                    this.On.Trigger('lf', data);
                    return;
                }
                this._id = data.body._id;//
                this._password = Password;
                this._email = Username;
                this._devicetype = device;

                this.On.Trigger('ls', [data.body, state]);
            });
        });
        this.Connection.on('connect', (data) => {
            this.On.Trigger('cn', data)
        });
        this.Connection.on('disconnect', async (data) => {
            this.On.Trigger('dc', data);
            delete this.Connection;
            this.login(this._email, this._password, this._devicetype);
        });
    }

    //Upon login success the bot will subscribe to all incoming pms and groups.
    private _loginsuccess(user: ExtendedClient, state: OnlineState){
        this.info = new Information(this, user);
        this.actions = new Actions(this);
        this.messaging = new Messaging(this);
        this.stages = new Stages(this);
        this.Connection.on('message send', (data: { body: IMessage}) =>{

            if(data.body.originator == this._id)
                return;

            var msg = new ExtendedMessage(data.body);
            var userId = msg.originator;
            this.info.requestUser(userId, (user) => {
                msg.userProfile = user;

                if(!msg.isGroup){
                    this.On.Trigger('pm', msg);
                    return;
                }
                
                var groupID = msg.recipient;

                this.info.requestGroup(groupID, (group) =>{
                    msg.group = group;
                    this.On.Trigger('gm', msg)
                });
            });
        });

        this.writePacket(this.Packet.subscribeToPM(), false);

        this.info.requestGroups((groups) =>{
            if(groups.length <= 0)
                return;
            
            this.writePacket(this.Packet.subscribeToGroups(Extensions.IdArray(groups)), false)
        });
        
        this.Connection.on('group admin', (data: {body: AdminAction}) =>{
            if(data.body.type == 'join' || data.body.type == 'leave'){
                this.On.Trigger('gu', data.body);
                return;
            }

            this.On.Trigger('aa', data.body);
        });

        this.Connection.on('subscriber state update', (data: {body: any}) =>{
            this.On.Trigger('gu', data.body);
        });
        this.updateState(state);
    }

    public updateState(state: OnlineState) {
        this.writePacket(this.Packet.updateUserState(state));
    }

    private PacketBody(packet: Packet): any{
        var any: any = {};

        if(packet.body != null || undefined)
            any.body = packet.body;
        if(packet.headers != null || undefined)
            any.headers = packet.headers;
        return any;
    }

    public writePacket(packet: Packet, adv?: boolean, debug?: boolean, 
                        success?: (data: any) => void, failed?: (data) => void){

        var p = this.PacketBody(packet);

        if(!adv){
            if(!success)
                this.Connection.emit(packet.command, p);
            else
                this.Connection.emit(packet.command, p, success);
            return;
        }

        this.Connection.emit(packet.command, p, (data: { code: number, body: any}) =>{
            if(debug || this.Debug)
                console.log('Packet:' + packet.command, data)
            if(data.code == 200)
                if(success)
                    success(data.body)
            if (data.code != 200){
                if(failed)
                    failed(data)
            }
        })
    }
}