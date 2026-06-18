import { useState, useEffect } from 'react';
import { format, set } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

export function AppointmentModal({ isOpen, onClose, selectedDate, services, onCreateAppointment }) {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState('09:00');

  useEffect(() => {
    if (!isOpen) {
     
      setSelectedTime('09:00');
    }
  }, [isOpen]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedService && selectedTime) {
      onCreateAppointment(selectedService.id, selectedTime);
      onClose();
      setSelectedService(null)
    }
  };

  const handleServiceChange = (e) => {
    const service = services.find(ser => ser.id == e)
    setSelectedService(service)
  }

  if (!selectedDate) return null;

  const handleChange = (e) => {
      setSelectedService(e)
  }

  const handleClose = () => { 
    setSelectedService(null);
    onClose();
    console.log("jfhjdf")
  }
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment for {format(selectedDate, 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
            {/* select field for service */}
            <div className="space-y-2">
              <Label htmlFor="service">Select Service</Label>
              
              <Select value={selectedService?.id} onValueChange={handleServiceChange}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           
            </div>

          {/* select field for time */}
          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger id="time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedService && (
            <div className="p-4 bg-blue-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>{selectedTime} - {selectedService.name}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedService}>
              Create Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
