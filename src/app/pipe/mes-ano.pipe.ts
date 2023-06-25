import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'mesAno'
  })

export class MesAnoPipe implements PipeTransform {
    transform(value: string, ...args: any[]): any {
      if (value.length === 6) {
        return value.replace(/(\d{2})(\d{4})/g, '\$1/\$2');
      }
      return 'error';
    }
  }