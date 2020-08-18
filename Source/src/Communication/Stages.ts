import {Client} from '../Network/Client';
import {Packets} from '../Network/Packets';
import { StageInfo } from '../Models';
import { FakeMediaStreamTrack } from 'fake-mediastreamtrack';
import { promises, resolve } from 'dns';
//import adapter from 'webrtc-adapter';
//import { RTCPeerConnection, RTCSessionDescription } from 'wrtc'

export class Stages{
    public packet = new Packets();
    
    constructor(private client: Client){
    }

    async requestAudioSlots(groupID: number, subscribe?: boolean, callback?: (callback: StageInfo[]) => void){
        this.client.writePacket(this.packet.requestAudioSlots(groupID, subscribe), false, false, (resp: StageInfo[]) => {
            if(callback)
                callback(resp)
        });
    }

    async slotUpdate(groupID: number, slot: StageInfo, callback?: (callback) => void){
        this.client.writePacket(this.packet.slotUpdate(groupID, slot), true, true, (resp) => {
            if(callback)
                callback(resp)
        });
    }
    //experimental, not implimented
    /*async broadcastTrack(groupID: number, slotID: number, sdp){
        var r = new RTCPeerConnection();
        const track = new FakeMediaStreamTrack({
            kind: 'audio'
        });
        r.addTrack(track);
        Promise.resolve(r.createOffer({
            offerToReceiveAudio: !1,
            offerToReceiveVideo: !1
        })).then(async function(e){
            var t = e.sdp.replace('a=sendrecv', 'a=sendonly');
            return r.setLocalDescription(e),
            Promise.resolve(await this.client.writePacket(this.pack.broadcast(groupID, slotID, t))).then(function(e){
                var t = e.sdp,
                    o = e.slot;
                    return r.uuid = o.uuid,
                
            });
        })
  
    }  */
    /*
    _catch(e, t) {
        try {
            var o = e()
        } catch (e) {
            return t(e)
        }
        return o && o.then ? o.then(void 0, t) : o
    }

    private async _consume(groupID: number, slotID: number, sdp: string): Promise<RTCSessionDescriptionInit>{
        return new Promise((resolve, reject) =>{
            this.client.writePacket(this.packet.consume(groupID, slotID, sdp), true, true, resp => {
                resolve(resp);
            })
        });
        return;
    }*/
/*
    async consume(groupID: number, slotID?: number, sdp?: string){            
        var e = this._catch(function() {
            

            var r = new RTCPeerConnection();
            var t = this;
            console.log("1")
            return r.ontrack("addstream", e=> {console.log(e)}, {once: !0})
            console.log("2")
            Promise.resolve(r.createOffer({
                offerToReceiveVideo: !1,
                offerToReceiveAudio: !0
            })).then(async e =>{
                return r.setLocalDescription(e),
                Promise.resolve(await t._consume(groupID, 1, e.sdp)).then(e => {
                    var t = e.sdp;
                    return Promise.resolve (r.setRemoteDescription(new RTCSessionDescription({
                        type: "answer",
                        sdp: t
                    })));
                })
            })
        },
        function(e) {
            console.error("error:", e);
        });         
        return Promise.resolve(e && e.then ? e.then(function() {}) : void 0)
    }*/
}