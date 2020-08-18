import {Dictionary} from '../Polyfill/Dictionary';
import {Client} from '../Network/Client';
import {Packets} from '../Network/Packets'
import {ExtendedUser, User, GroupMember, ExtendedGroup, Message, IHistoricalMessage, Charms, SelectedList, CharmStats, TopicList, CGroup, UserAchievements, GroupStatistics, Achievements, ExtendedClient} from '../Models/Models';
import { Privilege, Language, Gender, RelationshipStatus, LookingFor, DeviceType, OnlineState } from '../Types/Types'
import { Extensions } from '../Extensions';
import { isNull } from 'util';


//Everything in this class is rather self explanitory, I have documented some things, however you can
//easily understand what each function does just by the name of them.
export class Information{
    public Packet = new Packets();
    constructor(private client: Client, public ClientProfile: ExtendedClient){
        this.requestUser(ClientProfile.subscriber.id, resp => {
            let EC = new ExtendedClient();
            EC = resp;
            EC.cognito = ClientProfile.cognito;
            EC.subscriber = ClientProfile.subscriber;
            EC.isNew = ClientProfile.isNew;
            this.ClientProfile = EC;
        });
    }

//#region groupr related information requests

    async findUserCapabilities(userID: number, groupID: number, callback?: (user: User) => void){
        this.requestGroup(groupID, (users) =>{
            users.members
        })
    }

    async groupMemberList(groupID: number, callback?: (members:(GroupMember[])) => void){
        this.client.writePacket(this.Packet.groupMemberList(groupID), true, false, (data: GroupMember[])=>{
            if(callback)
                callback(data);
            return;
        });
    }

    async requestGroup(search: number | string, callback?: (group:(ExtendedGroup)) => void) : Promise<ExtendedGroup> {        
        this.client.writePacket(this.Packet.groupProfile(search, true), true, false, (resp: (ExtendedGroup)) => {
            if(callback)
                callback(resp);
            return resp;
        });
        return;
    }

    //This is extremely messy and slightly redundant*, however I think it's the best solution to avoid much messier, excessive code.
    //*I say rendundant beacuse in theory both a promise and callback will allow you to get results back, however with async this
    //is not fully true. Only promises(from my research and experience) wait until a value is returned to continue on with the code,
    //where as callbacks you can make them awaited and they still will not wait for a value to be returned before continuing on with
    //the rest of the code in the function.
    async requestGroups(callback?: (groups:(ExtendedGroup[])) => void): Promise<ExtendedGroup[]>{
        this.client.writePacket(this.Packet.GroupList(), true, false, (groups: ExtendedGroup[]) =>{
            if(callback)
                callback(groups);
            return groups;
        });
        return;
    }

    async requestGroupStats(groupID: number, callback?: (callback: GroupStatistics) => void){
        this.client.writePacket(this.Packet.requestGroupStatistics(groupID), true, false, (resp: GroupStatistics) =>{
            if(callback)
                callback(resp);
        });
    }

    async createGroup(group: CGroup){
        this.client.writePacket(this.Packet.createGroup(group), false, false, resp =>{
            if(resp.code != 200)
                this.client.On.Trigger('log', resp);
        });
    }

    async updateGroup(group: CGroup){
        this.client.writePacket(this.Packet.updateGroupProfile(group), false, false, resp =>{
            if(resp.code != 200)
                this.client.On.Trigger('log', resp);
        });
    }

    async getGroupAvatar(groupID: number, iconID: number, size?: number){
        if(!size)
            size = 500;
        return `https://clientavatars.palapi.net/FileServerSpring/group/avatar/${groupID}?size=${size}&iconId=${iconID}`;
    }

    //#endregion

//#region user related information requests

