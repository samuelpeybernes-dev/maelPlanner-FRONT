function getCurrentWeekDays(startDate) {
    const currentDate = new Date(startDate);
    const currentDayOfWeek = currentDate.getDay(); // Jour de la semaine actuel (0 = Dimanche, 1 = Lundi, ...)

    // Si c'est un dimanche (currentDayOfWeek === 0), ajustez la date pour obtenir la semaine actuelle
    if (currentDayOfWeek === 0) {
      currentDate.setDate(currentDate.getDate() - 6); // Remonter de 6 jours pour obtenir le lundi de la semaine actuelle
    } else {
      currentDate.setDate(currentDate.getDate() - currentDayOfWeek + 1); // Réglez la date sur le lundi de la semaine actuelle
    }

    const weekDays = [];
    for (let i = 1; i < 8; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i);
      weekDays.push({
        dayOfWeek: i, // 1 pour Lundi, 2 pour mardi, ...
        date: day.toISOString().split('T')[0], // Date au format 'YYYY-MM-DD'
      });
    }
    return weekDays;

  }

export default getCurrentWeekDays