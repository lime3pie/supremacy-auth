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

  activeTab: string = 'players';

  // Остальные списки
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

  // Сортировки
  playersSortColumn: string = 'kills';
  playersSortDirection: 'asc' | 'desc' = 'desc';
  mapSortColumn: string = 'kills';
  mapSortDirection: 'asc' | 'desc' = 'desc';

  // Переменные для «Реального K/D»
  realKdLoading: boolean = false;
  realKdHasFetched: boolean = false;
  realKdProgress: string = '';
  realKdSearch: string = '';
  realSortColumn: string = 'kills';
  realSortDirection: 'asc' | 'desc' = 'desc';
  
  realKdDisplayed: any[] = [];
  private allRealKdRows: any[] = [];

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

    if (tab === 'players') { activeCol = this.playersSortColumn; dir = this.playersSortDirection; }
    else if (tab === 'map') { activeCol = this.mapSortColumn; dir = this.mapSortDirection; }
    else if (tab === 'real') { activeCol = this.realSortColumn; dir = this.realSortDirection; }

    if (activeCol !== column) return '';
    return dir === 'asc' ? ' ▲' : ' ▼';
  }

  fetchAlliances(): void {}
  fetchAllWars(): void {}
  onCountryChange(countryId: any): void { this.selectedCountryId = countryId; }
  sortPlayersBy(column: string): void {}
  sortMapBy(column: string): void {}

  // ==========================================
  // ЭТО ЛОГИКА ДЛЯ «РЕАЛЬНОГО КД»
  // ==========================================

  fetchRealKd(): void {
    this.realKdLoading = true;
    this.realKdProgress = 'Загрузка игроков...';

    // СЮДА ПОЗЖЕ НУЖНО БУДЕТ ПОДКЛЮЧИТЬ ВАШ СЕРВИС С ДАННЫМИ С САЙТА.
    // Пока что здесь тестовые данные, чтобы проверить, работает ли таблица:
    setTimeout(() => {
      this.allRealKdRows = [
        {
          siteUserId: 1,
          name: 'Игрок Тест 1',
          nation: 'Россия',
          alliance: 'Clan A',
          coalition: 'Коалиция 1',
          level: 25,
          kills: 500,
          deaths: 100,
          power: '1000',
          powerClass: 'high',
          flagUrl: '',
          isEnemy: false,
          isAlly: true
        }
      ];

      this.applyRealKdFilter();
      this.realKdLoading = false;
      this.realKdHasFetched = true;
      this.realKdProgress = '';
    }, 1000);
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
      let valA = a[column] ?? '';
      let valB = b[column] ?? '';

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