    async requestUser(id: number, callback?: (user: (ExtendedUser)) => void): Promise<ExtendedUser>{
        return new Promise((resolve, reject) =>{

            this.client.writePacket(this.Packet.userProfile(id, true), true, false, (resp: (ExtendedUser)) =>{
                
                //This is all due to https://github.com/strothj, he joined my stream and 
                //showed/wrote all of this field enum map stuff.
                type ExtendedUserFields = keyof Omit<ExtendedUser, keyof User | "extended" | "avatar">;
                const fieldEnumMap: Record<ExtendedUserFields, Privilege>= 
                {   
                    isStaff: Privilege.Staff,
                    isVolunteer: Privilege.Volunteer,   
                    isAgent: Privilege.Agent,
                    isVIP: Privilege.VIP,
                    isBot: Privilege.Bot,
                    isPest: Privilege.Pest,
                    isEliteClubOne: Privilege.EliteClubOne,
                    isEliteClubTwo: Privilege.EliteClubTwo,
                    isEliteClubThree: Privilege.EliteClubThree,
                    isSelectClubOne: Privilege.SelectClubOne,
                    isSelectClubTwo: Privilege.SelectClubTwo,
                    hasPremium: Privilege.PremiumAccountHolder,
                    isShadowBanned: Privilege.ShadowBanned,
                }
                for(const field of (Object.keys(fieldEnumMap) as ExtendedUserFields[])){
                    const privilege = fieldEnumMap[field]; 
                    resp[field] = (privilege == (privilege & resp.privileges));
                }
                resp.avatar = `https://clientavatars.palapi.net/FileServerSpring/subscriber/avatar/${resp.id}?size=500&iconId=${resp.icon}`;

                if(callback)
                    callback(resp);
                return resolve(resp);
            });
        });
        return
    }

    async getUserAvatar(userID: number, iconID: number, size?: number){
        if(!size)
            size = 500;
        return `https://clientavatars.palapi.net/FileServerSpring/subscriber/avatar/${userID}?size=${size}&iconId=${iconID}`;
    }

    async requestUserAchievements(userID: number, callback?: (callback: UserAchievements) => void){
        this.client.writePacket(this.Packet.requestUserAchievements(userID), false, false, (resp: UserAchievements) =>{
            if(callback)
                callback(resp)
        });
    }

    async requestAchievementList(language: Language, callback?: (callback: Achievements) => void){
        this.client.writePacket(this.Packet.requestAchievements(language), false, false, (resp: Achievements) =>{
            if(callback)
                callback(resp)
        });
    }

    async requestCharms(callback?: (charms: Charms[]) => void) {
        this.client.writePacket(this.Packet.requestCharms(), false, false, (resp: Charms[]) =>{
            if(callback)
                callback(resp);
        });
    }

    async requestUserExpiredCharms(userID: number, callback?: (charms: Charms[]) => void, offset?: number, limit?: number){
        this.client.writePacket(this.Packet.requestUserExpiredCharms(userID, isNull(offset) ? null : offset, isNull(limit) ? null : limit), false, false, (resp: Charms[]) =>{
            if(callback)
                callback(resp)
        });
    }

    async requestUserActiveCharms(userID: number, callback?: (charms: Charms[]) => void, offset?: number, limit?: number){
        this.client.writePacket(this.Packet.requestUserActiveCharms(userID, isNull(offset) ? null : offset, isNull(limit) ? null : limit), false, false, (resp: Charms[]) =>{
            if(callback)
                callback(resp)
        });
    }

    async requestUserCharmStatistics(userID: number, callback?: (charms: CharmStats) => void){
        this.client.writePacket(this.Packet.requestUserCharmStats(userID), true, false, (resp: CharmStats) =>{
            if(callback)
                callback(resp)
        });
    }

    //#region contacts

    async userAdd(userID: number, Message: string = ''){
        this.client.writePacket(this.Packet.userAdd(userID, Message), true, true);
    }
    async userDelete(userID: number){
        this.client.writePacket(this.Packet.userDelete(userID), true, true);
    }

    async userBlock(userID: number){
        this.client.writePacket(this.Packet.userBlock(userID));
    }

    //#endregion

    //#region notifications/news stream

