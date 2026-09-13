import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.component.html',
  styleUrls: ['./map-info.component.css']
})
export class MapInfoComponent implements OnInit {
  
  // Флаги и состояния
  canViewRealKd: boolean = true;
  realKdLoading: boolean = false;
  realKdHasFetched: boolean = false;
  realKdProgress: string = '';
  realKdSearch: string = '';
  
  // Данные таблицы
  realKdDisplayed: any[] = [];
  private allRealKdRows: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // Здесь можно инициализировать начальные данные при открытии компонента
  }

  // Метод загрузки реального K/D (вызывается при клике в HTML)
  fetchRealKd() {
    this.realKdLoading = true;
    this.realKdProgress = 'Загрузка данных...';

    // Пример имитации запроса (замените на ваш сервис получения данных)
    setTimeout(() => {
      this.allRealKdRows = [
        // Пример объекта данных: { name: 'Игрок 1', nation: 'Страна', kills: 10, deaths: 5, kd: 2.0 }
      ];
      this.applyRealKdFilter();
      this.realKdLoading = false;
      this.realKdHasFetched = true;
    }, 1000);
  }

  // Фильтрация списка по поисковой строке
  applyRealKdFilter() {
    if (!this.realKdSearch.trim()) {
      this.realKdDisplayed = [...this.allRealKdRows];
    } else {
      const query = this.realKdSearch.toLowerCase();
      this.realKdDisplayed = this.allRealKdRows.filter(row => 
        (row.name && row.name.toLowerCase().includes(query)) ||
        (row.nation && row.nation.toLowerCase().includes(query))
      );
    }
  }

  // Сортировка таблицы
  realSortColumn: string = 'kills';
  realSortDirection: 'asc' | 'desc' = 'desc';

  sortRealBy(column: string) {
    if (this.realSortColumn === column) {
      this.realSortDirection = this.realSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.realSortColumn = column;
      this.realSortDirection = 'desc';
    }

    this.realKdDisplayed.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return this.realSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.realSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
