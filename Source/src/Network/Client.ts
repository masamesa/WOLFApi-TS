
import * as socket from 'socket.io-client';
import * as RToken from 'rand-token';
import {Packet, iPacket} from './../Network/Packet'
import {Packets} from './../Network/Packets'
import { Delegates } from './Delegates';
import { ExtendedGroup, ExtendedUser, IMessage, ExtendedMessage, AdminAction, Message, GroupMember } from '.././Modules/Modules';
import { Information } from '../Information/Information';
import { throws } from 'assert';
import { Extensions } from '../Extensions/Extensions';
import { emit, on, worker } from 'cluster';
import { WolfClient } from '.././WOLFClient'
import {DeviceType} from '.././Types/Types'
import {Actions} from '../Actions/Actions'
import { Messaging } from '../Communication';

export class Client{
        public Server: string = 'https://v3.palringo.com:3051';
        public Connection: SocketIOClient.Socket;
        public Packet = new Packets();
        public Extensions = new Extensions();
        public On: Delegates
        public info: Information;
        public actions: Actions;
        public messaging: Messaging;
        private _id: number;
        public Debug: boolean;

        constructor(url?: string){
            if(url){
                this.Server = url;
            }
            this.On = new Delegates();
            this.On.LoginSuccess = (user) => this._loginsuccess(user)
        }
        


        login(email: string, password: string, device?: DeviceType){
            if(!device)
                device = DeviceType.Web;

            var url = `${this.Server}?device=${DeviceType[device]}&token=WE${RToken.generate(16)}`;
            this.Connection = socket(url,{
                transports: ['websocket'],
                reconnection: true,
                forceNew: true
            });
            
            this.Connection.on('welcome', (data) =>{
                this.writePacket(this.Packet.loginPacket(email, password), false, false, (data) =>{
                    if(data.code != 200)
                    {
                        this.On.Trigger('lf', data);
                        return;
                    }
                    this._id = data.body._id;
                    this.On.Trigger('ls', data.body);
                });
            });

            this.Connection.on('connect', (data) => this.On.Trigger('cn', data));
            this.Connection.on('disconnect', (data) => this.On.Trigger('dc', data));
        }

        //Upon login success the bot will subscribe to all incoming pms and groups.
        private _loginsuccess(user: ExtendedUser){
            this.info = new Information(this, user);
            this.actions = new Actions(this);
            this.messaging = new Messaging(this);
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
        }


    private PacketBody(packet: iPacket): any{
        var any: any = {};

        if(packet.body != null || undefined)
            any.body = packet.body;
        if(packet.headers != null || undefined)
            any.headers = packet.headers;
        return any;
    }

    public writePacket(packet: iPacket, adv?: boolean, debug?: boolean, 
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
            else
                if(failed)
                    failed(data)
        })
    }
}