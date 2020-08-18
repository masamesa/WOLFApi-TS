//a few things are stolen from calico-crusade's palringoapi-ts, I don't see a better way to do this, it's just a packet response model afterall.
//https://github.com/calico-crusade/palringoapi-ts/blob/75fd0626566d4c3db0cbb60d40b5192e815f1fec/library/src/Subprofile/Subprofile.ts
import {Role, LookingFor, Gender, RelationshipStatus, Language, DeviceType, NewsType} from '../Types/Types'
declare var TextDecoder: any;

export class StageInfo{
    id: number;
    locked: boolean;
    occupierId: number;
    occupierMuted: boolean;
    uuid: string;
    connctionState: string;
}

export class AdminActionResult{
    sucess: boolean;
    noPower: boolean;
    insufficientPower: boolean;
    botNolongerInGroup: boolean;
    userNoLongerInGroup: boolean;
    fullAdminNotEnabled: boolean;
    unknownReason: boolean;
}

export class GroupActionResult{
    sucess: boolean;
    higherlevel: boolean;
    groupisfull: boolean;
    hitgrouplimit: boolean;
    nolongerexists: boolean;
    banned: boolean;
    restritedtonewusers: boolean;
    groupisclosed: boolean;
    toomanyacounts: boolean;
    groupcanonlybejoinedfromgame: boolean;
    alreadyInGroup: boolean;
    groupNotfound: boolean;
    unknownerror: boolean;
}

export class MethodResult{
    type: AdminActionResult | GroupActionResult;
    result: boolean;
}

export class GroupMember {
    id: number;
    hash: string;
    capabilities: Role;
    sort: {
        nickname: string;
        onlineState: (0 | 1);
    };
}

export class SelectedList {
    charmId?: number;
    position?: number;
}

export interface Charms {
    id: number;
    name: string;
    description: string;
    productId: number;
    imageUrl: string;
}

export interface ExpiredCharms {
    id: number;
    charmId: number;
    subscriberId: number;
    sourceSubscriberId: number;
    expireTime: Date;
}

export interface CharmStats{
    subscriberId: number;
    totalLifetime: number;
    totalGiftedSent: number;
    totalGiftedReceived: number;
    totalActive: number;
    totalExpired: number;
}


export class Welcome{
    ip?: string;
    country?: string;
    token?: string;
    endpointConfig?:{
        avatarEndpoint?: string;
        mmsUploadEndpoint?: string;
        banner?:{
            notification?:{
                en?: string;
                ar?: string;
            },
            promotion?:{
                en?: string;
                ar?: string;
            }
        }
    }
}
//all flags in user and extended user are set to nullable
//so the end user can use the models as a basis to edit his or her profile.
export class ClientModel{
    cognito?:{
        identity?: string;
        token?: string;
    }
    subscriber?:{
        id?: number;
        hash?: string;
        privileges?: number;
        nickname?: string;
        status?: string;
        reputation?: number;
        icon?: number;
        onlineState?: number;
        deviceType?: DeviceType;
        groupMemberCapabilities?: Role;
        contactListBlockedState?: any;
        //unsure what type either are, couldn't get result to appear. Likely number or boolean
        contactListAuthState?: any;
        charms?: SelectedList[];
        email?: string;
    }
    isNew?: boolean;
}

export class ExtendedClient extends ClientModel {
    extended?:{
        language?: Language;
        urls?: string[];
        lookingFor?: LookingFor | number;
        //datetime in a string e.g '2003-05-08T00:00:00.000Z'
        dateOfBirth?: string;
        gender?: Gender | number;
        about?: string;
        //this is legacy v2 to be opted out of being serached for as a contact according to james
        optOut?: any;
        utcOffset?: number;
        latitude?: number;
        longitude?: number;
        name1?: string;
        //apparently this is looking for
        after?: number;
        dobD?: number;
        dobM?: number;
        dobY?: number;
        relationshipStatus?: RelationshipStatus | number;
        sex?: Gender | number;
        name?: string;
    }
    isStaff?: boolean;
    isVolunteer?: boolean;
    isAgent?: boolean;
    isVIP?: boolean;
    isBot?: boolean;
    isPest?: boolean;
    isEliteClubOne?: boolean;
    isEliteClubTwo?: boolean;
    isEliteClubThree?: boolean;
    isSelectClubOne?: boolean;
    isSelectClubTwo?: boolean;
    isShadowBanned?: boolean;
    hasPremium?: boolean;
    avatar?: string;
}

export class User{
    id?: number;
    hash?: string;
    privileges?: number;
    nickname?: string;
    status?: string;
    reputation?: number;
    icon?: number;
    onlineState?: number;
    deviceType?: DeviceType;
    groupMemberCapabilities?: Role;
    contactListBlockedState?: any;
    //unsure what type either are, couldn't get result to appear. Likely number or boolean
    contactListAuthState?: any;
    charms?: SelectedList[];
    email?: string;
}
export class ExtendedUser extends User {
    extended?:{
        language?: Language;
        urls?: string[];
        lookingFor?: LookingFor | number;
        //datetime in a string e.g '2003-05-08T00:00:00.000Z'
        dateOfBirth?: string;
        gender?: Gender | number;
        about?: string;
        //this is legacy v2 to be opted out of being serached for as a contact according to james
        optOut?: any;
        utcOffset?: number;
        latitude?: number;
        longitude?: number;
        name1?: string;
        //apparently this is looking for
        after?: number;
        dobD?: number;
        dobM?: number;
        dobY?: number;
        relationshipStatus?: RelationshipStatus | number;
        sex?: Gender | number;
        name?: string;
    }
    isStaff?: boolean;
    isVolunteer?: boolean;
    isAgent?: boolean;
    isVIP?: boolean;
    isBot?: boolean;
    isPest?: boolean;
    isEliteClubOne?: boolean;
    isEliteClubTwo?: boolean;
    isEliteClubThree?: boolean;
    isSelectClubOne?: boolean;
    isSelectClubTwo?: boolean;
    isShadowBanned?: boolean;
    hasPremium?: boolean;
    avatar?: string;
}

