interface IPayment {
    _id: string;
    userId: string;
    nameConfig: string;
    clientId: string;
    apiKey: string;
    checksumKey: string;
}
export default IPayment;