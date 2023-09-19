import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { ChatDto } from '../model/chat/chat.model';

@Pipe({
  name: 'groupByDate'
})
export class GroupByDatePipe implements PipeTransform {
  transform(collection: Array<ChatDto>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groups = collection.reduce((groups, chat) => {
      const date = moment.utc(chat[property]).local().format('dddd, MMM DD, YYYY');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(chat);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        groupData: groups[date]
      };
    });

    return groupArrays
  }
}
