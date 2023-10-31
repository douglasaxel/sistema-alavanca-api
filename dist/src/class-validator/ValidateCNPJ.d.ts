import { ValidatorConstraintInterface } from 'class-validator';
export declare class ValidateCNPJ implements ValidatorConstraintInterface {
    validate(cnpj: string): boolean;
    defaultMessage(): string;
}
