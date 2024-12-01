import { IsNotEmpty, ValidateIf, MinLength, IsEmail, IsEnum, isEmpty, isBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import {IntersectionType } from  '@nestjs/mapped-types';

enum PackageType {
    Free = 'Free',
    Premium = 'Premium',
}

enum SignalType {
    Soot = 'Soot',
    Futures = 'Futures',
}

enum RiskType {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low'
}
export class SignalCreateDto {

   @IsNotEmpty() 
    @IsEnum(PackageType, {
        message: 'package_type must be either Free or Premium',
    })
    readonly package_type: PackageType;

    @IsNotEmpty()
    readonly coin_type_id: number;

    @IsNotEmpty() 
    @IsEnum(SignalType, {
        message: 'signal_type must be either Soot or Futures',
    })
    readonly signal_type: SignalType;

    @ValidateIf(o => o.signal_type === 'Futures')
    @IsNotEmpty()
    readonly leverage: number = null

    @IsNotEmpty()
    readonly entry_price: number;

    @IsNotEmpty()
    readonly stop_loss_price: number;

    @IsNotEmpty() 
    @IsEnum(RiskType, {
        message: 'signal_type must be either High or Medium or Low',
    })
    readonly risk_type: RiskType;
}
