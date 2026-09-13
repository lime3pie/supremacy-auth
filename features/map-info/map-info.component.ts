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

  // Вкладки: 'players', 'map', или 'real'
  activeTab: string = 'players';

  // --- Списки и состояния ---
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

  // --- Переменные для «Реального K/D» (real) ---
  realKdLoading: boolean = false;
  realKdHasFetched: boolean = false;
  realKdProgress: string = '';
  realKdSearch: string = '';
  realKdDisplayed: any[] = [];
  
  realKdData: any[] = []; // Исходные данные реального K/D
  realSortColumn: string = 'kills';
  realSortDirection: 'asc' | 'desc' = 'desc';

  // --- Сортировки ---
  playersSortColumn: string = 'kills';
  playersSortDirection: 'asc' | 'desc' = 'desc';
  mapSortColumn: string = 'kills';
  mapSortDirection: 'asc' | 'desc' = 'desc';

  sortPanelOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.closeDialog.emit();
  }

  // Переключение между вкладками
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

  fetchAlliances(): void {
    this.allianceLoading = true;
    setTimeout(() => {
      this.allianceLoading = false;
      this.allianceFetched = true;
    }, 1000);
  }

  // Кнопка загрузки во второй вкладке (Detailed K/D)
  fetchAllWars(): void {
    this.isLoading = true;
    this.loadingProgress = 'Загрузка отчетов о боевых действиях...';

    setTimeout(() => {
      this.opponents = [
        {
          opponentId: 1,
          opponentName: 'Тестовый Оппонент',
          kills: 120,
          deaths: 50
        }
      ];
      this.isLoading = false;
      this.hasFetched = true;
      this.loadingProgress = '';
    }, 1000);
  }

  // --- Метод для кнопки «Найти реальные ники» ---
  fetchRealKd(): void {
    this.realKdLoading = true;
    this.realKdProgress = 'Поиск реальных ников игроков...';

    // ⚠️ Здесь вы подключаете ваш реальный сервис для получения данных
    setTimeout(() => {
      this.realKdData = [
        {
          siteUserId: 1,
          name: 'Пример Игрока',
          nation: 'Германия',
          alliance: 'Альянс 1',
          allianceId: 101,
          coalition: 'Коалиция А',
          level: 45,
          kills: 500,
          deaths: 200,
          power: 'Сильный',
          powerClass: 'high'
        }
      ];
      this.realKdDisplayed = [...this.realKdData];
      this.realKdLoading = false;
      this.realKdHasFetched = true;
      this.realKdProgress = '';
    }, 1000);
  }

  // Фильтрация для реального K/D по строке поиска
  applyRealKdFilter(): void {
    if (!this.realKdSearch.trim()) {
      this.realKdDisplayed = [...this.realKdData];
      return;
    }
    const query = this.realKdSearch.toLowerCase();
    this.realKdDisplayed = this.realKdData.filter(row => 
      (row.name && row.name.toLowerCase().includes(query)) ||
      (row.nation && row.nation.toLowerCase().includes(query)) ||
      (row.alliance && row.alliance.toLowerCase().includes(query))
    );
  }

  onCountryChange(countryId: any): void {
    this.selectedCountryId = countryId;
  }

  sortPlayersBy(column: string): void {
    if (this.playersSortColumn === column) {
      this.playersSortDirection = this.playersSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.playersSortColumn = column;
      this.playersSortDirection = 'desc';
    }
  }

  sortMapBy(column: string): void {
    if (this.mapSortColumn === column) {
      this.mapSortDirection = this.mapSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.mapSortColumn = column;
      this.mapSortDirection = 'desc';
    }
  }

  sortRealBy(column: string): void {
    if (this.realSortColumn === column) {
      this.realSortDirection = this.realSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.realSortColumn = column;
      this.realSortDirection = 'desc';
    }
    // Сюда можно добавить сортировку массива realKdDisplayed при необходимости
  }
}
