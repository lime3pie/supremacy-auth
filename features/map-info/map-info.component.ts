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

  // Вкладки: 'players' (это Map K/D) или 'map' (это Detailed K/D)
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

  // Переключение между вкладками «Map K/D» и «Detailed K/D»
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

  // Кнопка «Refresh» во второй вкладке (Detailed K/D)
  fetchAllWars(): void {
    this.isLoading = true;
    this.loadingProgress = 'Загрузка отчетов о боевых действиях...';

    // ⚠️ Сюда подключается ваш сервис для получения детальной статистики
    // Сейчас здесь стоит тестовый пример, чтобы таблица заполнилась:
    setTimeout(() => {
      this.opponents = [
        {
          name: 'Тестовый Оппонент',
          nation: 'Франция',
          kills: 120,
          deaths: 50,
          kd: '2.40'
        }
      ];
      this.isLoading = false;
      this.hasFetched = true;
      this.loadingProgress = '';
    }, 1000);
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
}
