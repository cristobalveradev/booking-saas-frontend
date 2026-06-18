import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AppointmentCalendar, SERVICE_COLORS } from './AppointmentCalendar';
import { AppointmentModal } from './AppointmentModal';
import { Badge } from './ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createAppointment, deleteAppointment, getAppointments, getServices } from '../api/apiClient';
import { getUpcomingAppointments } from '../../utils/utils';

export function AppointmentsPage() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceColorMap, setServiceColorMap] = useState({});
  const { user, accessToken, authReady} = useAuth();
  const [upcomingAppointments,setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if(!authReady) return;
    
    const loadData = async () => {
      try {
        const data = await getServices(user.id, accessToken);
        setServices(data);
        for(let index in data){
          setServiceColorMap(prev => ({
            ...prev,
            [data[index].id] : SERVICE_COLORS[index],
            
          }))
        }

        
      } catch (err) {
        setError(err.message);
      } 
    };

    loadData();
  }, [authReady]);

  useEffect(()=> {
    if(!authReady) return;
    
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await getAppointments(user.id, accessToken);
        console.log(data)
        setAppointments(data);
        
      const upcomingAppointmentss = data
      .filter(apt => new Date(apt.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
      setUpcomingAppointments(upcomingAppointmentss)
      } catch (err) {
        setError(err.message);
      } finally{
        setLoading(false)
      }
    };

    loadData();
    
    
    
  },[ authReady])

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCreateAppointment = async (serviceId, time) => {
    if (!selectedDate) return;
    const service = services.find(s => s.id === serviceId);
    
    if (!service) return;

    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = time.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));

    const newAppointment = {
      id: Date.now().toString(),
      date: appointmentDate.toISOString().split("T")[0],
      start_time: time,
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      color: serviceColorMap[service.id] || SERVICE_COLORS[0],
      createdAt: new Date().toISOString(),
      userId: user.id
    };

    const data = await createAppointment(newAppointment, accessToken);

    
    const updatedAppointments = [...appointments, data.appointment];
    setAppointments(updatedAppointments);

    const upcomingAppointmentss = updatedAppointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

    setUpcomingAppointments(upcomingAppointmentss)
  };

  const handleDelete = async (id) => {
    
    const res = await deleteAppointment(id, accessToken) // delete appointment in DB
    if(!!res){
      const updatedAppointments = appointments.filter(a => a.id !== id); // Delete apointment on local variable
      setAppointments(updatedAppointments); // update appointments local variable
      const upcomingAppointments = getUpcomingAppointments(updatedAppointments);
      setUpcomingAppointments(upcomingAppointments)
      alert(res.message)
    } else{
      alert("an error ocurred")
    }
  };

  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your salon appointments</p>
        </div>
        
        <Button onClick={() => {
          setSelectedDate(new Date());
          setIsModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Click on any date to book an appointment</CardDescription>
            </CardHeader>
            <CardContent>
              {true && 
              <AppointmentCalendar
                appointments={appointments}
                onDateClick={handleDateClick}
                serviceColorMap={serviceColorMap}
                services={services}
              />
              }
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services?.map((service, index) => (
                  <div key={service.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${serviceColorMap[service.id]}`} />
                    <span className="text-sm">{service.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{service.duration}m</span>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="text-sm text-gray-500">No services created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
          { true && 
            <Card>
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>Next appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map(apt => (
                    <div key={apt.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-1 h-full ${apt.color} rounded-full`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={`${serviceColorMap[apt.service_id]} text-white border-0`}>
                            {services.find(ser => ser.id == apt.service_id)?.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(new Date(apt.date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {apt.start_time.split(":")[0]+":"+apt.start_time.split(":")[1]} ({services.find(ser=> ser.id == apt.service_id).duration} min)
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(apt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {upcomingAppointments.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No upcoming appointments
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          }
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        services={services}
        onCreateAppointment={handleCreateAppointment}
      />
    </div>
  );
}
