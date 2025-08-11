import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { Expression } from 'src/type/type';

export function IsExpressionObject(validationOptions?: ValidationOptions, type: string = 'number') {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isExpressionObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: { expression: Expression; value: unknown }, args: ValidationArguments) {
          // 检查是否为对象
          if (typeof value !== 'object' || value === null) {
            return false;
          }

          // 检查是否包含必需的字段
          if (!('expression' in value) || !('value' in value)) {
            return false;
          }
          console.log('value', value, args);
          if (value.expression === Expression.BETWEEN) {
            if (!Array.isArray(value.value)) {
              return false;
            }
            if (typeof value.value[0] !== type || typeof value.value[1] !== type) {
              return false;
            }
          }
          // 检查字段类型
          return Object.values(Expression).includes(value.expression) && typeof value.value === type;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 必须为 { expression: string, value: ${type} } 格式的对象`;
        },
      },
    });
  };
}