    async notifications(lang: Language, deviceType: DeviceType, callback?: (any: Notification) => void){
        this.client.writePacket(this.Packet.notifications(lang, deviceType), false, false, (resp: Notification) =>{
            if(callback)
                callback(resp);
        });
    }

    async clearNotification(){
        this.client.writePacket(this.Packet.clearNotifications());
    }

    //disabled server side like avatars.
    /*
    async notificationSubscribe(lang: Language, deviceType: DeviceType, callback?: (any: Notification) => void){
        this.client.writePacket(this.Packet.notificationSubscribe(lang, deviceType), true, true, (resp: Notification) =>{
            if(callback)
                callback(resp);
        });
    }*/

    //#endregion

    //#region group discover

    async requestTopics(language: Language, callback?: (callback: TopicList) => void,  name?: string){
        this.client.writePacket(this.Packet.requestTopics(language, isNull(name) ? null : name), true, false, (resp: TopicList) => {
            if(callback)
                callback(resp);
        });
    }

    async requestDiscoverGroups(languageCode: Language, maxResults: number, callback?: (any) => void, offset?: number, admin?: boolean, repLevel?: number, recipieId?: number){
        this.client.writePacket(this.Packet.requestDiscoverGroups(languageCode, maxResults, offset, isNull(admin) ? false : admin, repLevel, recipieId), false, false, resp => {
            if(callback)
                callback(resp);
        });
    }


    //#endregion

//#region update profile
    async updateUserProfile(profile: ExtendedUser){
        this.client.writePacket(this.Packet.updateUserProfile(profile));
    }
    
    async updateUsername(Uname: string){
        this.client.writePacket(this.Packet.updateUsername(Uname, this.ClientProfile));
    }

    async updateStatus(status: string){
        this.client.writePacket(this.Packet.updateStatus(status, this.ClientProfile));
    }

    async updateUserBio(description: string){
        this.client.writePacket(this.Packet.updateUserBio(description, this.ClientProfile));
    }

    async updateName(name: string){
        this.client.writePacket(this.Packet.updateName(name, this.ClientProfile));
    }

    async updateLanguage(language: Language){
        this.client.writePacket(this.Packet.updateLanguage(language, this.ClientProfile));
    }

    async updateBirthday(year: number, month: number, day: number){
        this.client.writePacket(this.Packet.updateBirthday(year, month, day, this.ClientProfile));
    }

    async updateGender(gender: Gender){
        this.client.writePacket(this.Packet.updateGender(gender, this.ClientProfile));
    }

    async updateRelationshipStatus(rStatus: RelationshipStatus){
        this.client.writePacket(this.Packet.updateRelationshipStatus(rStatus, this.ClientProfile));
    }

    async updateLookingFor(lookingFor: LookingFor){
        this.client.writePacket(this.Packet.updateLookingFor(lookingFor, this.ClientProfile));
    }

    async updateUrls(urls: string[5][]){
        this.client.writePacket(this.Packet.updateUrls(urls, this.ClientProfile));
    }

    async updateCharm(charmid: number, position: number = 0){
        var charm: SelectedList[] = [{ charmId: charmid, position: position }];
        this.client.writePacket(this.Packet.setSelectedCharm(charm));
    }

    async updateOnlineState(state: OnlineState){
        this.client.writePacket(this.Packet.updateUserState(state), true, true);
    }
    //#endregion

    conversationList(callback?: (history: Message[]) => void){
        this.client.writePacket(this.Packet.ConversationHistory(), true, false, (resp:IHistoricalMessage[]) => {
            if(callback)
                callback(Extensions.fromHistory(resp));
        });
    }

    messageHistory(id: number, from: Date, group: boolean, chronological: boolean, callback?: (hist: Message[]) => void){
        this.client.writePacket(this.Packet.MessageHistory(id, from, group, chronological), true, false, (resp: IHistoricalMessage[]) =>{
            if(callback)
                callback(Extensions.fromHistory(resp));
        });
    }

//#endregion
}