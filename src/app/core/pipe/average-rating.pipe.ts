import {Pipe, PipeTransform} from '@angular/core';
import {Review} from "../review/review.interface";

@Pipe({
  name: 'averageRating',
  standalone: true
})
export class AverageRatingPipe implements PipeTransform {

  transform(reviews: Review[]): unknown {

    const groupByRating = reviews.reduce((prev, curr) => {
      const {rating} = curr;
      prev[rating] = prev[rating] || [];
      prev[rating].push(curr);
      return prev;
    },{} as any);

    let totalAverage:number = 0;

    for(const rating in groupByRating){
      totalAverage += groupByRating[rating].length * Number(rating);
    }
    return (totalAverage / reviews.length).toFixed(2);
  }

}
