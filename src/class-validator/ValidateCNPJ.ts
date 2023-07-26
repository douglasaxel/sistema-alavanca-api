import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { validate } from 'src/lib/cnpj';

@ValidatorConstraint({ name: 'validateCNPJ', async: false })
export class ValidateCNPJ implements ValidatorConstraintInterface {
	validate(cnpj: string) {
		return validate(cnpj);
	}

	defaultMessage() {
		return 'CNPJ inválido';
	}
}
