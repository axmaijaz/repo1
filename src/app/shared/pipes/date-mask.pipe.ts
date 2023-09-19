import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

@Pipe({
  name: "dateFormatPipe",
})
export class DateMaskPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value) {
      var formatStr = "MMM DD, YYYY";
      if (args.length) {
        args.forEach((arg) => {
          if (arg == "time") {
            formatStr = "MMM DD, YYYY, h:mm a";
          }
        });
      }
      return moment(value).format(formatStr);
    } else{
      return '';
    }
  }
}