export class CGroup{
    name?: string;
    description?: string;
    extended?: {
        longDescription?: string;
        language?: Language;
        entryLevel?: number;
        discoverable?: boolean;
        advancedAdmin?: boolean;
    }
    password?: string;
    peekable?: boolean;
}

export class Group {
    id: number;
    name: string;
    hash: string;
    description: string
    reputation: number;;
    premium: boolean;
    members: number;
    offical: boolean;
    owner: IIdHash;
    peekable: boolean;
    icon: number;
}
export class ExtendedGroup extends Group {
    discoverable: boolean;
    advancedAdmin: boolean;
    locked: boolean;
    questionable: boolean;
    entryLevel: number;
    passworded: boolean;
    language: Language
}


export interface Achievements{
    id: number;
    typeId: number;
    parentId: number;
    name: string;
    description: string;
    imagueUrl: string;
    notificationPhraseId: any;
    weight: number;
    isSecret: boolean;
    client: number;
    children: {
        id: number;
        typeId: number;
        parentId: number;
        name: string;
        description: string;
        imagueUrl: string;
        notificationPhraseId: any;
        weight: number;
        isSecret: boolean;
        client: number;
    }[];
}

export interface UserAchievements{
    acheievementId: number;
    updateTime: Date;
}

export interface GroupStatistics{
    id: number;
    name: string;
    owner: {
        subId: number;
        level: number;
        nickname: string
    };
    wordCount: number;
    textCount: number;
    linecount: number;
    swearCount: number;
    questionCount: number;
    imageCount: number;
    actionCount: number;
    voiceCount: number;
    emotioncount: number;
    happyCount: number;
    sadCount: number;
    packCount: number;
    spokenCount: number;
    memberCount: number;
    trendsHour:{
        hour: number;
        lineCount: number;
    }[];
    trendsDay:{
        day: number;
        lineCount: number;
    }[];
    trends:{
        day: number;
        lineCount: number;
    }[];
    top25: Top[];
    top30: Top[];
    topWord: TopPhrases[];
    topText: TopPhrases[];
    topQuestion: TopPhrases[];
    topEmoticon: TopPhrases[];
    topHappy: TopPhrases[];
    topSad: TopPhrases[];
    topSwear: TopPhrases[];
    topImage: TopPhrases[];
    topAction: TopPhrases[];
}

export interface Top{
    groupId: number;
    wordCount: number;
    lineCount: number;
    questionCount: number;
    textCount: number;
    voiceCount: number;
    imageCount: number;
    emotioncount: number;
    happyEmoticonCount: number;
    sadEmoticonCount: number;
    swearCount: number;
    actionCount: number;
    packCount: number;
    subId: number;
    randomQuote: string;
    nickname: string;
    message: string;
}

export interface TopPhrases{
    subId: number;
    value: number;
    percentage: number;
    nickname: string;
}

export interface IMessage {
    id: string;
    recipient: number;
    originator: number;
    isGroup: boolean;
    timestamp: Date;
    mimeType: string;
    data: ArrayBuffer;
    flightId: string;
}

export class Message {
    id: string;
    recipient: number;
    originator: number;
    isGroup: boolean;
    timestamp: Date;
    mimeType: string;
    data: ArrayBuffer;
    flightId: string;

    isImage: boolean;
    isText: boolean;
    isVoice: boolean;
    isHtml: boolean;
    text: string;

    constructor(msg?: IMessage) {
        if (!msg)
            return;

        this.id = msg.id;
        this.isGroup = msg.isGroup;
        this.mimeType = msg.mimeType;
        this.originator = msg.originator;
        this.recipient = msg.recipient;
        this.data = msg.data;

        this.isImage = msg.mimeType == ('text/image_link' || 'image/jpeg');
        this.isText = msg.mimeType == 'text/plain';
        this.isVoice = msg.mimeType == ('audio/x-speex' || 'text/voice_link');
        this.isHtml = msg.mimeType == 'text/html';

        if (msg.mimeType != 'audio/x-speex') {
            this.text = new TextDecoder().decode(this.data);
        }
    }
}

export class ExtendedMessage extends Message {
    userProfile: ExtendedUser;
    group?: Group;
}

export class AdminAction {
    type: string;
    groupId: number;
    targetId: number;
    sourceId: number;
}

export interface IIdHash {
    id: number;
    hash: string;
}

export interface IHistoricalMessageMetadata {
    isSpam?: boolean;
}

export interface IHistoricalMessage{
    id: string;
    isGroup: boolean;
    originator: IIdHash | number;
    recipient: IIdHash | number;
    timestamp: number;
    mimeType: string;
    metadata: { isSpam: boolean };
    data: ArrayBuffer;
}

export interface Notifications{
    id: number;
    type: number;
    title: string;
    message:string;
    link: string;
    startAt: Date;
    endAt: Date;
    global: boolean,
    imageUrl: string;
    layoutType: number; //seems to be a type, unsure what the types are, but typically always 1.
    newsStreamType: NewsType;
    actions: any; // ????
    persistent: boolean;
    favourite: boolean;
}

export interface TopicList{
    type: string;
    title: string;
    layout: string;
    limit: number;
    language: number;
    recipeId: string;
    links: {
        text: string;
        uri: string;
        icon: string;
    }[];
}