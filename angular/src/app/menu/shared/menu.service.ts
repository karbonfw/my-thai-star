import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DishView, ExtraView, OrderView } from '../../shared/viewModels/interfaces';
import { map, assign } from 'lodash';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Filter, Pagination } from 'app/shared/backendModels/interfaces';
import { FilterFormData } from '../menu-filters/menu-filters.component';
import { SortDirection } from '../menu-filters/filter-sort/filter-sort.component';

const categoryNameToServerId: {[key: string]: number} = Object.freeze({
  mainDishes: 0,
  starters: 1,
  desserts: 2,
  noodle: 3,
  rice: 4,
  curry: 5,
  vegan: 6,
  vegetarian: 7,
  favourites: 8,
});

@Injectable()
export class MenuService {

  private readonly filtersRestPath: string = 'dishmanagement/v1/dish/search';

  constructor(private http: HttpClient) { }

  menuToOrder(menu: DishView): OrderView {
    let order: OrderView;
    order = assign(order, menu);
    order.orderLine = {
      amount: 1,
      comment: '',
    };
    return order;
  }

  composeFilters(filters: FilterFormData): Filter {
    const categories: { id: string }[] = Object.keys(filters.categories)
        .filter((categoryKey: string) => filters.categories[categoryKey])
        .map((categoryKey: string) => ({id: categoryNameToServerId[categoryKey].toString()}));
    return {
        categories,
        searchBy: filters.searchBy,
        sort: [{
          name: filters.sort.name,
          direction: filters.sort.direction,
        }],
        maxPrice: filters.maxPrice,
        minLikes: filters.minLikes,
        isFav: filters.categories.favourites,
      };
  }

  clearSelectedExtras(menuInfo: DishView): void {
    map(menuInfo.extras, (extra: ExtraView) => { extra.selected = false; });
  }

  getDishes(filters: Filter): Observable<{pagination: Pagination, result: DishView[]}> {
    return this.http.post<{pagination: Pagination, result: DishView[]}>(
      `${environment.restServiceRoot}${this.filtersRestPath}`,
      filters,
    );
  }
}
