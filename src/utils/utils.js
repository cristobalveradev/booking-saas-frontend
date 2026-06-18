export function toLowerCase(string){
    return string.toLowerCase()
}

export function getUpcomingAppointments(appointments){
    const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

    return upcomingAppointments;
}