import { IsNotEmpty, ValidateIf, MinLength, IsEmail, IsEnum, isEmpty, isBoolean, IsOptional, IsArray, ArrayMinSize, ArrayNotEmpty, ArrayMaxSize, IsNumber, IsNumberString} from 'class-validator';
import { Type } from 'class-transformer';
import {IntersectionType } from  '@nestjs/mapped-types';

enum PackageType {
    Free = 'Free',
    Premium = 'Premium',
}

enum PackageTypeForList {
    All = 'All',
    Free = 'Free',
    Premium = 'Premium',
}

enum SignalType {
    Spot = 'Spot',
    Futures = 'Futures',
}

enum SignalTypeForList {
    All = 'All',
    Spot = 'Spot',
    Futures = 'Futures',
}

enum SignalSubType {
    Long = 'Long',
    Short = 'Short',
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
        message: 'signal_type must be either Spot or Futures',
    })
    readonly signal_type: SignalType;

    @ValidateIf(o => o.signal_type === 'Futures')
    @IsNotEmpty() 
    @IsEnum(SignalSubType, {
        message: 'signal_sub_type must be either Long or Short',
    })
    readonly signal_sub_type: SignalSubType;

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

    @IsArray()
    @ArrayNotEmpty() // Ensures the array is not empty
    @ArrayMinSize(1) // Minimum 2 elements in the array
    @ArrayMaxSize(3) // Maximum 5 elements in the array
    @IsNumber({}, { each: true }) // Ensures each item is a number
    signal_targets: number[];
}


export class SignalListDto {

    @IsOptional()
    @IsNumberString()
    readonly hero_id : string

    @IsNotEmpty() 
    @IsEnum(PackageTypeForList, {
        message: 'package_type must be either All or Free or Premium',
    })
    readonly package_type: PackageType;

    @IsNotEmpty() 
    @IsEnum(SignalTypeForList, {
        message: 'signal_type must be either All or Spot or Futures',
    })
    readonly signal_type: SignalType;

    @IsNotEmpty() 
    @IsNumberString()
    readonly status: string
}

export class SignalUnlockDto {
    @IsNotEmpty() 
    @IsNumberString()
    readonly signal_id : string
}