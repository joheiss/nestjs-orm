import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (value instanceof Object && this.isEmpty(value)) {
            throw new HttpException(`Validation failed: No body submitted`, HttpStatus.BAD_REQUEST);
        }
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new HttpException(`Validation failed: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }

    private formatErrors(errors: any[]): string {
        return errors.map(err => Object.keys(err.constraints).map(k => err.constraints[k])).join(', ');
    }

    private isEmpty(value: any): boolean {
        return Object.keys(value).length === 0;
    }
}
