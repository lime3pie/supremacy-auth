async fetchRealKd() {
  if (!this.settings.hup || this.realKdLoading || !this.canViewRealKd) return;
  this.realKdLoading = true;
  this.realKdHasFetched = true;
  this.cdRef.detectChanges();

  let e = this.settings.hup.gameState.getPlayerState(),
      n = (e ? Object.values(e.getPlayers()) : []).filter(i => i.siteUserID > 0).map(i => ({
        playerId: i.playerID,
        siteUserId: i.siteUserID,
        name: i.name,
        nation: i.nationName,
        flagUrl: this.getFlagUrl(i.playerID),
        kills: 0,
        deaths: 0,
        alliance: null,
        allianceId: null
      }));

  try {
    let i = await this.realKdService.getBatch(
      n.map(s => s.siteUserId),
      (s, a) => {
        this.realKdProgress = `Fetching ${s} / ${a}...`;
        this.cdRef.detectChanges();
      },
      s => {
        s && (this.realKdProgress = s, this.cdRef.detectChanges());
      }
    );
    let o = new Map(i.map(s => [s.siteUserId, s]));

    this.realKdRows = n.map(s => {
      let a = o.get(s.siteUserId);
      return a ? {
        ...s,
        name: a.username || s.name, // Подтягиваем настоящий ник!
        kills: a.kills,
        deaths: a.deaths,
        alliance: a.alliance,
        allianceId: a.allianceId
      } : s;
    });

    // 🔥 ОБНОВЛЯЕМ ПЕРВУЮ ВКЛАДКУ РЕАЛЬНЫМИ ДАННЫМИ:
    this.playersKd = [...this.realKdRows];
    this.applyPlayersSort();

  } catch (i) {
    console.error("[SupremacyUtils] Failed to fetch Real K/D stats.", i);
    this.realKdRows = [];
  }

  this.applyRealKdFilter();
  this.realKdLoading = false;
  this.realKdProgress = "";
  this.cdRef.detectChanges();
}
