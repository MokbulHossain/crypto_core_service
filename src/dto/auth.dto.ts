
import { IsNotEmpty, MinLength, IsEmail, IsEnum, isEmpty, isBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import {IntersectionType } from  '@nestjs/mapped-types';

export class LoginAuthDto {

    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly device_id: string;

    @IsNotEmpty()
    readonly fcm: string;

    @IsOptional()
    readonly handset_type: string;

    @IsOptional()
    readonly osversion: string;

    @IsOptional()
    readonly phone_model: string;

}

export class RegisterAuthDto extends IntersectionType(LoginAuthDto) {

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly mobile: string;

    @IsNotEmpty()
    readonly countrie_id: string;

}

export class OTPValidateDto {

    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly otp: string;

    @IsNotEmpty()
    readonly device_id: string;

}