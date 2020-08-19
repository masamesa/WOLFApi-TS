export enum LookingFor{
    nothing = 0,

    freindship = 1,

    dating = 2,

    friendshipDating = 3,

    relationship = 4,

    datingRelationship = 6,

    friendshipDatingRelationship = 7,

    networking = 8,

    relationshipNetworking = 12,

    datingRelationshipNetworking = 14,

    friendshipDatingRelationshipNetworking = 15
}

export enum RelationshipStatus{
    notspecified = null,

    single = 1,

    inARelationship = 2,

    engaged = 3,

    married = 4,

    itsComplicated = 5,

    inAnOpenRelationship = 6
}

export enum Gender{
    unspecified = null,
    
    male = 1,
    
    female = 2
}

export enum NewsType{
    WOLF = 0,

    Account = 1,

    Favorite = 2
}

export const enum OnlineState{

    Online = 1,

    Away = 2,

    Busy = 5,

    Invisible = 3

}

export enum Privilege{

    PremiumAccountHolder = 1 << 20,

    Volunteer = 1 << 9,

    Staff = 1 << 12,

    Agent = 1 << 28,

    VIP = 1 << 21,

    Bot = 1 << 26,

    Pest = 1 << 18,

    EliteClubOne = 1 << 6,

    EliteClubTwo = 1 << 17,

    EliteClubThree = 1 << 22,
    
    SelectClubOne = 1 << 4,

    SelectClubTwo = 1 << 10,

    ShadowBanned = 1 << 30

}

export const enum DeviceType
{
    Unknown = 0,

    Bot = 1,

    Pc = 2,

    GenericMobile = 3,

    Mac = 4,

    Android = 7,

    iPhone = 5,

    iPad = 6,

    Web = 8, 

    WindowsPhone7 = 9
}


export const enum Language{
    english = 1,

    dutch = 3,

    spanish = 4,

    french = 6,

    polish = 10,

    chineseSimplified = 11,

    russian = 12,

    italian = 13,

    arabic = 14, 

    persian = 15,

    greek = 16,

    portuguese = 17,

    hindi = 18,

    japanese = 19,

    spanishRestOfLatinAmerica = 20,

    slovak = 21,

    czech = 22, 

    danish = 24,

    finnish = 25,

    hungarian = 27,

    indonesian = 28,

    malaysian = 29,

    dutchNetherlands = 30,

    norwegian = 31,

    swedish = 32,

    thai = 33,

    turkish = 34,

    veitnamese = 35,

    korean = 36,

    portugueseBrazil = 37,

    estonian = 39,

    kazakh = 41,

    latvian = 42,

    lithuanian = 43,

    ukrainian = 44,

    bulgarian = 45
}

export const enum AdminActionTypes{
        Reset = 0,
        Admin = 1,
        Mod = 2,
        Ban = 4,
        Silence = 8,
        Kick = 16,
        Join = 17,
        Leave = 18
    }

export enum Role {
        User = 0,
        Admin = 1,
        Mod = 2,
        Banned = 4,
        Silenced = 8,
        kicked = 16,
        Owner = 32
    }

export enum GroupType{
    id = 0,
    name = 1
}