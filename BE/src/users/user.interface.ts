
export interface IUser{
    _id: string;
    name: string;
    email: string;
    phone: string;
    idCard: string;
    role: {
        _id: string;
        name: string;
    };
    permissions?:{
        _id: string;
        name: string;
        apiPath: string;
        module: string;
    }[]
    avatar?: string;
}