import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRounds = 10): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
};


export const compareValue = async (value: string, hashedValue: string): Promise<boolean> => {
    return bcrypt.compare(value, hashedValue);
};