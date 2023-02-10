import { SerializeError } from 'error';
import { JsonConverter, JsonCustomConvert } from 'json2typescript';
import { JsonConvert } from 'json2typescript/src/json2typescript/json-convert';
import { Logger } from 'services/log';

// tslint:disable-next-line: no-any
export type JSONType = { [id: string]: any };

const _converter = new JsonConvert();

export abstract class JsonSerializable<T> {
  fromJSON(json: JSONType): T {
    try {
      return _converter.deserializeObject(json, this.classRef);
    } catch (error) {
      throw new SerializeError({
        error: error as Error,
        stack: `${this.constructor.name}.fromJSON`,
      });
    }
  }

  toJSON(): JSONType {
    try {
      return _converter.serializeObject(this, this.classRef) as JSONType;
    } catch (error) {
      throw new SerializeError({
        error: error as Error,
        stack: `${this.constructor.name}.toJSON`,
      });
    }
  }

  fromListJSON(listJson: JSONType[], strict?: boolean): T[] {
    try {
      if (strict) {
        return _converter.deserializeArray(listJson, this.classRef);
      }
      const result: T[] = [];
      for (const json of listJson) {
        try {
          const value = this.fromJSON(json);
          result.push(value);
        } catch (error) {
          Logger.instance.logError(error);
          continue;
        }
      }

      return result;
    } catch (error) {
      throw new SerializeError({
        error: error as Error,
        stack: `${this.constructor.name}.fromListJSON`,
      });
    }
  }

  toListJSON(list: T[]): JSONType[] {
    try {
      return _converter.serializeArray(list, this.classRef);
    } catch (error) {
      throw new SerializeError({
        error: error as Error,
        stack: `${this.constructor.name}.toListJSON`,
      });
    }
  }

  protected abstract get classRef(): new () => T;
}

@JsonConverter
export class DateConverter implements JsonCustomConvert<Date> {
  serialize(date: Date): string {
    return date.toUTCString();
  }

  deserialize(date: string): Date {
    return new Date(date);
  }
}

export class EnumConverter<T> implements JsonCustomConvert<T> {
  validValues: string[];
  isOptional = false;

  constructor(private enumType: unknown, private enumName: string, isOptional?: boolean) {
    this.isOptional = isOptional ?? false;
    this.validValues = Object.values(Object.getOwnPropertyDescriptors(enumType)).map(
      value => value.value,
    );
  }

  deserialize(value: string): T {
    if (!this.validValues.includes(value)) {
      if (!this.isOptional) {
        throw new Error(
          `JsonConvert error; invalid value for enum ${this.enumName}, expected one of '${this.validValues}', found '${value}'`,
        );
      }
    }
    return value as unknown as T;
  }

  serialize(data: T): any {
    return data;
  }
}
