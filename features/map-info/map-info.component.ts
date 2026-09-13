import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.component.html',
  styleUrls: ['./map-info.component.css']
})
export class MapInfoComponent implements OnInit {
  @Input() showDialog: boolean = false;
  @Input() isMobile: boolean = false;
  @Input() canViewRealKd: boolean = true;
  @Input() isAnonymousGame: boolean = false;

  @Output() closeDialog = new EventEmitter<void>();

  // Вкладки: 'players' | 'map' | 'real'
  activeTab: string = 'players';

  // --- Состояния для обычных игроков и карты ---
  playersKd: any[] = [];
  countryOptions: any[] = [];
  selectedCountryId: any = null;
  isLoading: boolean = false;
  hasFetched: boolean = false;
  loadingProgress: string = '';
  totalKills: number = 0;
  totalDeaths: number = 0;
  overallRatio: string = '0.00';
  opponents: any[] = [];

  allianceLoading: boolean = false;
  allianceFetched: boolean = false;

  // --- Сортировки для обычных вкладок ---
  playersSortColumn: string = 'kills';
  playersSortDirection: 'asc' | 'desc' = 'desc';
  mapSortColumn: string = 'kills';
  mapSortDirection: 'asc' | 'desc' = 'desc';

  // --- Состояния для вкладки «Реальный K/D» ---
  realKdLoading: boolean = false;
  realKdHasFetched: boolean = false;
  realKdProgress: string = '';
  realKdSearch: string = '';
  realSortColumn: string = 'kills';
  realSortDirection: 'asc' | 'desc' = 'desc';
  
  realKdDisplayed: any[] = [];
  private allRealKdRows: any[] = [];

  // Мобильные панели
  sortPanelOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.closeDialog.emit();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.sortPanelOpen = false;
  }

  toggleSortPanel(): void {
    this.sortPanelOpen = !this.sortPanelOpen;
  }

  closeMobileOverlays(): void {
    this.sortPanelOpen = false;
  }

  allianceUrl(allianceId: any): string | null {
    return allianceId ? `/alliances/${allianceId}` : null;
  }

  formatRatio(kills: number, deaths: number): string {
    if (!deaths || deaths === 0) return kills > 0 ? kills.toFixed(2) : '0.00';
    return (kills / deaths).toFixed(2);
  }

  sortArrow(tab: string, column: string): string {
    let activeCol = '';
    let dir = 'desc';

    if (tab === 'players') {
      activeCol = this.playersSortColumn;
      dir = this.playersSortDirection;
    } else if (tab === 'map') {
      activeCol = this.mapSortColumn;
      dir = this.mapSortDirection;
    } else if (tab === 'real') {
      activeCol = this.realSortColumn;
      dir = this.realSortDirection;
    }

    if (activeCol !== column) return '';
    return dir === 'asc' ? ' ▲' : ' ▼';
  }

  // --- Заглушки для кнопок загрузки (подключите свои сервисы) ---
  fetchAlliances(): void {
    this.allianceLoading = true;
    setTimeout(() => {
      this.allianceLoading = false;
      this.allianceFetched = true;
    }, 1000);
  }

  fetchAllWars(): void {
    this.isLoading = true;
    this.loadingProgress = 'Загрузка...';
    setTimeout(() => {
      this.isLoading = false;
      this.hasFetched = true;
    }, 1000);
  }

  onCountryChange(countryId: any): void {
    this.selectedCountryId = countryId;
  }

  // ==========================================
  // ЛОГИКА ВКЛАДКИ «РЕАЛЬНЫЙ K/D»
  // ==========================================

  fetchRealKd(): void {
    this.realKdLoading = true;
    this.realKdProgress = 'Подключение к API сервера...';

    // ⚠️ ЗДЕСЬ ВЫЗЫВАЙТЕ ВАШ СЕРВИС ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ ИГРОКОВ
    // Пример имитации ответа от бэкенда:
    setTimeout(() => {
      this.allRealKdRows = [
        {
          siteUserId: 1,
          internalId: 101,
          name: 'Commander_Alex',
          nation: 'Германия',
          alliance: 'Axis',
          allianceId: 10,
          coalition: 'Альянс Центр',
          level: 45,
          kills: 1420,
          deaths: 890,
          power: 'Высокая',
          powerClass: 'high',
          flagUrl: 'assets/flags/ger.png',
          isEnemy: true,
          isAlly: false
        },
        {
          siteUserId: 2,
          internalId: 102,
          name: 'John_Doe',
          nation: 'США',
          alliance: 'Allies',
          allianceId: 20,
          coal coalition: 'Коалиция Заход',
          level: 38,
          kills: 950,
          deaths: 920,
          power: 'Средняя',
          powerClass: 'medium',
          flagUrl: 'assets/flags/usa.png',
          isEnemy: false,
          isAlly: true
        }
      ];

      this.applyRealKdFilter();
      this.realKdLoading = false;
      this.realKdHasFetched = true;
      this.realKdProgress = '';
    }, 1500);
  }

  applyRealKdFilter(): void {
    if (!this.realKdSearch.trim()) {
      this.realKdDisplayed = [...this.allRealKdRows];
    } else {
      const query = this.realKdSearch.toLowerCase().trim();
      this.realKdDisplayed = this.allRealKdRows.filter(row =>
        (row.name && row.name.toLowerCase().includes(query)) ||
        (row.nation && row.nation.toLowerCase().includes(query)) ||
        (row.alliance && row.alliance.toLowerCase().includes(query))
      );
    }
  }

  sortRealBy(column: string): void {
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
        valA = valA ? valA.toLowerCase() : '';
        valB = valB ? valB.toLowerCase() : '';
      } else {
        valA = valA ?? 0;
        valB = valB ?? 0;
      }

      if (valA < valB) return this.realSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.realSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Сортировка обычной вкладки игроков
  sortPlayersBy(column: string): void {
    if (this.playersSortColumn === column) {
      this.playersSortDirection = this.playersSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.playersSortColumn = column;
      this.playersSortDirection = 'desc';
    }
    // Логика сортировки playersKd массива аналогична real
  }

  // Сортировка вкладки карты
  sortMapBy(column: string): void {
    if (this.mapSortColumn === column) {
      this.mapSortDirection = this.mapSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.mapSortColumn = column;
      this.mapSortDirection = 'desc';
    }
    // Логика сортировки opponents массива аналогична real
  }
}
