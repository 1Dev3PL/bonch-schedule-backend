import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const newData = {
          data: {},
        };

        data.data.forEach((pair) => {
          const pairObj = {
            pairNum: pair.pairNum,
            pairStart: pair.pairStart,
            pairEnd: pair.pairEnd,
            pairTitle: pair.pairTitle,
            teacher: pair.teacher,
            auditory: pair.auditory,
            pairType: pair.pairType,
          };

          if (newData.data[pair.date]) {
            newData.data[pair.date].push(pairObj);
          } else {
            newData.data[pair.date] = [pairObj];
          }
        });

        return newData;
      }),
    );
  }
}
