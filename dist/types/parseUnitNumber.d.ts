export interface IParseUnitNumberResult {
    civicAddress: string;
    unitDesignator: string;
    unitNumber: string;
}
export declare const DEFAULT_DESIGNATORS: {
    '#': string;
    apartment: string;
    building: string;
    department: string;
    floor: string;
    hanger: string;
    key: string;
    lot: string;
    pier: string;
    room: string;
    slip: string;
    space: string;
    stop: string;
    suite: string;
    trailer: string;
    unit: string;
};
export declare function parseUnitNumber(query: string, unitDesignators?: Record<string, string>): IParseUnitNumberResult;
