import {Client} from '../Network/Client';
import {Packets} from '../Network/Packets'
import {AdminActionTypes, Role, GroupType} from '../Types/Types'
import {AdminActionResult, GroupActionResult, ExtendedGroup, GroupMember} from '../Models/Models'

export class Actions{
    public Packet = new Packets();
    public AdminActionResult = new AdminActionResult();
    public GroupActionResult = new GroupActionResult();
    private grp: ExtendedGroup;

    constructor(private client: Client){
    }

    async failReasonAdminAction(client: Client, group: ExtendedGroup, target: Number){
        var cachedTarget: GroupMember;

        this.AdminActionResult = new AdminActionResult();

        await client.info.groupMemberList(group.id, (resp) => {         
            for(var i = 0; i < resp.length; i++){
                if(resp[i].id == target)
                    cachedTarget = resp[i];

                if(cachedTarget != undefined){
                    if(cachedTarget.id == Role.Admin && !group.advancedAdmin)
                        return this.AdminActionResult.fullAdminNotEnabled = true;
                    
                    if(i == resp.length && resp[i].id != target)
                        return this.AdminActionResult.userNoLongerInGroup = true;

                    if(resp[i].id != client.info.ClientProfile.subscriber.id)
                        return this.AdminActionResult.botNolongerInGroup = true;

                    if(resp[i].id == client.info.ClientProfile.subscriber.id){

                        if(resp[i].capabilities == Role.Mod && cachedTarget.capabilities == (Role.Admin | Role.Mod | Role.Owner))
                            return this.AdminActionResult.insufficientPower = true;
                        
                        if(resp[i].capabilities != (Role.Owner | Role.Admin | Role.Mod))
                            return this.AdminActionResult.noPower = true;
                    }
                    
                    if(i == resp.length)
                        return this.AdminActionResult.unknownReason = true;
                }
            }});
    }

    async failReasonGroupAction(client: Client, group: ExtendedGroup){
        
        this.GroupActionResult = new GroupActionResult();
        await client.info.requestGroups().then((grp: ExtendedGroup[]) => {
            for(var i = 0; i < grp.length; i++)
            {
                if(i == grp.length && grp[i].id != group.id)
                    return this.GroupActionResult.groupNotfound = true;
            }
        });
    }

    async getExtendedGroup(group: string | number): Promise<ExtendedGroup>{
        return new Promise(async (resolve, reject) =>{
                if(this.grp != undefined)
                    this.grp = undefined;

                let groupType: GroupType = typeof group === 'string' ? GroupType.name : GroupType.id;

                if(groupType == GroupType.name){
                var tempGroup: ExtendedGroup = await this.client.info.requestGroup(group);

                if(tempGroup == undefined){
                    this.GroupActionResult.groupNotfound = true;
                    return resolve(tempGroup);
                }
                
                return resolve(tempGroup);
                }
            
                else if(groupType == GroupType.id){
                    await this.client.info.requestGroup(group, (resp: ExtendedGroup) => {return resolve(resp)});
            }
        });
    }
    
    async banUser(group: number, userID: number, callback?: (reason: AdminActionResult) => void){
        await this.getExtendedGroup(group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Ban), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.AdminActionResult);
                }
            }
            else{
                this.AdminActionResult.sucess = true;
                if(callback)
                    callback(this.AdminActionResult)
            }    
        });
    }

    async kickUser(group: number, userID: number, callback?: (reason: AdminActionResult) => void){
        await this.getExtendedGroup(group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Kick), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.AdminActionResult);
                }
            }
            else{
                this.AdminActionResult.sucess = true;
                if(callback)
                    callback(this.AdminActionResult)
            }    
        });
    }

    async silenceUser(group: number, userID: number, callback?: (reason: AdminActionResult) => void){
        await this.getExtendedGroup(group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Silence), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.AdminActionResult);
                }
            }
            else{
                this.AdminActionResult.sucess = true;
                if(callback)
                    callback(this.AdminActionResult)
            }    
        });
    }

    async resetUser(group: number, userID: number, callback?: (reason: AdminActionResult) => void){
        await this.getExtendedGroup(group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Reset), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.AdminActionResult);
                }
            }
            else{
                this.AdminActionResult.sucess = true;
                if(callback)
                    callback(this.AdminActionResult)
            }    
        });
    }

    async modUser(group: number, userID: number, callback?: (reason: AdminActionResult) => void){
        await this.getExtendedGroup(group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Mod), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.AdminActionResult);
                }
            }
            else{
                this.AdminActionResult.sucess = true;
                if(callback)
                    callback(this.AdminActionResult)
            }    
        });
    }

    async adminUser(group: number, userID: number, callback?: (reason: AdminActionResult) => void){
        await this.getExtendedGroup(group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Admin), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.AdminActionResult);
                }
            }
            else{
                this.AdminActionResult.sucess = true;
                if(callback)
                    callback(this.AdminActionResult)
            }    
        });
    }

    async joinGroup(groupName: string, password?: string, callback?: (reason: GroupActionResult) => void){
        await this.getExtendedGroup(groupName).then((val: ExtendedGroup) =>{ this.grp = val;});
        await this.client.writePacket(this.Packet.groupJoin(groupName, password), false, false, async (data: {code: number, body: any}) =>{
            
            if(data.code != 200){
                if(callback)
                {
                    switch(data.code){
                        case 4: return this.GroupActionResult.higherlevel = true;
                        case 100: return this.GroupActionResult.groupisfull = true;
                        case 101: return this.GroupActionResult.hitgrouplimit = true;
                        case 105: return this.GroupActionResult.nolongerexists = true;
                        case 107: return this.GroupActionResult.banned = true;
                        case 112: return this.GroupActionResult.restritedtonewusers = true;
                        case 115: return this.GroupActionResult.groupisclosed = true;
                        case 116: return this.GroupActionResult.toomanyacounts = true;
                        case 117: return this.GroupActionResult.groupcanonlybejoinedfromgame = true;
                        case 110: return this.GroupActionResult.alreadyInGroup = true;
                        default: return this.GroupActionResult.unknownerror = true;
                    }
                    callback(this.GroupActionResult);
                }
            }
            else{
                this.GroupActionResult.sucess = true;
                if(callback)
                    callback(this.GroupActionResult)
            }    
        });
    }

    async leaveGroup(groupID: number, callback?: (reason: GroupActionResult) => void){
        await this.client.info.requestGroups((resp) => {
            for(var i = 0; i < resp.length; i++)
                if(resp[i].id == groupID)
                    this.grp = resp[i];
            });
        
        this.client.writePacket(this.Packet.groupLeave(groupID), false, false, async (data: {code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonGroupAction(this.client, this.grp)
                    callback(this.GroupActionResult);
                }
            }
            else{
                this.GroupActionResult.sucess = true;
                if(callback)
                    callback(this.GroupActionResult)
            }    
        });
    }
}